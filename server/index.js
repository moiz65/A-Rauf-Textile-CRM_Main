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

// --- Customer Routes ---

// Get all customers
app.get("/api/v1/customertable", (req, res) => {
  db.query("SELECT * FROM customertable", (err, results) => {
    if (err) {
      console.error("Error fetching customers:", err.message);
      return res.status(500).json({ message: "Failed to fetch customers", error: err.message });
    }
    res.json(results);
  });
});

// Create a new customer
app.post("/api/v1/customertable", (req, res) => {
  const { name, date, phoneNumber, price, category, address, email, startDate } = req.body;

  // Validate required fields
  if (!name || !date || !phoneNumber || !price) {
    return res.status(400).json({ message: "Missing required fields" });
  }

  const query = `
    INSERT INTO customertable (customer, date, phone, price, category, address, email, start_date)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?)
  `;
  const values = [name, date, phoneNumber, price, category, address, email, startDate];

  db.query(query, values, (err, result) => {
    if (err) {
      console.error("Error creating customer:", err.message);
      return res.status(500).json({ message: "Failed to create customer", error: err.message });
    }
    res.status(201).json({ message: "Customer created successfully", insertId: result.insertId });
  });
});

// Update a customer
app.put("/api/v1/customertable/:id", (req, res) => {
  const customerId = req.params.id;
  const { name, date, phoneNumber, price, category, address, email, startDate } = req.body;

  const query = `
    UPDATE customertable
    SET customer = ?, date = ?, phone = ?, price = ?, category = ?, address = ?, email = ?, start_date = ?
    WHERE customer_id = ?
  `;
  const values = [name, date, phoneNumber, price, category, address, email, startDate, customerId];

  db.query(query, values, (err, result) => {
    if (err) {
      console.error("Error updating customer:", err.message);
      return res.status(500).json({ message: "Failed to update customer", error: err.message });
    }
    if (result.affectedRows === 0) return res.status(404).json({ message: "Customer not found" });
    res.json({ message: "Customer updated successfully" });
  });
});

// Delete a customer
app.delete("/api/v1/customertable/:id", (req, res) => {
  const { id } = req.params;

  const query = "DELETE FROM customertable WHERE customer_id = ?";
  db.query(query, [id], (err, result) => {
    if (err) {
      console.error("Error deleting customer:", err.message);
      return res.status(500).json({ message: "Failed to delete customer", error: err.message });
    }
    if (result.affectedRows === 0) return res.status(404).json({ message: "Customer not found" });
    res.json({ message: "Customer deleted successfully" });
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

// --- Invoice Routes (using the provided implementation) ---

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
    payment_deadline, Note
  } = req.body;

  const query = `
    INSERT INTO invoice (
      customer_name, customer_email, p_number, a_p_number, address,
      st_reg_no, ntn_number, item_name, quantity, rate, currency,
      salesTax, item_amount, tax_amount, total_amount, bill_date,
      payment_deadline, Note
    ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
  `;

  const values = [
    customer_name, customer_email, p_number, a_p_number, address,
    st_reg_no, ntn_number, item_name, quantity, rate, currency,
    salesTax, item_amount, tax_amount, total_amount, bill_date,
    payment_deadline, Note
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
    payment_deadline, Note
  } = req.body;

  const query = `
    UPDATE invoice SET
      customer_name = ?, customer_email = ?, p_number = ?, a_p_number = ?, address = ?,
      st_reg_no = ?, ntn_number = ?, item_name = ?, quantity = ?, rate = ?, currency = ?,
      salesTax = ?, item_amount = ?, tax_amount = ?, total_amount = ?, bill_date = ?,
      payment_deadline = ?, Note = ?
    WHERE id = ?
  `;

  const values = [
    customer_name, customer_email, p_number, a_p_number, address,
    st_reg_no, ntn_number, item_name, quantity, rate, currency,
    salesTax, item_amount, tax_amount, total_amount, bill_date,
    payment_deadline, Note, id
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