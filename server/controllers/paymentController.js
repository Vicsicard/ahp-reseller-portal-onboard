const Reseller = require('../models/Reseller');
const stripeService = require('../utils/stripeService');

/**
 * Payment Controller
 * Handles payment processing for reseller onboarding
 */
const paymentController = {
  /**
   * Create a checkout session for reseller onboarding payment
   * @param {Object} req - Express request object
   * @param {Object} res - Express response object
   * @returns {Object} - Response with checkout session URL or error
   */
  createCheckoutSession: async (req, res) => {
    try {
      const { resellerId, planId } = req.body;
      
      // Validate required fields
      if (!resellerId || !planId) {
        return res.status(400).json({
          success: false,
          message: 'Missing required fields: resellerId and planId'
        });
      }
      
      // Find the reseller
      const reseller = await Reseller.findById(resellerId);
      
      if (!reseller) {
        return res.status(404).json({
          success: false,
          message: 'Reseller not found'
        });
      }
      
      // Get the price ID based on the plan
      let priceId;
      switch (planId) {
        case 'basic':
          priceId = process.env.STRIPE_BASIC_PRICE_ID;
          break;
        case 'pro':
          priceId = process.env.STRIPE_PRO_PRICE_ID;
          break;
        case 'enterprise':
          priceId = process.env.STRIPE_ENTERPRISE_PRICE_ID;
          break;
        default:
          return res.status(400).json({
            success: false,
            message: 'Invalid plan ID'
          });
      }
      
      // Create checkout session
      const session = await stripeService.createSubscriptionCheckoutSession({
        priceId,
        resellerId,
        domainUrl: process.env.BASE_URL || 'http://localhost:3000'
      });
      
      // Return the checkout session URL
      return res.status(200).json({
        success: true,
        url: session.url
      });
    } catch (error) {
      console.error('Error creating checkout session:', error);
      return res.status(500).json({
        success: false,
        message: 'Server error while creating checkout session'
      });
    }
  },
  
  /**
   * Handle successful checkout completion
   * @param {Object} req - Express request object
   * @param {Object} res - Express response object
   * @returns {Object} - Response with payment status or error
   */
  handleCheckoutSuccess: async (req, res) => {
    try {
      const { session_id } = req.query;
      
      if (!session_id) {
        return res.status(400).json({
          success: false,
          message: 'Missing session ID'
        });
      }
      
      // Retrieve the checkout session
      const session = await stripeService.retrieveCheckoutSession(session_id);
      
      if (!session) {
        return res.status(404).json({
          success: false,
          message: 'Session not found'
        });
      }
      
      // Get the reseller ID from the session metadata
      const resellerId = session.metadata.resellerId;
      
      // Update the reseller with payment information
      const reseller = await Reseller.findByIdAndUpdate(
        resellerId,
        {
          'payment.status': 'paid',
          'payment.stripeCustomerId': session.customer,
          'payment.stripeSubscriptionId': session.subscription,
          'payment.plan': session.metadata.planId || 'basic',
          'payment.paidAt': new Date(),
          status: 'approved' // Automatically approve reseller upon successful payment
        },
        { new: true }
      );
      
      if (!reseller) {
        return res.status(404).json({
          success: false,
          message: 'Reseller not found'
        });
      }
      
      return res.status(200).json({
        success: true,
        message: 'Payment successful',
        data: {
          resellerId: reseller._id,
          status: reseller.status,
          paymentStatus: reseller.payment.status,
          plan: reseller.payment.plan
        }
      });
    } catch (error) {
      console.error('Error handling checkout success:', error);
      return res.status(500).json({
        success: false,
        message: 'Server error while processing payment confirmation'
      });
    }
  },
  
  /**
   * Handle Stripe webhook events
   * @param {Object} req - Express request object
   * @param {Object} res - Express response object
   * @returns {Object} - Response acknowledging webhook receipt
   */
  handleWebhook: async (req, res) => {
    const sig = req.headers['stripe-signature'];
    
    try {
      const event = await stripeService.handleWebhookEvent(req.rawBody, sig);
      
      // Handle the event based on its type
      switch (event.type) {
        case 'checkout.session.completed':
          // Payment was successful
          const session = event.data.object;
          const resellerId = session.metadata.resellerId;
          
          // Update reseller payment status
          await Reseller.findByIdAndUpdate(
            resellerId,
            {
              'payment.status': 'paid',
              'payment.stripeCustomerId': session.customer,
              'payment.stripeSubscriptionId': session.subscription,
              'payment.paidAt': new Date(),
              status: 'approved' // Automatically approve reseller upon successful payment
            }
          );
          break;
          
        case 'invoice.payment_succeeded':
          // Subscription payment succeeded
          const invoice = event.data.object;
          
          // Find reseller by Stripe customer ID
          const resellerByCustomer = await Reseller.findOne({
            'payment.stripeCustomerId': invoice.customer
          });
          
          if (resellerByCustomer) {
            await Reseller.findByIdAndUpdate(
              resellerByCustomer._id,
              {
                'payment.status': 'paid',
                'payment.lastPaymentAt': new Date()
              }
            );
          }
          break;
          
        case 'invoice.payment_failed':
          // Subscription payment failed
          const failedInvoice = event.data.object;
          
          // Find reseller by Stripe customer ID
          const resellerWithFailedPayment = await Reseller.findOne({
            'payment.stripeCustomerId': failedInvoice.customer
          });
          
          if (resellerWithFailedPayment) {
            await Reseller.findByIdAndUpdate(
              resellerWithFailedPayment._id,
              {
                'payment.status': 'failed'
              }
            );
          }
          break;
          
        case 'customer.subscription.deleted':
          // Subscription was canceled
          const subscription = event.data.object;
          
          // Find reseller by Stripe subscription ID
          const resellerWithCanceledSub = await Reseller.findOne({
            'payment.stripeSubscriptionId': subscription.id
          });
          
          if (resellerWithCanceledSub) {
            await Reseller.findByIdAndUpdate(
              resellerWithCanceledSub._id,
              {
                'payment.status': 'canceled',
                status: 'inactive' // Deactivate reseller when subscription is canceled
              }
            );
          }
          break;
          
        default:
          // Unhandled event type
          console.log(`Unhandled event type: ${event.type}`);
      }
      
      // Return a 200 response to acknowledge receipt of the event
      return res.status(200).json({ received: true });
    } catch (error) {
      console.error('Error handling webhook:', error);
      return res.status(400).json({ received: false });
    }
  },
  
  /**
   * Get available subscription plans
   * @param {Object} req - Express request object
   * @param {Object} res - Express response object
   * @returns {Object} - Response with plans data or error
   */
  getPlans: async (req, res) => {
    try {
      // Define available plans
      const plans = [
        {
          id: 'basic',
          name: 'Basic',
          price: 49.99,
          interval: 'month',
          features: [
            'Branded landing page',
            'Customer tracking',
            'Basic analytics',
            'Email support'
          ]
        },
        {
          id: 'pro',
          name: 'Professional',
          price: 99.99,
          interval: 'month',
          features: [
            'All Basic features',
            'Advanced analytics',
            'Priority customer support',
            'Custom domain',
            'Unlimited customers'
          ]
        },
        {
          id: 'enterprise',
          name: 'Enterprise',
          price: 199.99,
          interval: 'month',
          features: [
            'All Professional features',
            'White-label solution',
            'Dedicated account manager',
            'API access',
            'Custom integrations'
          ]
        }
      ];
      
      return res.status(200).json({
        success: true,
        data: plans
      });
    } catch (error) {
      console.error('Error fetching plans:', error);
      return res.status(500).json({
        success: false,
        message: 'Server error while fetching plans'
      });
    }
  }
};

module.exports = paymentController;
