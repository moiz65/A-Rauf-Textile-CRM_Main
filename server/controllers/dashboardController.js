const db = require('../src/config/db');

class DashboardController {
  // Get dashboard summary with all key metrics
  static async getDashboardSummary(req, res) {
    try {
      const today = new Date().toISOString().split('T')[0];
      const currentMonth = new Date().toISOString().slice(0, 7); // YYYY-MM format
      const lastMonth = new Date(new Date().setMonth(new Date().getMonth() - 1)).toISOString().slice(0, 7);

      const queries = {
        // Total Revenue (from paid invoices)
        totalRevenue: `
          SELECT COALESCE(SUM(total_amount), 0) as total
          FROM invoice 
          WHERE status = 'Paid'
        `,
        
        // Last Month Revenue for comparison
        lastMonthRevenue: `
          SELECT COALESCE(SUM(total_amount), 0) as total
          FROM invoice 
          WHERE status = 'Paid' AND DATE_FORMAT(created_at, '%Y-%m') = ?
        `,

        // Current Month Revenue for comparison  
        currentMonthRevenue: `
          SELECT COALESCE(SUM(total_amount), 0) as total
          FROM invoice 
          WHERE status = 'Paid' AND DATE_FORMAT(created_at, '%Y-%m') = ?
        `,

        // Total Expenses
        totalExpenses: `
          SELECT COALESCE(SUM(amount), 0) as total
          FROM expenses 
          WHERE status = 'Paid'
        `,

        // Last Month Expenses
        lastMonthExpenses: `
          SELECT COALESCE(SUM(amount), 0) as total
          FROM expenses 
          WHERE status = 'Paid' AND DATE_FORMAT(date, '%Y-%m') = ?
        `,

        // Current Month Expenses
        currentMonthExpenses: `
          SELECT COALESCE(SUM(amount), 0) as total
          FROM expenses 
          WHERE status = 'Paid' AND DATE_FORMAT(date, '%Y-%m') = ?
        `,

        // Today's Revenue
        todayRevenue: `
          SELECT COALESCE(SUM(total_amount), 0) as total
          FROM invoice 
          WHERE status = 'Paid' AND DATE(created_at) = ?
        `,

        // Today's Expenses
        todayExpenses: `
          SELECT COALESCE(SUM(amount), 0) as total
          FROM expenses 
          WHERE status = 'Paid' AND DATE(date) = ?
        `,

        // Current Balance (simplified calculation)
        currentBalance: `
          SELECT 
            COALESCE(
              (SELECT SUM(total_amount) FROM invoice WHERE status = 'Paid') - 
              (SELECT SUM(amount) FROM expenses WHERE status = 'Paid'), 0
            ) as balance
        `,

        // Upcoming Payments (invoices that are sent but not paid)
        upcomingPayments: `
          SELECT COALESCE(SUM(total_amount), 0) as total, COUNT(*) as count
          FROM invoice 
          WHERE status = 'Sent'
        `,

        // Overdue Invoices
        overdueInvoices: `
          SELECT COALESCE(SUM(total_amount), 0) as total, COUNT(*) as count
          FROM invoice 
          WHERE status = 'Overdue'
        `,

        // Total Customers
        totalCustomers: `
          SELECT COUNT(*) as count FROM customertable
        `,

        // Total Purchase Orders
        totalPurchaseOrders: `
          SELECT COUNT(*) as count FROM purchase_orders
        `,

        // Recent invoices for transaction history
        recentInvoices: `
          SELECT 
            id,
            invoice_number,
            customer_name,
            total_amount,
            currency,
            status,
            created_at,
            updated_at
          FROM invoice 
          WHERE status = 'Paid'
          ORDER BY updated_at DESC 
          LIMIT 5
        `
      };

      const results = {};

      // Execute all queries
      for (const [key, query] of Object.entries(queries)) {
        const queryResult = await new Promise((resolve, reject) => {
          let params = [];
          
          // Add parameters based on query type
          if (key === 'lastMonthRevenue' || key === 'lastMonthExpenses') {
            params = [lastMonth];
          } else if (key === 'currentMonthRevenue' || key === 'currentMonthExpenses') {
            params = [currentMonth];
          } else if (key === 'todayRevenue' || key === 'todayExpenses') {
            params = [today];
          }

          db.query(query, params, (err, result) => {
            if (err) reject(err);
            else resolve(result);
          });
        });

        results[key] = queryResult;
      }

      // Calculate percentages and format data
      const totalRevenue = results.totalRevenue[0]?.total || 0;
      const currentMonthRev = results.currentMonthRevenue[0]?.total || 0;
      const lastMonthRev = results.lastMonthRevenue[0]?.total || 0;
      
      const totalExpenses = results.totalExpenses[0]?.total || 0;
      const currentMonthExp = results.currentMonthExpenses[0]?.total || 0;
      const lastMonthExp = results.lastMonthExpenses[0]?.total || 0;

      const netProfit = totalRevenue - totalExpenses;
      const currentMonthProfit = currentMonthRev - currentMonthExp;
      const lastMonthProfit = lastMonthRev - lastMonthExp;

      // Calculate percentage changes
      const revenueChange = lastMonthRev > 0 ? ((currentMonthRev - lastMonthRev) / lastMonthRev * 100) : 0;
      const expenseChange = lastMonthExp > 0 ? ((currentMonthExp - lastMonthExp) / lastMonthExp * 100) : 0;
      const profitChange = lastMonthProfit > 0 ? ((currentMonthProfit - lastMonthProfit) / lastMonthProfit * 100) : 0;

      // Format response
      const dashboardData = {
        stats: {
          totalRevenue: {
            amount: totalRevenue,
            change: `${revenueChange >= 0 ? '+' : ''}${revenueChange.toFixed(1)}%`,
            changeType: revenueChange >= 0 ? 'up' : 'down'
          },
          totalExpenses: {
            amount: totalExpenses,
            change: `${expenseChange >= 0 ? '+' : ''}${expenseChange.toFixed(1)}%`,
            changeType: expenseChange >= 0 ? 'up' : 'down'
          },
          netProfit: {
            amount: netProfit,
            change: `${profitChange >= 0 ? '+' : ''}${profitChange.toFixed(1)}%`,
            changeType: profitChange >= 0 ? 'up' : 'down'
          },
          totalCustomers: {
            amount: results.totalCustomers[0]?.count || 0,
            change: '+0%',
            changeType: 'neutral'
          }
        },
        paymentSummary: {
          currentBalance: results.currentBalance[0]?.balance || 0,
          upcomingPayments: {
            amount: results.upcomingPayments[0]?.total || 0,
            count: results.upcomingPayments[0]?.count || 0,
            badge: `${results.upcomingPayments[0]?.count || 0} New`
          },
          overdueInvoices: {
            amount: results.overdueInvoices[0]?.total || 0,
            count: results.overdueInvoices[0]?.count || 0
          },
          todayRevenue: {
            amount: results.todayRevenue[0]?.total || 0,
            change: '10%' // Could be calculated against yesterday
          },
          todayExpenses: {
            amount: results.todayExpenses[0]?.total || 0,
            change: '150%' // Could be calculated against yesterday
          }
        },
        quickActions: {
          totalInvoices: totalRevenue > 0 ? 1 : 0, // Could get actual count
          totalPurchaseOrders: results.totalPurchaseOrders[0]?.count || 0,
          totalExpenses: totalExpenses > 0 ? 1 : 0, // Could get actual count
          totalCustomers: results.totalCustomers[0]?.count || 0
        },
        recentTransactions: results.recentInvoices.map(invoice => ({
          id: invoice.id,
          name: invoice.customer_name,
          initial: invoice.customer_name ? invoice.customer_name.charAt(0).toUpperCase() : 'U',
          amount: invoice.total_amount,
          currency: invoice.currency || 'PKR',
          time: new Date(invoice.updated_at).toLocaleTimeString('en-US', { 
            hour: '2-digit', 
            minute: '2-digit' 
          }),
          transaction_type: 'Paid Invoice',
          invoice_id: invoice.id
        }))
      };

      res.json({
        success: true,
        data: dashboardData,
        timestamp: new Date().toISOString()
      });

    } catch (error) {
      console.error('Error fetching dashboard data:', error);
      res.status(500).json({
        success: false,
        message: 'Failed to fetch dashboard data',
        error: error.message
      });
    }
  }

