// --- Required Modules ---
const express = require("express");
const cors = require("cors");
const path = require("path");
const mysql = require("mysql2");
const bodyParser = require("body-parser");

// --- Initialize Express App ---
const app = express();
app.use(cors());
app.use(express.json());
app.use(bodyParser.json());

// --- MySQL Database Connection ---
const db = mysql.createConnection({
  host: "localhost",
  user: "root",
  password: "",
  database: "arauf_crm"
});

// Connect to MySQL
db.connect((err) => {
  if (err) {
    console.error("Error connecting to MySQL:", err);
    return;
  }
  console.log("Connected to MySQL database");
});

// --- Expense Routes ---

// Get all expenses with optional filtering
app.get("/api/expenses", (req, res) => {
  const { category, status, vendor, minAmount, maxAmount, startDate, endDate } = req.query;
  
  let query = "SELECT * FROM expenses WHERE 1=1";
  const params = [];
  
  if (category && category !== 'All') {
    query += " AND category = ?";
    params.push(category);
  }
  
  if (status && status !== 'All') {
    query += " AND status = ?";
    params.push(status);
  }
  
  if (vendor) {
    query += " AND vendor LIKE ?";
    params.push(`%${vendor}%`);
  }
  
  if (minAmount) {
    query += " AND amount >= ?";
    params.push(parseFloat(minAmount));
  }
  
  if (maxAmount) {
    query += " AND amount <= ?";
    params.push(parseFloat(maxAmount));
  }
  
  if (startDate) {
    query += " AND date >= ?";
    params.push(startDate);
  }
  
  if (endDate) {
    query += " AND date <= ?";
    params.push(endDate);
  }
  
  query += " ORDER BY date DESC, created_at DESC";
  
  db.query(query, params, (err, results) => {
    if (err) {
      console.error("Error fetching expenses:", err.message);
      return res.status(500).json({ message: "Failed to fetch expenses", error: err.message });
    }
    res.json(results);
  });
});

// Get single expense by ID
app.get("/api/expenses/:id", (req, res) => {
  const { id } = req.params;
  
  const query = "SELECT * FROM expenses WHERE id = ?";
  db.query(query, [id], (err, results) => {
    if (err) {
      console.error("Error fetching expense:", err.message);
      return res.status(500).json({ message: "Failed to fetch expense", error: err.message });
    }
    
    if (results.length === 0) {
      return res.status(404).json({ message: "Expense not found" });
    }
    
    res.json(results[0]);
  });
});

// Create new expense
app.post("/api/expenses", (req, res) => {
  const {
    title,
    date,
    vendor,
    amount,
    category,
    paymentMethod,
    status = 'Pending',
    description = ''
  } = req.body;

  // Validate required fields
  if (!title || !date || !vendor || !amount || !category || !paymentMethod) {
    return res.status(400).json({ message: "Missing required fields" });
  }

  const query = `
    INSERT INTO expenses (title, date, vendor, amount, category, paymentMethod, status, description)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?)
  `;
  const values = [title, date, vendor, amount, category, paymentMethod, status, description];

  db.query(query, values, (err, result) => {
    if (err) {
      console.error("Error creating expense:", err.message);
      return res.status(500).json({ message: "Failed to create expense", error: err.message });
    }
    
    // Return the newly created expense
    const newExpenseId = result.insertId;
    const selectQuery = "SELECT * FROM expenses WHERE id = ?";
    
    db.query(selectQuery, [newExpenseId], (err, results) => {
      if (err) {
        console.error("Error fetching created expense:", err.message);
        return res.status(500).json({ message: "Expense created but failed to retrieve details", error: err.message });
      }
      
      res.status(201).json({
        message: "Expense created successfully",
        expense: results[0]
      });
    });
  });
});

