const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);

/**
 * Stripe Service
 * Handles all Stripe payment processing functionality
 */
const stripeService = {
  /**
   * Create a new customer in Stripe
   * @param {Object} customerData - Customer data
   * @returns {Object} - Stripe customer object
   */
  createCustomer: async (customerData) => {
    try {
      const customer = await stripe.customers.create({
        email: customerData.email,
        name: customerData.name,
        metadata: {
          resellerId: customerData.resellerId
        }
      });
      
      return customer;
    } catch (error) {
      console.error('Error creating Stripe customer:', error);
      throw error;
    }
  },
  
  /**
   * Create a subscription for a customer
   * @param {String} customerId - Stripe customer ID
   * @param {String} priceId - Stripe price ID
   * @returns {Object} - Stripe subscription object
   */
  createSubscription: async (customerId, priceId) => {
    try {
      const subscription = await stripe.subscriptions.create({
        customer: customerId,
        items: [{ price: priceId }],
        payment_behavior: 'default_incomplete',
        expand: ['latest_invoice.payment_intent'],
      });
      
      return subscription;
    } catch (error) {
      console.error('Error creating Stripe subscription:', error);
      throw error;
    }
  },
  
  /**
   * Create a checkout session for one-time payment
   * @param {Object} sessionData - Session data
   * @returns {Object} - Stripe checkout session
   */
  createCheckoutSession: async (sessionData) => {
    try {
      const session = await stripe.checkout.sessions.create({
        payment_method_types: ['card'],
        line_items: [
          {
            price: sessionData.priceId,
            quantity: 1,
          },
        ],
        mode: 'payment',
        success_url: `${sessionData.domainUrl}/onboarding/success?session_id={CHECKOUT_SESSION_ID}`,
        cancel_url: `${sessionData.domainUrl}/onboarding/payment`,
        metadata: {
          resellerId: sessionData.resellerId
        },
      });
      
      return session;
    } catch (error) {
      console.error('Error creating checkout session:', error);
      throw error;
    }
  },
  
  /**
   * Create a checkout session for subscription
   * @param {Object} sessionData - Session data
   * @returns {Object} - Stripe checkout session
   */
  createSubscriptionCheckoutSession: async (sessionData) => {
    try {
      const session = await stripe.checkout.sessions.create({
        payment_method_types: ['card'],
        line_items: [
          {
            price: sessionData.priceId,
            quantity: 1,
          },
        ],
        mode: 'subscription',
        success_url: `${sessionData.domainUrl}/onboarding/success?session_id={CHECKOUT_SESSION_ID}`,
        cancel_url: `${sessionData.domainUrl}/onboarding/payment`,
        metadata: {
          resellerId: sessionData.resellerId
        },
      });
      
      return session;
    } catch (error) {
      console.error('Error creating subscription checkout session:', error);
      throw error;
    }
  },
  
  /**
   * Retrieve a checkout session
   * @param {String} sessionId - Stripe session ID
   * @returns {Object} - Stripe session object
   */
  retrieveCheckoutSession: async (sessionId) => {
    try {
      const session = await stripe.checkout.sessions.retrieve(sessionId);
      return session;
    } catch (error) {
      console.error('Error retrieving checkout session:', error);
      throw error;
    }
  },
  
  /**
   * Retrieve a subscription
   * @param {String} subscriptionId - Stripe subscription ID
   * @returns {Object} - Stripe subscription object
   */
  retrieveSubscription: async (subscriptionId) => {
    try {
      const subscription = await stripe.subscriptions.retrieve(subscriptionId);
      return subscription;
    } catch (error) {
      console.error('Error retrieving subscription:', error);
      throw error;
    }
  },
  
  /**
   * Cancel a subscription
   * @param {String} subscriptionId - Stripe subscription ID
   * @returns {Object} - Stripe subscription object
   */
  cancelSubscription: async (subscriptionId) => {
    try {
      const subscription = await stripe.subscriptions.del(subscriptionId);
      return subscription;
    } catch (error) {
      console.error('Error canceling subscription:', error);
      throw error;
    }
  },
  
  /**
   * Create a payment intent
   * @param {Object} paymentData - Payment data
   * @returns {Object} - Stripe payment intent
   */
  createPaymentIntent: async (paymentData) => {
    try {
      const paymentIntent = await stripe.paymentIntents.create({
        amount: paymentData.amount,
        currency: paymentData.currency || 'usd',
        customer: paymentData.customerId,
        metadata: {
          resellerId: paymentData.resellerId
        }
      });
      
      return paymentIntent;
    } catch (error) {
      console.error('Error creating payment intent:', error);
      throw error;
    }
  },
  
  /**
   * Handle webhook events from Stripe
   * @param {String} payload - Raw request body
   * @param {String} sig - Stripe signature header
   * @returns {Object} - Stripe event
   */
  handleWebhookEvent: async (payload, sig) => {
    try {
      const event = stripe.webhooks.constructEvent(
        payload,
        sig,
        process.env.STRIPE_WEBHOOK_SECRET
      );
      
      return event;
    } catch (error) {
      console.error('Error handling webhook event:', error);
      throw error;
    }
  }
};

module.exports = stripeService;
