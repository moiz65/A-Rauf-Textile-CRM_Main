const mysql = require("mysql2");

const db = mysql.createConnection({
  host: "localhost",
  user: "root",
  password: "", // Add your MySQL password if set
  database: "arauf_crm"
});

db.connect((err) => {
  if (err) {
    // Use logger in index.js; keep minimal here
    console.error("❌ Database connection failed:", err.message);
  } else {
    console.debug("✅ Connected to MySQL Database: arauf_crm");
  }
});

module.exports = db;