// Update expense
app.put("/api/expenses/:id", (req, res) => {
  const expenseId = req.params.id;
  const {
    title,
    date,
    vendor,
    amount,
    category,
    paymentMethod,
    status,
    description
  } = req.body;

  // Validate required fields
  if (!title || !date || !vendor || !amount || !category || !paymentMethod || !status) {
    return res.status(400).json({ message: "Missing required fields" });
  }

  const query = `
    UPDATE expenses 
    SET title = ?, date = ?, vendor = ?, amount = ?, category = ?, paymentMethod = ?, status = ?, description = ?
    WHERE id = ?
  `;
  const values = [title, date, vendor, amount, category, paymentMethod, status, description, expenseId];

  db.query(query, values, (err, result) => {
    if (err) {
      console.error("Error updating expense:", err.message);
      return res.status(500).json({ message: "Failed to update expense", error: err.message });
    }
    
    if (result.affectedRows === 0) {
      return res.status(404).json({ message: "Expense not found" });
    }
    
    // Return the updated expense
    const selectQuery = "SELECT * FROM expenses WHERE id = ?";
    db.query(selectQuery, [expenseId], (err, results) => {
      if (err) {
        console.error("Error fetching updated expense:", err.message);
        return res.status(500).json({ message: "Expense updated but failed to retrieve details", error: err.message });
      }
      
      res.json({
        message: "Expense updated successfully",
        expense: results[0]
      });
    });
  });
});

// Delete expense
app.delete("/api/expenses/:id", (req, res) => {
  const { id } = req.params;

  // First, get the expense to return details in response
  const selectQuery = "SELECT * FROM expenses WHERE id = ?";
  db.query(selectQuery, [id], (err, results) => {
    if (err) {
      console.error("Error fetching expense for deletion:", err.message);
      return res.status(500).json({ message: "Failed to delete expense", error: err.message });
    }
    
    if (results.length === 0) {
      return res.status(404).json({ message: "Expense not found" });
    }
    
    const deletedExpense = results[0];
    
    // Now delete the expense
    const deleteQuery = "DELETE FROM expenses WHERE id = ?";
    db.query(deleteQuery, [id], (err, result) => {
      if (err) {
        console.error("Error deleting expense:", err.message);
        return res.status(500).json({ message: "Failed to delete expense", error: err.message });
      }
      
      res.json({
        message: "Expense deleted successfully",
        expense: deletedExpense
      });
    });
  });
});

// Get expense statistics (for dashboard)
app.get("/api/expenses-stats", (req, res) => {
  const queries = [
    "SELECT COUNT(*) as total FROM expenses",
    "SELECT COUNT(*) as pending FROM expenses WHERE status = 'Pending'",
    "SELECT COUNT(*) as paid FROM expenses WHERE status = 'Paid'",
    "SELECT SUM(amount) as totalAmount FROM expenses WHERE status = 'Paid'",
    "SELECT category, COUNT(*) as count, SUM(amount) as total FROM expenses GROUP BY category"
  ];

  db.query(queries.join(';'), (err, results) => {
    if (err) {
      console.error("Error fetching expense statistics:", err.message);
      return res.status(500).json({ message: "Failed to fetch expense statistics", error: err.message });
    }
    
    const stats = {
      total: results[0][0].total,
      pending: results[1][0].pending,
      paid: results[2][0].paid,
      totalAmount: results[3][0].totalAmount || 0,
      byCategory: results[4]
    };
    
    res.json(stats);
  });
});

// Get expenses by date range for charts
app.get("/api/expenses-chart", (req, res) => {
  const { year = new Date().getFullYear() } = req.query;
  
  const query = `
    SELECT 
      MONTH(date) as month,
      YEAR(date) as year,
      SUM(amount) as total,
      COUNT(*) as count,
      category
    FROM expenses 
    WHERE YEAR(date) = ?
    GROUP BY YEAR(date), MONTH(date), category
    ORDER BY year, month
  `;
  
  db.query(query, [year], (err, results) => {
    if (err) {
      console.error("Error fetching chart data:", err.message);
      return res.status(500).json({ message: "Failed to fetch chart data", error: err.message });
    }
    
    res.json(results);
  });
});

