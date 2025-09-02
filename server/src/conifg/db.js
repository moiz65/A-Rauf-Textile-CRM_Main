// db.js
// MySQL database connection setup
const mysql = require('mysql2');

const connection = mysql.createConnection({
  host: 'localhost', // update if needed
  user: 'root',      // update with your MySQL username
  password: '',      // update with your MySQL password
  database: 'arauf_crm' // update with your database name
});

connection.connect((err) => {
  if (err) {
    console.error('Error connecting to MySQL:', err);
    return;
  }
  console.log('Connected to MySQL database!');
});

module.exports = connection;
