const express = require('express');
const mysql = require('mysql2');
const cors = require('cors');

const app = express();
app.use(cors());
app.use(express.json());

// Update these values with your MySQL credentials
const db = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password: '',
  database: 'arauf_crm'
});

db.connect(err => {
  if (err) {
    console.error('MySQL connection error:', err);
    process.exit(1);
  }
  console.log('MySQL Connected!');
});

// Signup endpoint
app.post('/signup', (req, res) => {
  const { firstName, lastName, email, password } = req.body;
  const sql = 'INSERT INTO users (firstName, lastName, email, password) VALUES (?, ?, ?, ?)';
  db.query(sql, [firstName, lastName, email, password], (err, result) => {
    if (err) return res.status(500).json({ error: err });
    res.json({ success: true, userId: result.insertId });
  });
});

// Login endpoint
app.post('/login', (req, res) => {
  const { email, password } = req.body;
  const sql = 'SELECT * FROM users WHERE email = ? AND password = ?';
  db.query(sql, [email, password], (err, results) => {
    if (err) {
      console.error('Login SQL error:', err); // Add this line for debugging
      return res.status(500).json({ message: err.sqlMessage });
    }
    if (results.length > 0) {
      res.json({ success: true, user: results[0] });
    } else {
      res.status(401).json({ success: false, message: 'Invalid email or password' });
    }
  });
});

// Get all reports
app.get('/api/v1/reports', (req, res) => {
  db.query('SELECT * FROM reporttable', (err, results) => {
    if (err) return res.status(500).json({ error: err.sqlMessage });
    res.json(results);
  });
});

// Create a new report
app.post('/api/v1/reports', (req, res) => {
  const { id, date, customer, price, status } = req.body;
  const sql = 'INSERT INTO reporttable (id, date, customer, price, status) VALUES (?, ?, ?, ?, ?)';
  db.query(sql, [id, date, customer, price, status], (err, result) => {
    if (err) return res.status(500).json({ error: err.sqlMessage });
    res.json({ success: true, reportId: result.insertId });
  });
});

app.listen(5000, () => console.log('Server running on port 5000'));