// Get expense chart data for dashboard visualization
app.get("/api/expense-chart-data", (req, res) => {
  const query = `
    SELECT 
      DATE_FORMAT(date, '%b') as month,
      YEAR(date) as year,
      SUM(amount) as amount,
      CASE 
        WHEN SUM(amount) > COALESCE(
          (SELECT SUM(amount) 
           FROM expenses e2 
           WHERE YEAR(e2.date) = YEAR(e1.date) 
           AND MONTH(e2.date) = MONTH(e1.date) - 1
          ), 0) THEN 'up'
        ELSE 'down'
      END as trend
    FROM expenses e1
    WHERE date >= DATE_SUB(NOW(), INTERVAL 2 YEAR)
    GROUP BY YEAR(date), MONTH(date)
    ORDER BY year, MONTH(date)
  `;

  db.query(query, (err, results) => {
    if (err) {
      console.error("Error fetching expense chart data:", err);
      return res.status(500).json({ error: "Failed to fetch expense chart data" });
    }
    res.json(results);
  });
});

// Get all customers
app.get("/api/v1/customertable", (req, res) => {
  db.query("SELECT * FROM customertable ORDER BY created_at DESC", (err, results) => {
    if (err) {
      console.error("Error fetching customers:", err.message);
      return res.status(500).json({ message: "Failed to fetch customers", error: err.message });
    }
    res.json(results);
  });
});

// Create a new customer
app.post("/api/v1/customertable", (req, res) => {
  const { customer, company, date, phone, address, email } = req.body;

  // Validate required fields
  if (!customer || !date || !phone || !address || !email) {
    return res.status(400).json({ message: "Missing required fields" });
  }

  const query = `
    INSERT INTO customertable (customer, company, date, phone, address, email)
    VALUES (?, ?, ?, ?, ?, ?)
  `;
  const values = [customer, company, date, phone, address, email];

  db.query(query, values, (err, result) => {
    if (err) {
      console.error("Error creating customer:", err.message);
      return res.status(500).json({ message: "Failed to create customer", error: err.message });
    }
    
    // Return the newly created customer
    const selectQuery = "SELECT * FROM customertable WHERE customer_id = ?";
    db.query(selectQuery, [result.insertId], (err, results) => {
      if (err) {
        console.error("Error fetching created customer:", err.message);
        return res.status(500).json({ message: "Customer created but failed to retrieve details", error: err.message });
      }
      
      res.status(201).json({
        message: "Customer created successfully",
        customer: results[0]
      });
    });
  });
});

// Update a customer
app.put("/api/v1/customertable/:id", (req, res) => {
  const customerId = req.params.id;
  const { customer, company, date, phone, address, email } = req.body;

  // Validate required fields
  if (!customer || !date || !phone || !address || !email) {
    return res.status(400).json({ message: "Missing required fields" });
  }

  const query = `
    UPDATE customertable
    SET customer = ?, company = ?, date = ?, phone = ?, address = ?, email = ?
    WHERE customer_id = ?
  `;
  const values = [customer, company, date, phone, address, email, customerId];

  db.query(query, values, (err, result) => {
    if (err) {
      console.error("Error updating customer:", err.message);
      return res.status(500).json({ message: "Failed to update customer", error: err.message });
    }
    
    if (result.affectedRows === 0) {
      return res.status(404).json({ message: "Customer not found" });
    }
    
    // Return the updated customer
    const selectQuery = "SELECT * FROM customertable WHERE customer_id = ?";
    db.query(selectQuery, [customerId], (err, results) => {
      if (err) {
        console.error("Error fetching updated customer:", err.message);
        return res.status(500).json({ message: "Customer updated but failed to retrieve details", error: err.message });
      }
      
      res.json({
        message: "Customer updated successfully",
        customer: results[0]
      });
    });
  });
});

// Delete a customer
app.delete("/api/v1/customertable/:id", (req, res) => {
  const { id } = req.params;

  // First, get the customer to return details in response
  const selectQuery = "SELECT * FROM customertable WHERE customer_id = ?";
  db.query(selectQuery, [id], (err, results) => {
    if (err) {
      console.error("Error fetching customer for deletion:", err.message);
      return res.status(500).json({ message: "Failed to delete customer", error: err.message });
    }
    
    if (results.length === 0) {
      return res.status(404).json({ message: "Customer not found" });
    }
    
    const deletedCustomer = results[0];
    
    // Now delete the customer
    const deleteQuery = "DELETE FROM customertable WHERE customer_id = ?";
    db.query(deleteQuery, [id], (err, result) => {
      if (err) {
        console.error("Error deleting customer:", err.message);
        return res.status(500).json({ message: "Failed to delete customer", error: err.message });
      }
      
      res.json({
        message: "Customer deleted successfully",
        customer: deletedCustomer
      });
    });
  });
});