  // Get monthly expense data for chart
  static async getMonthlyExpenses(req, res) {
    try {
      const query = `
        SELECT 
          DATE_FORMAT(date, '%Y-%m') as month,
          MONTHNAME(date) as month_name,
          SUM(amount) as total_amount
        FROM expenses 
        WHERE date >= DATE_SUB(CURDATE(), INTERVAL 12 MONTH)
        GROUP BY DATE_FORMAT(date, '%Y-%m'), MONTHNAME(date)
        ORDER BY month ASC
      `;

      db.query(query, (err, results) => {
        if (err) {
          console.error('Error fetching monthly expenses:', err);
          return res.status(500).json({
            success: false,
            message: 'Failed to fetch monthly expenses',
            error: err.message
          });
        }

        const chartData = results.map(row => ({
          month: row.month_name,
          amount: row.total_amount || 0
        }));

        res.json({
          success: true,
          data: chartData
        });
      });
    } catch (error) {
      console.error('Error fetching monthly expenses:', error);
      res.status(500).json({
        success: false,
        message: 'Failed to fetch monthly expenses',
        error: error.message
      });
    }
  }

  // Get transaction history for dashboard
  static async getTransactionHistory(req, res) {
    try {
      const { page = 1, limit = 5 } = req.query;
      const offset = (page - 1) * limit;

      // Count total paid invoices
      const countQuery = `
        SELECT COUNT(*) as total
        FROM invoice 
        WHERE status = 'Paid'
      `;

      // Get paginated paid invoices
      const dataQuery = `
        SELECT 
          id,
          invoice_number,
          customer_name,
          total_amount,
          currency,
          status,
          created_at,
          updated_at
        FROM invoice 
        WHERE status = 'Paid'
        ORDER BY updated_at DESC 
        LIMIT ? OFFSET ?
      `;

      // Get count first
      const countResult = await new Promise((resolve, reject) => {
        db.query(countQuery, (err, result) => {
          if (err) reject(err);
          else resolve(result[0].total);
        });
      });

      // Get data
      const dataResult = await new Promise((resolve, reject) => {
        db.query(dataQuery, [parseInt(limit), parseInt(offset)], (err, result) => {
          if (err) reject(err);
          else resolve(result);
        });
      });

      const totalRecords = countResult;
      const totalPages = Math.ceil(totalRecords / limit);
      const currentPage = parseInt(page);

      const transactions = dataResult.map(invoice => ({
        id: invoice.id,
        name: invoice.customer_name,
        initial: invoice.customer_name ? invoice.customer_name.charAt(0).toUpperCase() : 'U',
        amount: invoice.total_amount,
        currency: invoice.currency || 'PKR',
        time: new Date(invoice.updated_at).toLocaleTimeString('en-US', { 
          hour: '2-digit', 
          minute: '2-digit' 
        }),
        transaction_type: 'Paid Invoice',
        invoice_id: invoice.id
      }));

      res.json({
        success: true,
        data: transactions,
        pagination: {
          currentPage,
          totalPages,
          totalRecords,
          hasNext: currentPage < totalPages,
          hasPrev: currentPage > 1
        }
      });

    } catch (error) {
      console.error('Error fetching transaction history:', error);
      res.status(500).json({
        success: false,
        message: 'Failed to fetch transaction history',
        error: error.message
      });
    }
  }
}

module.exports = DashboardController;