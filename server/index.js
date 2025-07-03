// --- Required Modules ---
const express = require("express");
const mysql = require("mysql2");
const cors = require("cors");

// --- Initialize Express App ---
const app = express();
app.use(cors());
app.use(express.json());

// --- MySQL Database Connection ---
const db = mysql.createConnection({
  host: "localhost",
  user: "root",
  password: "",
  database: "arauf_crm",
});

db.connect((err) => {
  if (err) {
    console.error("MySQL connection error:", err);
    process.exit(1);
  }
  console.log("✅ MySQL Connected!");
});

// --- Customer Routes ---

// Get all customers
app.get("/api/v1/customertable", (req, res) => {
  db.query("SELECT * FROM customertable", (err, results) => {
    if (err) return res.status(500).json({ error: err.sqlMessage });
    res.json(results);
  });
});

// Create a new customer
app.post("/api/v1/customertable", (req, res) => {
  const { name, date, phoneNumber, price, category, address, email, startDate } = req.body;
  const sql = `
    INSERT INTO customertable (customer, date, phone, price, category, address, email, start_date)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?)
  `;
  db.query(sql, [name, date, phoneNumber, price, category, address, email, startDate], (err, result) => {
    if (err) return res.status(500).json({ error: err.sqlMessage });
    res.json({ success: true, customerId: result.insertId });
  });
});

// Update a customer
app.put("/api/v1/customertable/:id", (req, res) => {
  const customerId = req.params.id;
  const { name, date, phoneNumber, price, category, address, email, startDate } = req.body;
  const sql = `
    UPDATE customertable
    SET customer = ?, date = ?, phone = ?, price = ?, category = ?, address = ?, email = ?, start_date = ?
    WHERE customer_id = ?
  `;
  db.query(sql, [name, date, phoneNumber, price, category, address, email, startDate, customerId], (err, result) => {
    if (err) return res.status(500).json({ error: err.sqlMessage });
    if (result.affectedRows === 0) return res.status(404).json({ error: "Customer not found" });
    res.json({ success: true });
  });
});

// Delete a customer
app.delete("/api/v1/customertable/:id", (req, res) => {
  const { id } = req.params;
  db.query("DELETE FROM customertable WHERE customer_id = ?", [id], (err, result) => {
    if (err) return res.status(500).json({ error: err.sqlMessage });
    if (result.affectedRows === 0) return res.status(404).json({ error: "Customer not found" });
    res.json({ success: true });
  });
});

// --- User Signup & Login ---

// Signup endpoint
app.post("/signup", (req, res) => {
  const { firstName, lastName, email, password } = req.body;
  const sql = "INSERT INTO users (firstName, lastName, email, password) VALUES (?, ?, ?, ?)";
  db.query(sql, [firstName, lastName, email, password], (err, result) => {
    if (err) return res.status(500).json({ error: err.sqlMessage });
    res.json({ success: true, userId: result.insertId });
  });
});

// Login endpoint
app.post("/login", (req, res) => {
  const { email, password } = req.body;
  const sql = "SELECT * FROM users WHERE email = ? AND password = ?";
  db.query(sql, [email, password], (err, results) => {
    if (err) return res.status(500).json({ message: err.sqlMessage });
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
    if (err) return res.status(500).json({ error: err.sqlMessage });
    res.json(results);
  });
});

// Create a new report
app.post("/api/v1/reports", (req, res) => {
  const { id, date, customer, price, status } = req.body;
  const sql = "INSERT INTO reporttable (id, date, customer, price, status) VALUES (?, ?, ?, ?, ?)";
  db.query(sql, [id, date, customer, price, status], (err, result) => {
    if (err) return res.status(500).json({ error: err.sqlMessage });
    res.json({ success: true, reportId: result.insertId });
  });
});

// Delete a report by ID
app.delete("/api/v1/reports/:id", (req, res) => {
  const reportId = req.params.id;
  db.query("DELETE FROM reporttable WHERE id = ?", [reportId], (err, result) => {
    if (err) return res.status(500).json({ error: err.sqlMessage });
    if (result.affectedRows === 0) return res.status(404).json({ error: "Report not found" });
    res.json({ success: true });
  });
});

// --- Invoice Routes ---

// Save a new invoice
app.post("/api/v1/invoice", (req, res) => {
  const data = req.body;

  const query = `
    INSERT INTO invoice (
      customer_name, customer_email, p_number, a_p_number, address, st_reg_no, ntn_number, item_name,
      quantity, rate, currency, salesTax, item_amount, tax_amount, total_amount,
      bill_date, payment_deadline, Note
    ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
  `;

  const values = [
    data.customerName,
    data.customerEmail,
    data.phone,
    data.a_p_Name,
    data.address,
    data.stRegNo,
    data.ntnNumber,
    data.itemName,
    data.quantity,
    data.rate,
    data.currency,
    data.salesTax,
    data.itemAmount,
    data.taxAmount,
    data.totalAmount,
    data.billDate,
    data.paymentDeadline,
    data.note,
  ];

  db.query(query, values, (err, result) => {
    if (err) {
      console.error("Error saving invoice:", err.message);
      return res.status(500).json({ message: "Failed to save invoice" });
    }
    res.status(201).json({
      message: "Invoice saved successfully",
      insertId: result.insertId,
    });
  });
});

app.get("/api/v1/invoices", (req, res) => {
  db.query("SELECT * FROM invoice", (err, results) => {
    if (err) return res.status(500).json({ error: err.sqlMessage });
    res.json(results);
  });
});

// --- Start Server ---
const PORT = 5000;
app.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);
});
