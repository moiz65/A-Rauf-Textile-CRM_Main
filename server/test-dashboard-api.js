// Test script to verify dashboard API endpoints
const mysql = require("mysql2");

// Test database connection
const db = mysql.createConnection({
  host: "localhost",
  user: "root",
  password: "",
  database: "arauf_crm"
});

// Test queries
const testQueries = {
  totalRevenue: `SELECT COALESCE(SUM(total_amount), 0) as total FROM invoice WHERE status = 'Paid'`,
  totalExpenses: `SELECT COALESCE(SUM(amount), 0) as total FROM expenses WHERE status = 'Paid'`,
  totalCustomers: `SELECT COUNT(*) as count FROM customertable`,
  upcomingPayments: `SELECT COALESCE(SUM(total_amount), 0) as total, COUNT(*) as count FROM invoice WHERE status = 'Sent'`,
  overdueInvoices: `SELECT COALESCE(SUM(total_amount), 0) as total, COUNT(*) as count FROM invoice WHERE status = 'Overdue'`,
  monthlyExpenses: `
    SELECT 
      DATE_FORMAT(date, '%Y-%m') as month,
      MONTHNAME(date) as month_name,
      SUM(amount) as total_amount
    FROM expenses 
    WHERE date >= DATE_SUB(CURDATE(), INTERVAL 12 MONTH)
    GROUP BY DATE_FORMAT(date, '%Y-%m'), MONTHNAME(date)
    ORDER BY month ASC
  `
};

console.log('🔍 Testing Dashboard API Queries...\n');

// Test each query
Object.entries(testQueries).forEach(([queryName, query]) => {
  console.log(`📊 Testing ${queryName}...`);
  
  db.query(query, (err, results) => {
    if (err) {
      console.error(`❌ Error in ${queryName}:`, err.message);
    } else {
      console.log(`✅ ${queryName}:`, results);
    }
    console.log('---');
  });
});

// Close connection after a delay
setTimeout(() => {
  console.log('🔚 Test completed. Closing connection...');
  db.end();
  process.exit(0);
}, 3000);