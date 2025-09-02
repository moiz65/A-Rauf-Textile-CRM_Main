// --- Required Modules ---
const express = require("express");
const cors = require("cors");

// --- Initialize Express App ---
const app = express();
app.use(cors());
app.use(express.json());

// --- MySQL Database Connection ---
const db = require("./src/conifg/db");

// --- Customer Routes ---

// Get all customers
app.get("/api/v1/customertable", (req, res) => {
  db.query("SELECT * FROM customertable", (err, results) => {
    if (err) {
      console.error("Error fetching customers:", err.message);
      return res.status(500).json({ message: "Failed to fetch customers" });
    }
    res.json(results);
  });
});

// Create a new customer
app.post("/api/v1/customertable", (req, res) => {
  const { name, date, phoneNumber, price, category, address, email, startDate } = req.body;

  const query = `
    INSERT INTO customertable (customer, date, phone, price, category, address, email, start_date)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?)
  `;
  const values = [name, date, phoneNumber, price, category, address, email, startDate];

  db.query(query, values, (err, result) => {
    if (err) {
      console.error("Error creating customer:", err.message);
      return res.status(500).json({ message: "Failed to create customer" });
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
      return res.status(500).json({ message: "Failed to update customer" });
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
      return res.status(500).json({ message: "Failed to delete customer" });
    }
    if (result.affectedRows === 0) return res.status(404).json({ message: "Customer not found" });
    res.json({ message: "Customer deleted successfully" });
  });
});

// --- User Signup & Login ---

// Signup endpoint
app.post("/signup", (req, res) => {
  const { firstName, lastName, email, password } = req.body;

  const query = "INSERT INTO users (firstName, lastName, email, password) VALUES (?, ?, ?, ?)";
  const values = [firstName, lastName, email, password];

  db.query(query, values, (err, result) => {
    if (err) {
      console.error("Error signing up:", err.message);
      return res.status(500).json({ message: "Failed to signup" });
    }
    res.status(201).json({ message: "User created successfully", insertId: result.insertId });
  });
});

// Login endpoint
app.post("/login", (req, res) => {
  const { email, password } = req.body;

  const query = "SELECT * FROM users WHERE email = ? AND password = ?";
  const values = [email, password];

  db.query(query, values, (err, results) => {
    if (err) {
      console.error("Error logging in:", err.message);
      return res.status(500).json({ message: "Failed to login" });
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
      return res.status(500).json({ message: "Failed to fetch reports" });
    }
    res.json(results);
  });
});

// Create a new report
app.post("/api/v1/reports", (req, res) => {
  const { id, date, customer, price, status } = req.body;

  const query = "INSERT INTO reporttable (id, date, customer, price, status) VALUES (?, ?, ?, ?, ?)";
  const values = [id, date, customer, price, status];

  db.query(query, values, (err, result) => {
    if (err) {
      console.error("Error creating report:", err.message);
      return res.status(500).json({ message: "Failed to create report" });
    }
    res.status(201).json({ message: "Report created successfully", insertId: result.insertId });
  });
});

// Delete a report by ID
app.delete("/api/v1/reports/:id", (req, res) => {
  const reportId = req.params.id;

  const query = "DELETE FROM reporttable WHERE id = ?";
  db.query(query, [reportId], (err, result) => {
    if (err) {
      console.error("Error deleting report:", err.message);
      return res.status(500).json({ message: "Failed to delete report" });
    }
    if (result.affectedRows === 0) return res.status(404).json({ message: "Report not found" });
    res.json({ message: "Report deleted successfully" });
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

// Get all invoices
app.get("/api/v1/invoices", (req, res) => {
  db.query("SELECT * FROM invoice", (err, results) => {
    if (err) {
      console.error("Error fetching invoices:", err.message);
      return res.status(500).json({ message: "Failed to fetch invoices" });
    }
    res.json(results);
  });
});

// --- Start Server ---
const PORT = 5000;
app.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);
});
