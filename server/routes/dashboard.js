const express = require('express');
const router = express.Router();
const DashboardController = require('../controllers/dashboardController');

// Dashboard summary with all key metrics
router.get('/summary', DashboardController.getDashboardSummary);

// Monthly expenses for chart
router.get('/monthly-expenses', DashboardController.getMonthlyExpenses);

// Transaction history - also add this to main transaction-history endpoint for compatibility
router.get('/transactions', DashboardController.getTransactionHistory);

module.exports = router;