// --- User Signup & Login ---

// Signup endpoint
app.post("/signup", (req, res) => {
  const { firstName, lastName, email, password } = req.body;

  // Validate required fields
  if (!firstName || !lastName || !email || !password) {
    return res.status(400).json({ message: "All fields are required" });
  }

  const query = "INSERT INTO users (firstName, lastName, email, password) VALUES (?, ?, ?, ?)";
  const values = [firstName, lastName, email, password];

  db.query(query, values, (err, result) => {
    if (err) {
      console.error("Error signing up:", err.message);
      return res.status(500).json({ message: "Failed to signup", error: err.message });
    }
    res.status(201).json({ message: "User created successfully", insertId: result.insertId });
  });
});

// Login endpoint
app.post("/login", (req, res) => {
  const { email, password } = req.body;

  // Validate required fields
  if (!email || !password) {
    return res.status(400).json({ message: "Email and password are required" });
  }

  const query = "SELECT * FROM users WHERE email = ? AND password = ?";
  const values = [email, password];

  db.query(query, values, (err, results) => {
    if (err) {
      console.error("Error logging in:", err.message);
      return res.status(500).json({ message: "Failed to login", error: err.message });
    }
    if (results.length > 0) {
      res.json({ success: true, user: results[0] });
    } else {
      res.status(401).json({ success: false, message: "Invalid email or password" });
    }
  });
});

// --- Report Routes ---

// Get all reports
app.get("/api/v1/reports", (req, res) => {
  db.query("SELECT * FROM reporttable", (err, results) => {
    if (err) {
      console.error("Error fetching reports:", err.message);
      return res.status(500).json({ message: "Failed to fetch reports", error: err.message });
    }
    res.json(results);
  });
});

// Create a new report
app.post("/api/v1/reports", (req, res) => {
  const { id, date, customer, price, status } = req.body;

  // Validate required fields
  if (!id || !date || !customer || !price || !status) {
    return res.status(400).json({ message: "All fields are required" });
  }

  const query = "INSERT INTO reporttable (id, date, customer, price, status) VALUES (?, ?, ?, ?, ?)";
  const values = [id, date, customer, price, status];

  db.query(query, values, (err, result) => {
    if (err) {
      console.error("Error creating report:", err.message);
      return res.status(500).json({ message: "Failed to create report", error: err.message });
    }
    res.status(201).json({ message: "Report created successfully", insertId: result.insertId });
  });
});

// Update a report
app.put("/api/v1/reports/:id", (req, res) => {
  const reportId = req.params.id;
  const { date, customer, price, status } = req.body;

  // Validate required fields
  if (!date || !customer || !price || !status) {
    return res.status(400).json({ message: "All fields are required" });
  }

  const query = "UPDATE reporttable SET date = ?, customer = ?, price = ?, status = ? WHERE id = ?";
  const values = [date, customer, price, status, reportId];

  db.query(query, values, (err, result) => {
    if (err) {
      console.error("Error updating report:", err.message);
      return res.status(500).json({ message: "Failed to update report", error: err.message });
    }
    if (result.affectedRows === 0) return res.status(404).json({ message: "Report not found" });
    res.json({ message: "Report updated successfully" });
  });
});

// Delete a report by ID
app.delete("/api/v1/reports/:id", (req, res) => {
  const reportId = req.params.id;

  const query = "DELETE FROM reporttable WHERE id = ?";
  db.query(query, [reportId], (err, result) => {
    if (err) {
      console.error("Error deleting report:", err.message);
      return res.status(500).json({ message: "Failed to delete report", error: err.message });
    }
    if (result.affectedRows === 0) return res.status(404).json({ message: "Report not found" });
    res.json({ message: "Report deleted successfully" });
  });
});

// --- Invoice Routes ---


