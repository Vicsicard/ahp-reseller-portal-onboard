const Customer = require('../models/Customer');
const Reseller = require('../models/Reseller');

/**
 * Analytics Service
 * Handles data aggregation and reporting for reseller dashboards
 */
const analyticsService = {
  /**
   * Get customer acquisition metrics for a reseller
   * @param {String} resellerId - Reseller ID
   * @param {Object} options - Query options (timeframe, etc.)
   * @returns {Object} - Customer acquisition metrics
   */
  getCustomerAcquisitionMetrics: async (resellerId, options = {}) => {
    try {
      const { startDate, endDate } = options;
      
      // Build query
      const query = { reseller: resellerId };
      
      // Add date range if provided
      if (startDate && endDate) {
        query.createdAt = {
          $gte: new Date(startDate),
          $lte: new Date(endDate)
        };
      }
      
      // Get total customers
      const totalCustomers = await Customer.countDocuments(query);
      
      // Get customers by status
      const customersByStatus = await Customer.aggregate([
        { $match: query },
        { $group: {
          _id: '$status',
          count: { $sum: 1 }
        }}
      ]);
      
      // Format customers by status
      const statusCounts = {
        pending: 0,
        active: 0,
        inactive: 0
      };
      
      customersByStatus.forEach(status => {
        statusCounts[status._id] = status.count;
      });
      
      // Get customers by date (for trend analysis)
      const customersByDate = await Customer.aggregate([
        { $match: query },
        { $group: {
          _id: {
            year: { $year: '$createdAt' },
            month: { $month: '$createdAt' },
            day: { $dayOfMonth: '$createdAt' }
          },
          count: { $sum: 1 }
        }},
        { $sort: { '_id.year': 1, '_id.month': 1, '_id.day': 1 } }
      ]);
      
      // Format customers by date
      const customerTrend = customersByDate.map(item => ({
        date: `${item._id.year}-${item._id.month.toString().padStart(2, '0')}-${item._id.day.toString().padStart(2, '0')}`,
        count: item.count
      }));
      
      // Get customers by referral source (UTM)
      const customersBySource = await Customer.aggregate([
        { $match: query },
        { $group: {
          _id: '$utmSource',
          count: { $sum: 1 }
        }},
        { $sort: { count: -1 } },
        { $limit: 5 }
      ]);
      
      // Format customers by source
      const topSources = customersBySource.map(source => ({
        source: source._id || 'direct',
        count: source.count
      }));
      
      return {
        totalCustomers,
        statusCounts,
        customerTrend,
        topSources
      };
    } catch (error) {
      console.error('Error getting customer acquisition metrics:', error);
      throw error;
    }
  },
  
  /**
   * Get revenue metrics for a reseller
   * @param {String} resellerId - Reseller ID
   * @param {Object} options - Query options (timeframe, etc.)
   * @returns {Object} - Revenue metrics
   */
  getRevenueMetrics: async (resellerId, options = {}) => {
    try {
      // This would typically pull data from a payments/transactions collection
      // For now, we'll return mock data since we haven't implemented actual payment tracking yet
      
      return {
        totalRevenue: 1250.75,
        currentMonthRevenue: 450.25,
        revenueByMonth: [
          { month: '2025-01', amount: 350.50 },
          { month: '2025-02', amount: 450.00 },
          { month: '2025-03', amount: 450.25 }
        ],
        averageRevenuePerCustomer: 125.08
      };
    } catch (error) {
      console.error('Error getting revenue metrics:', error);
      throw error;
    }
  },
  
  /**
   * Get landing page performance metrics
   * @param {String} resellerId - Reseller ID
   * @param {Object} options - Query options (timeframe, etc.)
   * @returns {Object} - Landing page metrics
   */
  getLandingPageMetrics: async (resellerId, options = {}) => {
    try {
      const { startDate, endDate } = options;
      
      // Get reseller with analytics data
      const reseller = await Reseller.findById(resellerId);
      
      if (!reseller || !reseller.analytics) {
        throw new Error('Reseller analytics data not found');
      }
      
      // Calculate conversion rate
      const visits = reseller.analytics.landingPageVisits || 0;
      const signups = reseller.analytics.totalCustomers || 0;
      const conversionRate = visits > 0 ? (signups / visits) * 100 : 0;
      
      return {
        totalVisits: visits,
        uniqueVisits: reseller.analytics.uniqueVisitors || 0,
        conversionRate: conversionRate.toFixed(2),
        averageTimeOnPage: reseller.analytics.averageTimeOnPage || '00:01:45',
        bounceRate: reseller.analytics.bounceRate || 65.4
      };
    } catch (error) {
      console.error('Error getting landing page metrics:', error);
      throw error;
    }
  },
  
  /**
   * Get dashboard summary metrics
   * @param {String} resellerId - Reseller ID
   * @returns {Object} - Dashboard summary metrics
   */
  getDashboardSummary: async (resellerId) => {
    try {
      // Get reseller data
      const reseller = await Reseller.findById(resellerId);
      
      if (!reseller) {
        throw new Error('Reseller not found');
      }
      
      // Get customer count
      const customerCount = await Customer.countDocuments({ reseller: resellerId });
      
      // Get recent customers
      const recentCustomers = await Customer.find({ reseller: resellerId })
        .sort({ createdAt: -1 })
        .limit(5)
        .select('fullName companyName email createdAt');
      
      // Get customer acquisition metrics for current month
      const now = new Date();
      const firstDayOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
      const lastDayOfMonth = new Date(now.getFullYear(), now.getMonth() + 1, 0);
      
      const currentMonthCustomers = await Customer.countDocuments({
        reseller: resellerId,
        createdAt: {
          $gte: firstDayOfMonth,
          $lte: lastDayOfMonth
        }
      });
      
      // Get customer acquisition metrics for previous month
      const firstDayOfPrevMonth = new Date(now.getFullYear(), now.getMonth() - 1, 1);
      const lastDayOfPrevMonth = new Date(now.getFullYear(), now.getMonth(), 0);
      
      const previousMonthCustomers = await Customer.countDocuments({
        reseller: resellerId,
        createdAt: {
          $gte: firstDayOfPrevMonth,
          $lte: lastDayOfPrevMonth
        }
      });
      
      // Calculate growth rate
      const growthRate = previousMonthCustomers > 0 
        ? ((currentMonthCustomers - previousMonthCustomers) / previousMonthCustomers) * 100 
        : 100;
      
      return {
        resellerName: reseller.businessInfo.companyName,
        resellerStatus: reseller.status,
        customerCount,
        currentMonthCustomers,
        growthRate: growthRate.toFixed(2),
        landingPageVisits: reseller.analytics?.landingPageVisits || 0,
        recentCustomers,
        plan: reseller.payment?.plan || 'basic'
      };
    } catch (error) {
      console.error('Error getting dashboard summary:', error);
      throw error;
    }
  }
};

module.exports = analyticsService;
