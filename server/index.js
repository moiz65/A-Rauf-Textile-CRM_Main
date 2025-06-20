require('dotenv').config();
const express = require('express');
const mysql = require('mysql2/promise');
const cors = require('cors');
const helmet = require('helmet');

const app = express();

app.use(cors());
app.use(helmet());
app.use(express.json());

const pool = mysql.createPool({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0
});

app.post('/health', (req, res) => res.status(200).json({ status: 'ok' }));

// POST /api/v1/reports - Add a new report
app.post('/api/v1/reports', async (req, res, next) => {
  const { date, customer, price, status } = req.body;
  try {
    await pool.query(
      'INSERT INTO reports (date, customer, price, status) VALUES (?, ?, ?, ?)',
      [date, customer, price, status]
    );
    res.status(201).json({ message: 'Report added' });
  } catch (err) {
    next(err);
  }
});

app.use((err, req, res, next) => {
  console.error(err);
  res.status(500).json({ error: 'Internal server error' });
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

process.on('SIGTERM', () => {
  pool.end();
  server.close();
});