// Get all invoices
app.get("/api/invoices", (req, res) => {
  const query = "SELECT * FROM invoice ORDER BY bill_date DESC";
  db.query(query, (err, results) => {
    if (err) {
      console.error("Error fetching invoices:", err);
      res.status(500).json({ error: "Failed to fetch invoices" });
      return;
    }
    res.json(results);
  });
});

// Get single invoice by ID
app.get("/api/invoices/:id", (req, res) => {
  const { id } = req.params;
  const query = "SELECT * FROM invoice WHERE id = ?";
  db.query(query, [id], (err, results) => {
    if (err) {
      console.error("Error fetching invoice:", err);
      res.status(500).json({ error: "Failed to fetch invoice" });
      return;
    }
    if (results.length === 0) {
      res.status(404).json({ error: "Invoice not found" });
      return;
    }
    res.json(results[0]);
  });
});

// Create new invoice
app.post("/api/invoices", (req, res) => {
  const {
    customer_name, customer_email, p_number, a_p_number, address,
    st_reg_no, ntn_number, item_name, quantity, rate, currency,
    salesTax, item_amount, tax_amount, total_amount, bill_date,
    payment_deadline, Note, status = "Pending"  // <-- default status
  } = req.body;

  const query = `
    INSERT INTO invoice (
      customer_name, customer_email, p_number, a_p_number, address,
      st_reg_no, ntn_number, item_name, quantity, rate, currency,
      salesTax, item_amount, tax_amount, total_amount, bill_date,
      payment_deadline, Note, status
    ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
  `;

  const values = [
    customer_name, customer_email, p_number, a_p_number, address,
    st_reg_no, ntn_number, item_name, quantity, rate, currency,
    salesTax, item_amount, tax_amount, total_amount, bill_date,
    payment_deadline, Note, status
  ];

  db.query(query, values, (err, results) => {
    if (err) {
      console.error("Error creating invoice:", err);
      res.status(500).json({ error: "Failed to create invoice" });
      return;
    }
    res.status(201).json({ id: results.insertId, message: "Invoice created successfully" });
  });
});

// Update invoice
app.put("/api/invoices/:id", (req, res) => {
  const { id } = req.params;
  const {
    customer_name, customer_email, p_number, a_p_number, address,
    st_reg_no, ntn_number, item_name, quantity, rate, currency,
    salesTax, item_amount, tax_amount, total_amount, bill_date,
    payment_deadline, Note, status
  } = req.body;

  const query = `
    UPDATE invoice SET
      customer_name = ?, customer_email = ?, p_number = ?, a_p_number = ?, address = ?,
      st_reg_no = ?, ntn_number = ?, item_name = ?, quantity = ?, rate = ?, currency = ?,
      salesTax = ?, item_amount = ?, tax_amount = ?, total_amount = ?, bill_date = ?,
      payment_deadline = ?, Note = ?, status = ?
    WHERE id = ?
  `;

  const values = [
    customer_name, customer_email, p_number, a_p_number, address,
    st_reg_no, ntn_number, item_name, quantity, rate, currency,
    salesTax, item_amount, tax_amount, total_amount, bill_date,
    payment_deadline, Note, status, id
  ];

  db.query(query, values, (err, results) => {
    if (err) {
      console.error("Error updating invoice:", err);
      res.status(500).json({ error: "Failed to update invoice" });
      return;
    }
    if (results.affectedRows === 0) {
      res.status(404).json({ error: "Invoice not found" });
      return;
    }
    res.json({ message: "Invoice updated successfully" });
  });
});

// Delete invoice
app.delete("/api/invoices/:id", (req, res) => {
  const { id } = req.params;
  const query = "DELETE FROM invoice WHERE id = ?";
  
  db.query(query, [id], (err, results) => {
    if (err) {
      console.error("Error deleting invoice:", err);
      res.status(500).json({ error: "Failed to delete invoice" });
      return;
    }
    if (results.affectedRows === 0) {
      res.status(404).json({ error: "Invoice not found" });
      return;
    }
    res.json({ message: "Invoice deleted successfully" });
  });
});
// --- Start Server ---
const PORT = 5000;
app.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);
});