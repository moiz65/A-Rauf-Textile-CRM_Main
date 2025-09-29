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

// --- Dashboard Routes ---
const dashboardRoutes = require('./routes/dashboard');
app.use('/api/dashboard', dashboardRoutes);

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

// Get single expense by ID with its items
app.get("/api/expenses/:id", (req, res) => {
  const { id } = req.params;
  
  // First get the expense
  const expenseQuery = "SELECT * FROM expenses WHERE id = ?";
  db.query(expenseQuery, [id], (err, expenseResults) => {
    if (err) {
      console.error("Error fetching expense:", err.message);
      return res.status(500).json({ message: "Failed to fetch expense", error: err.message });
    }
    
    if (expenseResults.length === 0) {
      return res.status(404).json({ message: "Expense not found" });
    }
    
    const expense = expenseResults[0];
    
    // Get expense items (if table exists)
    const itemsQuery = "SELECT * FROM expense_items WHERE expense_id = ? ORDER BY item_no";
    db.query(itemsQuery, [id], (err, itemsResults) => {
      if (err) {
        console.error("Error fetching expense items:", err);
        console.error("Note: If expense_items table doesn't exist, please run database_updates.sql");
        // Still return expense even if items fetch fails
        return res.json({
          ...expense,
          items: [],
          note: "Items table not available"
        });
      }
      
      // Combine expense with items
      const expenseWithItems = {
        ...expense,
        items: itemsResults || []
      };
      
      res.json(expenseWithItems);
    });
  });
});

// Create new expense with multiple items support
app.post("/api/expenses", (req, res) => {
  console.log('Received expense creation request:', req.body); // Debug log

  const {
    title,
    date,
    vendor,
    amount,
    category,
    paymentMethod,
    status = 'Pending',
    description = '',
    items = []
  } = req.body;

  // Validate required fields
  if (!title || !date || !vendor || !category || !paymentMethod) {
    return res.status(400).json({ message: "Missing required fields" });
  }

  // For multiple items, calculate total amount from items
  let totalAmount = amount;
  if (items && items.length > 0) {
    totalAmount = items.reduce((sum, item) => sum + (item.amount || 0), 0);
  }

  // Start transaction for expense and items
  db.beginTransaction((err) => {
    if (err) {
      console.error("Error starting transaction:", err);
      return res.status(500).json({ message: "Failed to start transaction", error: err.message });
    }

    const query = `
      INSERT INTO expenses (title, date, vendor, amount, category, paymentMethod, status, description)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?)
    `;
    const values = [title, date, vendor, totalAmount, category, paymentMethod, status, description];

    db.query(query, values, (err, result) => {
      if (err) {
        console.error("Error creating expense:", err.message);
        return db.rollback(() => {
          res.status(500).json({ message: "Failed to create expense", error: err.message });
        });
      }
      
      const expenseId = result.insertId;
      console.log('Expense created with ID:', expenseId);

      // Insert expense items if provided
      if (items && items.length > 0) {
        const itemsQuery = `
          INSERT INTO expense_items (expense_id, item_no, description, quantity, unit_price, amount)
          VALUES ?
        `;

        const itemsValues = items.map(item => [
          expenseId,
          item.item_no || 1,
          item.description || '',
          item.quantity || 1,
          item.unit_price || 0,
          item.amount || 0
        ]);

        db.query(itemsQuery, [itemsValues], (err, itemsResult) => {
          if (err) {
            console.error("Error creating expense items:", err);
            console.error("Note: If expense_items table doesn't exist, please run database_updates.sql");
            // Still commit the expense even if items table doesn't exist
            return db.commit((commitErr) => {
              if (commitErr) {
                console.error("Error committing transaction:", commitErr);
                return db.rollback(() => {
                  res.status(500).json({ message: "Failed to commit transaction", error: commitErr.message });
                });
              }

              console.log('Expense created successfully (without items due to table error)');
              res.status(201).json({
                message: "Expense created successfully",
                expense: {
                  id: expenseId,
                  title,
                  date,
                  vendor,
                  amount: totalAmount,
                  category,
                  paymentMethod,
                  status,
                  description,
                  items_count: 0,
                  note: "Items table not available - run database_updates.sql"
                }
              });
            });
          }

          // Commit transaction and return success
          db.commit((err) => {
            if (err) {
              console.error("Error committing transaction:", err);
              return db.rollback(() => {
                res.status(500).json({ message: "Failed to commit transaction", error: err.message });
              });
            }

            console.log('Expense and items created successfully');
            res.status(201).json({
              message: "Expense created successfully",
              expense: {
                id: expenseId,
                title,
                date,
                vendor,
                amount: totalAmount,
                category,
                paymentMethod,
                status,
                description,
                items_count: items.length
              }
            });
          });
        });
      } else {
        // No items, just commit expense
        db.commit((err) => {
          if (err) {
            console.error("Error committing transaction:", err);
            return db.rollback(() => {
              res.status(500).json({ message: "Failed to commit transaction", error: err.message });
            });
          }

          console.log('Expense created successfully');
          res.status(201).json({
            message: "Expense created successfully",
            expense: {
              id: expenseId,
              title,
              date,
              vendor,
              amount: totalAmount,
              category,
              paymentMethod,
              status,
              description
            }
          });
        });
      }
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

// Get expense category statistics
app.get("/api/expense-categories-stats", (req, res) => {
  const query = `
    SELECT 
      c.name as category_name,
      c.type as category_type,
      COALESCE(SUM(e.amount), 0) as total_amount,
      COUNT(e.id) as expense_count,
      COALESCE(SUM(CASE WHEN e.status = 'Paid' THEN e.amount ELSE 0 END), 0) as paid_amount,
      COALESCE(SUM(CASE WHEN e.status = 'Pending' THEN e.amount ELSE 0 END), 0) as pending_amount
    FROM categories c
    LEFT JOIN expenses e ON c.name = e.category
    GROUP BY c.name, c.type
    ORDER BY c.type, total_amount DESC
  `;

  db.query(query, (err, results) => {
    if (err) {
      console.error("Error fetching expense category stats:", err.message);
      return res.status(500).json({ message: "Failed to fetch category statistics", error: err.message });
    }

    // Group by category type
    const categoryStats = {
      Expense: { total_amount: 0, expense_count: 0, paid_amount: 0, pending_amount: 0, categories: [] },
      Income: { total_amount: 0, expense_count: 0, paid_amount: 0, pending_amount: 0, categories: [] },
      Asset: { total_amount: 0, expense_count: 0, paid_amount: 0, pending_amount: 0, categories: [] },
      Liability: { total_amount: 0, expense_count: 0, paid_amount: 0, pending_amount: 0, categories: [] }
    };

    results.forEach(row => {
      const type = row.category_type;
      if (categoryStats[type]) {
        categoryStats[type].total_amount += parseFloat(row.total_amount) || 0;
        categoryStats[type].expense_count += parseInt(row.expense_count) || 0;
        categoryStats[type].paid_amount += parseFloat(row.paid_amount) || 0;
        categoryStats[type].pending_amount += parseFloat(row.pending_amount) || 0;
        categoryStats[type].categories.push({
          name: row.category_name,
          total_amount: parseFloat(row.total_amount) || 0,
          expense_count: parseInt(row.expense_count) || 0,
          paid_amount: parseFloat(row.paid_amount) || 0,
          pending_amount: parseFloat(row.pending_amount) || 0
        });
      }
    });

    res.json(categoryStats);
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


// Get customer details by ID for billing address auto-fill
app.get("/api/v1/customers/:id/billing", (req, res) => {
  const { id } = req.params;
  
  const query = `
    SELECT 
      customer_id,
      customer as customer_name,
      company,
      email as customer_email,
      phone as p_number,
      '' as a_p_number,
      address,
      '' as st_reg_no,
      '' as ntn_number
    FROM customertable 
    WHERE customer_id = ?
  `;
  
  db.query(query, [id], (err, results) => {
    if (err) {
      console.error("Error fetching customer billing details:", err.message);
      return res.status(500).json({ message: "Failed to fetch customer billing details", error: err.message });
    }
    
    if (results.length === 0) {
      return res.status(404).json({ message: "Customer not found" });
    }
    
    res.json(results[0]);
  });
});

// Get customer suggestions for autocomplete
app.get("/api/v1/customers/suggestions", (req, res) => {
  const { q } = req.query;
  
  if (!q || q.length < 1) {
    return res.json([]);
  }
  
  // Search in both customertable and reporttable for customer names
  const queries = [
    // Search in customertable
    `SELECT DISTINCT customer as name FROM customertable 
     WHERE customer LIKE ? 
     ORDER BY customer ASC 
     LIMIT 5`,
    // Search in reporttable 
    `SELECT DISTINCT customer as name FROM reporttable 
     WHERE customer LIKE ? 
     ORDER BY customer ASC 
     LIMIT 5`
  ];
  
  const searchTerm = `${q}%`;
  const customerSet = new Set();
  
  // Execute both queries and combine results
  Promise.all(
    queries.map(query => 
      new Promise((resolve, reject) => {
        db.query(query, [searchTerm], (err, results) => {
          if (err) {
            console.error("Error in customer suggestions query:", err);
            resolve([]);
          } else {
            resolve(results.map(row => row.name).filter(name => name && name.trim()));
          }
        });
      })
    )
  ).then(results => {
    // Combine and deduplicate results
    results.forEach(customerList => {
      customerList.forEach(customer => customerSet.add(customer));
    });
    
    // Convert to array, sort, and limit to 5
    const suggestions = Array.from(customerSet)
      .filter(customer => customer.toLowerCase().startsWith(q.toLowerCase()))
      .sort()
      .slice(0, 5);
    
    res.json(suggestions);
  }).catch(err => {
    console.error("Error fetching customer suggestions:", err);
    res.status(500).json({ error: "Failed to fetch customer suggestions" });
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

// Get report counts by status
app.get("/api/v1/reports/stats", (req, res) => {
  const query = `
    SELECT 
      status,
      COUNT(*) as count
    FROM reporttable 
    GROUP BY status
    UNION ALL
    SELECT 'All' as status, COUNT(*) as count FROM reporttable
  `;
  
  db.query(query, (err, results) => {
    if (err) {
      console.error("Error fetching report stats:", err.message);
      return res.status(500).json({ message: "Failed to fetch report stats", error: err.message });
    }
    
    // Transform results into a more usable format
    const stats = {};
    results.forEach(row => {
      stats[row.status] = row.count;
    });
    
    res.json(stats);
  });
});

// Get all reports with comprehensive filtering
app.get("/api/v1/reports", (req, res) => {
  const { 
    status, 
    minPrice, 
    maxPrice, 
    dateFrom, 
    dateTo, 
    customer, 
    search,
    sortBy = 'date',
    sortOrder = 'DESC',
    page = 1,
    limit = 50
  } = req.query;
  
  let query = "SELECT * FROM reporttable WHERE 1=1";
  const params = [];
  
  // Status filter
  if (status && status !== 'All') {
    query += " AND status = ?";
    params.push(status);
  }
  
  // Price range filter
  if (minPrice) {
    query += " AND price >= ?";
    params.push(parseFloat(minPrice));
  }
  
  if (maxPrice) {
    query += " AND price <= ?";
    params.push(parseFloat(maxPrice));
  }
  
  // Date range filter
  if (dateFrom) {
    query += " AND date >= ?";
    params.push(dateFrom);
  }
  
  if (dateTo) {
    query += " AND date <= ?";
    params.push(dateTo);
  }
  
  // Customer filter
  if (customer) {
    query += " AND customer LIKE ?";
    params.push(`%${customer}%`);
  }
  
  // General search across multiple fields
  if (search) {
    query += " AND (id LIKE ? OR customer LIKE ? OR status LIKE ?)";
    params.push(`%${search}%`, `%${search}%`, `%${search}%`);
  }
  
  // Sorting
  const validSortFields = ['id', 'date', 'customer', 'price', 'status'];
  const validSortOrders = ['ASC', 'DESC'];
  
  if (validSortFields.includes(sortBy) && validSortOrders.includes(sortOrder.toUpperCase())) {
    query += ` ORDER BY ${sortBy} ${sortOrder.toUpperCase()}`;
  } else {
    query += " ORDER BY date DESC";
  }
  
  // Pagination
  const pageNum = parseInt(page) || 1;
  const limitNum = parseInt(limit) || 50;
  const offset = (pageNum - 1) * limitNum;
  
  query += " LIMIT ? OFFSET ?";
  params.push(limitNum, offset);
  
  db.query(query, params, (err, results) => {
    if (err) {
      console.error("Error fetching reports:", err.message);
      return res.status(500).json({ message: "Failed to fetch reports", error: err.message });
    }
    
    // Get total count for pagination
    let countQuery = "SELECT COUNT(*) as total FROM reporttable WHERE 1=1";
    const countParams = [];
    
    // Apply same filters for count query (exclude pagination)
    if (status && status !== 'All') {
      countQuery += " AND status = ?";
      countParams.push(status);
    }
    
    if (minPrice) {
      countQuery += " AND price >= ?";
      countParams.push(parseFloat(minPrice));
    }
    
    if (maxPrice) {
      countQuery += " AND price <= ?";
      countParams.push(parseFloat(maxPrice));
    }
    
    if (dateFrom) {
      countQuery += " AND date >= ?";
      countParams.push(dateFrom);
    }
    
    if (dateTo) {
      countQuery += " AND date <= ?";
      countParams.push(dateTo);
    }
    
    if (customer) {
      countQuery += " AND customer LIKE ?";
      countParams.push(`%${customer}%`);
    }
    
    if (search) {
      countQuery += " AND (id LIKE ? OR customer LIKE ? OR status LIKE ?)";
      countParams.push(`%${search}%`, `%${search}%`, `%${search}%`);
    }
    
    db.query(countQuery, countParams, (countErr, countResults) => {
      if (countErr) {
        console.error("Error getting count:", countErr.message);
        return res.status(500).json({ message: "Failed to get count", error: countErr.message });
      }
      
      const totalRecords = countResults[0].total;
      const totalPages = Math.ceil(totalRecords / limitNum);
      
      res.json({
        data: results,
        pagination: {
          currentPage: pageNum,
          totalPages: totalPages,
          totalRecords: totalRecords,
          hasNextPage: pageNum < totalPages,
          hasPrevPage: pageNum > 1
        }
      });
    });
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


// Get all invoices with optional filtering
app.get("/api/invoices", (req, res) => {
  const { 
    status, 
    minAmount, 
    maxAmount, 
    dateFrom, 
    dateTo, 
    customer, 
    search, 
    is_sent,
    currency,
    invoice_number,
    exclude_po = 'false', // Parameter to exclude PO invoices from results
    sortBy = 'bill_date',
    sortOrder = 'DESC',
    page = 1,
    limit = 50
  } = req.query;
  
  // Unified query to combine regular invoices and PO invoices
  let query = `
    SELECT 
      id,
      invoice_number,
      customer_name,
      customer_email,
      p_number,
      a_p_number,
      address,
      st_reg_no,
      ntn_number,
      item_name,
      quantity,
      rate,
      currency,
      salesTax,
      item_amount,
      bill_date,
      delivery_date,
      terms_of_payment,
      payment_deadline,
      note,
      subtotal,
      tax_rate,
      tax_amount,
      total_amount,
      status,
      is_sent,
      sent_at,
      created_at,
      updated_at,
      'regular' as invoice_type,
      NULL as po_number,
      NULL as po_id
    FROM invoice
    WHERE 1=1
  `;
  
  // Conditionally add UNION for PO invoices (exclude if exclude_po=true)
  if (exclude_po !== 'true') {
    query += `
      UNION ALL
      
      SELECT 
        id,
        invoice_number,
        customer_name,
        customer_email,
        customer_phone as p_number,
        '' as a_p_number,
        customer_address as address,
        '' as st_reg_no,
        '' as ntn_number,
        'PO Invoice Items' as item_name,
        1 as quantity,
        total_amount as rate,
        currency,
        tax_rate as salesTax,
        total_amount as item_amount,
        invoice_date as bill_date,
        due_date as delivery_date,
        'Generated from PO' as terms_of_payment,
        due_date as payment_deadline,
        notes as note,
        subtotal,
        tax_rate,
        tax_amount,
        total_amount,
        status,
        CASE WHEN status = 'Sent' THEN 1 ELSE 0 END as is_sent,
        CASE WHEN status = 'Sent' THEN created_at ELSE NULL END as sent_at,
        created_at,
        updated_at,
        'po_invoice' as invoice_type,
        po_number,
        po_id
      FROM po_invoices
      WHERE 1=1
    `;
  }
  
  const params = [];
  const poParams = [];
  
  // Build WHERE conditions properly
  const conditions = [];
  
  if (status && status !== 'All') {
    conditions.push('status = ?');
    params.push(status);
  }
  
  if (minAmount) {
    conditions.push('total_amount >= ?');
    params.push(parseFloat(minAmount));
  }
  
  if (maxAmount) {
    conditions.push('total_amount <= ?');
    params.push(parseFloat(maxAmount));
  }
  
  if (dateFrom) {
    conditions.push('bill_date >= ?');
    params.push(dateFrom);
  }
  
  if (dateTo) {
    conditions.push('bill_date <= ?');
    params.push(dateTo);
  }
  
  if (customer) {
    conditions.push('customer_name LIKE ?');
    params.push(`%${customer}%`);
  }
  
  if (currency && currency !== 'All') {
    conditions.push('currency = ?');
    params.push(currency);
  }
  
  if (invoice_number) {
    conditions.push('invoice_number LIKE ?');
    params.push(`%${invoice_number}%`);
  }
  
  if (is_sent !== undefined) {
    conditions.push('is_sent = ?');
    params.push(is_sent === 'true' ? 1 : 0);
  }
  
  if (search) {
    conditions.push('(customer_name LIKE ? OR customer_email LIKE ? OR invoice_number LIKE ? OR item_name LIKE ? OR address LIKE ? OR note LIKE ?)');
    const searchTerm = `%${search}%`;
    params.push(searchTerm, searchTerm, searchTerm, searchTerm, searchTerm, searchTerm);
  }
  
  // Apply conditions to regular invoice query
  if (conditions.length > 0) {
    query = query.replace('WHERE 1=1', `WHERE 1=1 AND ${conditions.join(' AND ')}`);
  }
  
  // Apply same filters to PO invoices part (only if PO invoices are included)
  if (exclude_po !== 'true') {
    const poFilters = [];
    if (status && status !== 'All') {
      poFilters.push(' AND status = ?');
      poParams.push(status);
    }
    
    if (minAmount) {
      poFilters.push(' AND total_amount >= ?');
      poParams.push(parseFloat(minAmount));
    }
    
    if (maxAmount) {
      poFilters.push(' AND total_amount <= ?');
      poParams.push(parseFloat(maxAmount));
    }
    
    if (dateFrom) {
      poFilters.push(' AND invoice_date >= ?');
      poParams.push(dateFrom);
    }
    
    if (dateTo) {
      poFilters.push(' AND invoice_date <= ?');
      poParams.push(dateTo);
    }
    
    if (customer) {
      poFilters.push(' AND customer_name LIKE ?');
      poParams.push(`%${customer}%`);
    }
    
    if (currency && currency !== 'All') {
      poFilters.push(' AND currency = ?');
      poParams.push(currency);
    }
    
    if (invoice_number) {
      poFilters.push(' AND invoice_number LIKE ?');
      poParams.push(`%${invoice_number}%`);
    }
    
    if (is_sent !== undefined) {
      poFilters.push(` AND CASE WHEN status = 'Sent' THEN 1 ELSE 0 END = ?`);
      poParams.push(is_sent === 'true' ? 1 : 0);
    }
    
    if (search) {
      poFilters.push(' AND (customer_name LIKE ? OR customer_email LIKE ? OR invoice_number LIKE ? OR notes LIKE ?)');
      const searchTerm = `%${search}%`;
      poParams.push(searchTerm, searchTerm, searchTerm, searchTerm);
    }
    
    // Apply PO filters to the second part of UNION
    if (poFilters.length > 0) {
      query = query.replace('FROM po_invoices\n      WHERE 1=1', `FROM po_invoices\n      WHERE 1=1${poFilters.join('')}`);
    }
  }
  
  // Combine parameters for both parts of the union
  const allParams = [...params, ...poParams];
  
  // Wrap the UNION query and apply sorting
  const allowedSortFields = ['id', 'invoice_number', 'customer_name', 'bill_date', 'total_amount', 'status', 'created_at'];
  const allowedSortOrders = ['ASC', 'DESC'];
  
  let finalQuery = `SELECT * FROM (${query}) AS unified_invoices`;
  
  if (allowedSortFields.includes(sortBy) && allowedSortOrders.includes(sortOrder.toUpperCase())) {
    finalQuery += ` ORDER BY ${sortBy} ${sortOrder.toUpperCase()}`;
  } else {
    finalQuery += " ORDER BY bill_date DESC";
  }
  
  // Pagination
  const pageNum = parseInt(page, 10) || 1;
  const limitNum = parseInt(limit, 10) || 50;
  const offset = (pageNum - 1) * limitNum;
  
  // First get the total count for pagination using the same unified query
  const countQuery = `SELECT COUNT(*) as total FROM (${query}) AS count_table`;
  
  db.query(countQuery, allParams, (err, countResults) => {
    if (err) {
      console.error("Error counting invoices:", err);
      res.status(500).json({ error: "Failed to count invoices" });
      return;
    }
    
    const totalRecords = countResults[0].total;
    const totalPages = Math.ceil(totalRecords / limitNum);
    
    // Add pagination to main query
    finalQuery += " LIMIT ? OFFSET ?";
    allParams.push(limitNum, offset);
    
    // Execute main query
    db.query(finalQuery, allParams, (err, results) => {
      if (err) {
        console.error("Error fetching invoices:", err);
        res.status(500).json({ error: "Failed to fetch invoices" });
        return;
      }
      
      // Return data with pagination info
      res.json({
        data: results,
        pagination: {
          currentPage: pageNum,
          totalPages: totalPages,
          totalRecords: totalRecords,
          limit: limitNum,
          hasNext: pageNum < totalPages,
          hasPrev: pageNum > 1
        },
        filters: {
          status, minAmount, maxAmount, dateFrom, dateTo, 
          customer, search, is_sent, currency, invoice_number
        }
      });
    });
  });
});

// Get invoice filter options and statistics
app.get("/api/invoices/filters/options", (req, res) => {
  const queries = [
    // Get all unique statuses
    "SELECT DISTINCT status FROM invoice WHERE status IS NOT NULL AND status != '' ORDER BY status",
    // Get all unique currencies
    "SELECT DISTINCT currency FROM invoice WHERE currency IS NOT NULL AND currency != '' ORDER BY currency",
    // Get invoice statistics
    `SELECT 
      COUNT(*) as total_invoices,
      COUNT(CASE WHEN status = 'Paid' THEN 1 END) as paid_count,
      COUNT(CASE WHEN status = 'Pending' THEN 1 END) as pending_count,
      COUNT(CASE WHEN status = 'Draft' THEN 1 END) as draft_count,
      COUNT(CASE WHEN status = 'Cancelled' THEN 1 END) as cancelled_count,
      COUNT(CASE WHEN is_sent = 1 THEN 1 END) as sent_count,
      COUNT(CASE WHEN is_sent = 0 THEN 1 END) as not_sent_count,
      MIN(total_amount) as min_amount,
      MAX(total_amount) as max_amount,
      AVG(total_amount) as avg_amount,
      MIN(bill_date) as earliest_date,
      MAX(bill_date) as latest_date
     FROM invoice`,
    // Get top customers by invoice count
    "SELECT customer_name, COUNT(*) as invoice_count, SUM(total_amount) as total_amount FROM invoice GROUP BY customer_name ORDER BY invoice_count DESC LIMIT 10"
  ];

  const executeQueries = async () => {
    try {
      const results = await Promise.all(
        queries.map(query => 
          new Promise((resolve, reject) => {
            db.query(query, (err, result) => {
              if (err) reject(err);
              else resolve(result);
            });
          })
        )
      );

      const [statuses, currencies, statistics, topCustomers] = results;

      res.json({
        statuses: statuses.map(row => row.status),
        currencies: currencies.map(row => row.currency),
        statistics: statistics[0],
        topCustomers: topCustomers,
        success: true
      });
    } catch (error) {
      console.error("Error fetching filter options:", error);
      res.status(500).json({ error: "Failed to fetch filter options" });
    }
  };

  executeQueries();
});

// Get single invoice by ID with its items and payments
app.get("/api/invoices/:id", (req, res) => {
  const { id } = req.params;
  
  // First get the invoice
  const invoiceQuery = "SELECT * FROM invoice WHERE id = ?";
  db.query(invoiceQuery, [id], (err, invoiceResults) => {
    if (err) {
      console.error("Error fetching invoice:", err);
      res.status(500).json({ error: "Failed to fetch invoice" });
      return;
    }
    if (invoiceResults.length === 0) {
      res.status(404).json({ error: "Invoice not found" });
      return;
    }
    
    const invoice = invoiceResults[0];
    
    // Get invoice items
    const itemsQuery = "SELECT * FROM invoice_items WHERE invoice_id = ? ORDER BY item_no";
    db.query(itemsQuery, [id], (err, itemsResults) => {
      if (err) {
        console.error("Error fetching invoice items:", err);
        res.status(500).json({ error: "Failed to fetch invoice items" });
        return;
      }
      
      // Get invoice payments
      const paymentsQuery = "SELECT * FROM invoice_payments WHERE invoice_id = ? ORDER BY payment_date";
      db.query(paymentsQuery, [id], (err, paymentsResults) => {
        if (err) {
          console.error("Error fetching invoice payments:", err);
          res.status(500).json({ error: "Failed to fetch invoice payments" });
          return;
        }
        
        // Combine all data
        const invoiceWithDetails = {
          ...invoice,
          items: itemsResults,
          payments: paymentsResults
        };
        
        res.json(invoiceWithDetails);
      });
    });
  });
});

// Create new invoice with multiple items support
app.post("/api/invoices", (req, res) => {
  console.log('Received invoice creation request:', req.body); // Debug log
  
  const {
    customer_name, customer_email, p_number, a_p_number, address,
    st_reg_no, ntn_number, currency, subtotal, tax_rate, tax_amount, 
    total_amount, bill_date, payment_deadline, note, status = "Pending", 
    items = []
  } = req.body;

  // Validate required fields
  if (!customer_name || !customer_email) {
    return res.status(400).json({ 
      error: "Missing required fields", 
      required: ["customer_name", "customer_email"] 
    });
  }

  // Check if customer exists in the database
  const checkCustomerQuery = "SELECT customer_id FROM customertable WHERE customer = ?";
  db.query(checkCustomerQuery, [customer_name], (err, customerResults) => {
    if (err) {
      console.error("Error checking customer:", err);
      return res.status(500).json({ 
        error: "Failed to verify customer", 
        details: err.message 
      });
    }

    if (customerResults.length === 0) {
      return res.status(400).json({ 
        error: "Customer not present. Kindly create new Customer first." 
      });
    }

    const customer_id = customerResults[0].customer_id;

    // Validate bill_date and payment_deadline as they are required in DB
    if (!bill_date) {
      return res.status(400).json({ 
        error: "Bill date is required" 
      });
    }

    if (!payment_deadline) {
      return res.status(400).json({ 
        error: "Payment deadline is required" 
      });
    }

    // Validate items
    if (!items || items.length === 0) {
      return res.status(400).json({ 
        error: "At least one item is required" 
      });
    }

    // Generate unique invoice number
    const invoice_number = `INV-${new Date().getFullYear()}-${Date.now()}`;
    
    console.log('Generated invoice_number:', invoice_number); // Debug log

    // Start transaction for invoice and items
    db.beginTransaction((err) => {
      if (err) {
        console.error("Error starting transaction:", err);
        return res.status(500).json({ 
          error: "Failed to start transaction", 
          details: err.message 
        });
      }

      // Insert invoice
      const invoiceQuery = `
        INSERT INTO invoice (
          invoice_number, customer_id, customer_name, customer_email, p_number, a_p_number, address,
          st_reg_no, ntn_number, currency, subtotal, tax_rate, tax_amount, total_amount, bill_date,
          payment_deadline, note, status
        ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
      `;

      const invoiceValues = [
        invoice_number, customer_id, customer_name, customer_email, p_number || '', a_p_number || '', address || '',
        st_reg_no || '', ntn_number || '', currency || 'PKR', subtotal || 0, tax_rate || 17,
        tax_amount || 0, total_amount || 0, bill_date, payment_deadline, note || '', status
      ];

      console.log('Executing invoice query with values:', invoiceValues); // Debug log

      db.query(invoiceQuery, invoiceValues, (err, invoiceResult) => {
        if (err) {
          console.error("Error creating invoice:", err);
          return db.rollback(() => {
            res.status(500).json({ 
              error: "Failed to create invoice", 
              details: err.message 
            });
          });
        }

        const invoiceId = invoiceResult.insertId;
        console.log('Invoice created with ID:', invoiceId);

        // Insert invoice items
        if (items.length > 0) {
          const itemsQuery = `
            INSERT INTO invoice_items (invoice_id, item_no, description, quantity, rate, amount)
            VALUES ?
          `;

          const itemsValues = items.map(item => [
            invoiceId,
            item.item_no || 1,
            item.description || '',
            item.quantity || 0,
            item.rate || 0,
            item.amount || 0
          ]);

          db.query(itemsQuery, [itemsValues], (err, itemsResult) => {
            if (err) {
              console.error("Error creating invoice items:", err);
              return db.rollback(() => {
                res.status(500).json({ 
                  error: "Failed to create invoice items", 
                  details: err.message 
                });
              });
            }

            // Commit transaction
            db.commit((err) => {
              if (err) {
                console.error("Error committing transaction:", err);
                return db.rollback(() => {
                  res.status(500).json({ 
                    error: "Failed to commit transaction", 
                    details: err.message 
                  });
                });
              }

              console.log('Invoice and items created successfully');
              res.status(201).json({ 
                id: invoiceId, 
                message: "Invoice created successfully",
                invoice: {
                  id: invoiceId,
                  invoice_number,
                  customer_name,
                  customer_email,
                  total_amount,
                  status,
                  items_count: items.length
                }
              });
            });
          });
        } else {
          // No items, just commit invoice
          db.commit((err) => {
            if (err) {
              console.error("Error committing transaction:", err);
              return db.rollback(() => {
                res.status(500).json({ 
                  error: "Failed to commit transaction", 
                  details: err.message 
                });
              });
            }

            console.log('Invoice created successfully');
            res.status(201).json({ 
              id: invoiceId, 
              message: "Invoice created successfully",
              invoice: {
                id: invoiceId,
                invoice_number,
                customer_name,
                customer_email,
                total_amount,
                status
              }
            });
          });
        }
      });
    });
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
      payment_deadline = ?, note = ?, status = ?
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

// --- Transaction History Routes ---

// Get latest paid invoices for transaction history with pagination
app.get("/api/transaction-history", (req, res) => {
  const { page = 1, limit = 10 } = req.query;
  const offset = (parseInt(page) - 1) * parseInt(limit);
  
  // Query to get paid invoices with customer info
  const query = `
    SELECT 
      i.id,
      i.invoice_number,
      i.customer_name,
      i.total_amount,
      i.currency,
      i.bill_date,
      i.payment_deadline,
      i.created_at,
      'Paid Invoice' as transaction_type,
      'income' as type
    FROM invoice i 
    WHERE i.status = 'Paid'
    ORDER BY i.created_at DESC, i.bill_date DESC
    LIMIT ? OFFSET ?
  `;
  
  // Count query for pagination
  const countQuery = `
    SELECT COUNT(*) as total
    FROM invoice 
    WHERE status = 'Paid'
  `;
  
  // Execute count query first
  db.query(countQuery, (err, countResults) => {
    if (err) {
      console.error("Error counting paid invoices:", err);
      res.status(500).json({ error: "Failed to fetch transaction count" });
      return;
    }
    
    const totalRecords = countResults[0].total;
    const totalPages = Math.ceil(totalRecords / parseInt(limit));
    
    // Execute main query
    db.query(query, [parseInt(limit), offset], (err, results) => {
      if (err) {
        console.error("Error fetching transaction history:", err);
        res.status(500).json({ error: "Failed to fetch transaction history" });
        return;
      }
      
      // Format the results for the frontend
      const formattedResults = results.map(item => ({
        id: item.id,
        name: `${item.customer_name} - Invoice #${item.invoice_number || item.id}`,
        amount: parseFloat(item.total_amount),
        currency: item.currency || 'PKR',
        type: item.type,
        time: new Date(item.created_at).toLocaleTimeString('en-US', { 
          hour: '2-digit', 
          minute: '2-digit',
          hour12: true 
        }),
        date: item.bill_date,
        initial: item.customer_name ? item.customer_name.substring(0, 2).toUpperCase() : 'IN',
        transaction_type: item.transaction_type,
        invoice_id: item.id
      }));
      
      res.json({
        data: formattedResults,
        pagination: {
          currentPage: parseInt(page),
          totalPages: totalPages,
          totalRecords: totalRecords,
          limit: parseInt(limit),
          hasNext: parseInt(page) < totalPages,
          hasPrev: parseInt(page) > 1
        }
      });
    });
  });
});

// Get transaction statistics for dashboard
app.get("/api/transaction-stats", (req, res) => {
  const queries = [
    // Total paid invoices count
    "SELECT COUNT(*) as total_transactions FROM invoice WHERE status = 'Paid'",
    // Total paid amount
    "SELECT SUM(total_amount) as total_income FROM invoice WHERE status = 'Paid'",
    // Today's paid invoices
    "SELECT COUNT(*) as today_transactions FROM invoice WHERE status = 'Paid' AND DATE(created_at) = CURDATE()",
    // This month's paid amount
    "SELECT SUM(total_amount) as month_income FROM invoice WHERE status = 'Paid' AND MONTH(created_at) = MONTH(CURDATE()) AND YEAR(created_at) = YEAR(CURDATE())"
  ];

  const executeQueries = async () => {
    try {
      const results = await Promise.all(
        queries.map(query => 
          new Promise((resolve, reject) => {
            db.query(query, (err, result) => {
              if (err) reject(err);
              else resolve(result[0]);
            });
          })
        )
      );

      const [totalTxn, totalIncome, todayTxn, monthIncome] = results;

      res.json({
        totalTransactions: totalTxn.total_transactions || 0,
        totalIncome: parseFloat(totalIncome.total_income || 0),
        todayTransactions: todayTxn.today_transactions || 0,
        monthIncome: parseFloat(monthIncome.month_income || 0),
        success: true
      });
    } catch (error) {
      console.error("Error fetching transaction statistics:", error);
      res.status(500).json({ error: "Failed to fetch transaction statistics" });
    }
  };

  executeQueries();
});

// --- Categories Routes ---

// Get all categories with optional filtering
app.get("/api/categories", (req, res) => {
  const { 
    name, 
    description, 
    type, 
    status,
    page = 1,
    limit = 10 
  } = req.query;
  
  let query = `
    SELECT c.*, 
           COALESCE(e.expense_count, 0) as expense_count
    FROM categories c
    LEFT JOIN (
      SELECT category_id, COUNT(*) as expense_count 
      FROM expenses 
      GROUP BY category_id
    ) e ON c.id = e.category_id
    WHERE 1=1
  `;
  const params = [];
  
  // Apply filters
  if (name) {
    query += " AND c.name LIKE ?";
    params.push(`%${name}%`);
  }
  
  if (description) {
    query += " AND c.description LIKE ?";
    params.push(`%${description}%`);
  }
  
  if (type && type !== 'All') {
    query += " AND c.type = ?";
    params.push(type);
  }
  
  if (status && status !== 'All') {
    query += " AND c.status = ?";
    params.push(status);
  }
  
  // Count query for pagination
  const countQuery = query.replace(
    "SELECT c.*, COALESCE(e.expense_count, 0) as expense_count",
    "SELECT COUNT(DISTINCT c.id) as total"
  );
  
  // Add pagination
  const offset = (parseInt(page) - 1) * parseInt(limit);
  query += " ORDER BY c.created_date DESC LIMIT ? OFFSET ?";
  params.push(parseInt(limit), offset);
  
  // Execute count query first
  db.query(countQuery, params.slice(0, -2), (err, countResults) => {
    if (err) {
      console.error("Error counting categories:", err);
      res.status(500).json({ error: "Failed to count categories" });
      return;
    }
    
    const totalRecords = countResults[0].total;
    const totalPages = Math.ceil(totalRecords / parseInt(limit));
    
    // Execute main query
    db.query(query, params, (err, results) => {
      if (err) {
        console.error("Error fetching categories:", err);
        res.status(500).json({ error: "Failed to fetch categories" });
        return;
      }
      
      res.json({
        data: results,
        pagination: {
          currentPage: parseInt(page),
          totalPages: totalPages,
          totalRecords: totalRecords,
          limit: parseInt(limit),
          hasNext: parseInt(page) < totalPages,
          hasPrev: parseInt(page) > 1
        }
      });
    });
  });
});

// Get category statistics
app.get("/api/categories/stats", (req, res) => {
  const queries = [
    "SELECT COUNT(*) as total FROM categories",
    "SELECT COUNT(*) as active FROM categories WHERE status = 'Active'",
    "SELECT COUNT(*) as expense_categories FROM categories WHERE type = 'Expense'",
    "SELECT SUM(COALESCE(e.expense_count, 0)) as total_expenses FROM categories c LEFT JOIN (SELECT category_id, COUNT(*) as expense_count FROM expenses GROUP BY category_id) e ON c.id = e.category_id"
  ];

  const executeQueries = async () => {
    try {
      const results = await Promise.all(
        queries.map(query => 
          new Promise((resolve, reject) => {
            db.query(query, (err, result) => {
              if (err) reject(err);
              else resolve(result[0]);
            });
          })
        )
      );

      const [total, active, expenseCategories, totalExpenses] = results;

      res.json({
        totalCategories: total.total || 0,
        activeCategories: active.active || 0,
        expenseCategories: expenseCategories.expense_categories || 0,
        totalExpenses: totalExpenses.total_expenses || 0,
        success: true
      });
    } catch (error) {
      console.error("Error fetching category statistics:", error);
      res.status(500).json({ error: "Failed to fetch category statistics" });
    }
  };

  executeQueries();
});

// Create new category
app.post("/api/categories", (req, res) => {
  const {
    name,
    description,
    type = 'Expense',
    status = 'Active',
    color = '#3B82F6',
    icon = 'FolderOpen'
  } = req.body;

  if (!name) {
    return res.status(400).json({ error: "Category name is required" });
  }

  const query = `
    INSERT INTO categories (name, description, type, status, color, icon, created_date)
    VALUES (?, ?, ?, ?, ?, ?, CURDATE())
  `;

  db.query(query, [name, description, type, status, color, icon], (err, result) => {
    if (err) {
      console.error("Error creating category:", err);
      if (err.code === 'ER_DUP_ENTRY') {
        res.status(409).json({ error: "Category with this name already exists" });
      } else {
        res.status(500).json({ error: "Failed to create category" });
      }
      return;
    }

    res.status(201).json({
      message: "Category created successfully",
      categoryId: result.insertId
    });
  });
});

// Update category
app.put("/api/categories/:id", (req, res) => {
  const { id } = req.params;
  const {
    name,
    description,
    type,
    status,
    color,
    icon
  } = req.body;

  if (!name) {
    return res.status(400).json({ error: "Category name is required" });
  }

  const query = `
    UPDATE categories 
    SET name = ?, description = ?, type = ?, status = ?, color = ?, icon = ?
    WHERE id = ?
  `;

  db.query(query, [name, description, type, status, color, icon, id], (err, result) => {
    if (err) {
      console.error("Error updating category:", err);
      if (err.code === 'ER_DUP_ENTRY') {
        res.status(409).json({ error: "Category with this name already exists" });
      } else {
        res.status(500).json({ error: "Failed to update category" });
      }
      return;
    }

    if (result.affectedRows === 0) {
      return res.status(404).json({ error: "Category not found" });
    }

    res.json({ message: "Category updated successfully" });
  });
});

// Delete category
app.delete("/api/categories/:id", (req, res) => {
  const { id } = req.params;

  // First check if category has associated expenses
  const checkQuery = "SELECT COUNT(*) as expense_count FROM expenses WHERE category_id = ?";
  
  db.query(checkQuery, [id], (err, results) => {
    if (err) {
      console.error("Error checking category usage:", err);
      res.status(500).json({ error: "Failed to check category usage" });
      return;
    }

    const expenseCount = results[0].expense_count;
    if (expenseCount > 0) {
      return res.status(400).json({ 
        error: `Cannot delete category. It has ${expenseCount} associated expenses.` 
      });
    }

    // If no expenses, proceed with deletion
    const deleteQuery = "DELETE FROM categories WHERE id = ?";
    
    db.query(deleteQuery, [id], (err, result) => {
      if (err) {
        console.error("Error deleting category:", err);
        res.status(500).json({ error: "Failed to delete category" });
        return;
      }

      if (result.affectedRows === 0) {
        return res.status(404).json({ error: "Category not found" });
      }

      res.json({ message: "Category deleted successfully" });
    });
  });
});

// Get single category
app.get("/api/categories/:id", (req, res) => {
  const { id } = req.params;
  
  const query = `
    SELECT c.*, 
           COALESCE(e.expense_count, 0) as expense_count
    FROM categories c
    LEFT JOIN (
      SELECT category_id, COUNT(*) as expense_count 
      FROM expenses 
      WHERE category_id = ?
      GROUP BY category_id
    ) e ON c.id = e.category_id
    WHERE c.id = ?
  `;
  
  db.query(query, [id, id], (err, results) => {
    if (err) {
      console.error("Error fetching category:", err);
      res.status(500).json({ error: "Failed to fetch category" });
      return;
    }

    if (results.length === 0) {
      return res.status(404).json({ error: "Category not found" });
    }

    res.json(results[0]);
  });
});

// --- Company Settings Routes ---

// Get company settings
app.get("/api/company-settings", (req, res) => {
  const query = "SELECT * FROM company_settings WHERE id = 1";
  
  db.query(query, (err, results) => {
    if (err) {
      console.error("Error fetching company settings:", err);
      res.status(500).json({ error: "Failed to fetch company settings" });
      return;
    }
    
    if (results.length === 0) {
      // Return default settings if none exist
      res.json({
        company_name: 'A Rauf Brother Textile',
        address: 'Room No.205 Floor Saleha Chamber, Plot No. 8-9/C-1 Site, Karachi',
        email: 'contact@araufbrothe.com',
        phone: '021-36404043',
        st_reg_no: '3253255666541',
        ntn_no: '7755266214-8',
        logo_path: '/assets/Logo/Logo.png'
      });
    } else {
      res.json(results[0]);
    }
  });
});

// Update company settings
app.put("/api/company-settings", (req, res) => {
  const {
    company_name,
    address,
    email,
    phone,
    st_reg_no,
    ntn_no,
    logo_path
  } = req.body;

  const query = `
    UPDATE company_settings 
    SET company_name = ?, address = ?, email = ?, phone = ?, st_reg_no = ?, ntn_no = ?, logo_path = ?
    WHERE id = 1
  `;

  db.query(query, [company_name, address, email, phone, st_reg_no, ntn_no, logo_path], (err, result) => {
    if (err) {
      console.error("Error updating company settings:", err);
      res.status(500).json({ error: "Failed to update company settings" });
      return;
    }

    if (result.affectedRows === 0) {
      // Insert if no record exists
      const insertQuery = `
        INSERT INTO company_settings (id, company_name, address, email, phone, st_reg_no, ntn_no, logo_path)
        VALUES (1, ?, ?, ?, ?, ?, ?, ?)
      `;
      
      db.query(insertQuery, [company_name, address, email, phone, st_reg_no, ntn_no, logo_path], (err, result) => {
        if (err) {
          console.error("Error inserting company settings:", err);
          res.status(500).json({ error: "Failed to create company settings" });
          return;
        }
        
        res.json({ message: "Company settings created successfully" });
      });
    } else {
      res.json({ message: "Company settings updated successfully" });
    }
  });
});

// --- Purchase Order Routes ---

// Get all purchase orders with optional filtering
app.get("/api/purchase-orders", (req, res) => {
  const { status, supplier, minAmount, maxAmount, startDate, endDate } = req.query;
  
  let query = "SELECT * FROM purchase_orders WHERE 1=1";
  const params = [];
  
  if (status && status !== 'All') {
    query += " AND status = ?";
    params.push(status);
  }
  
  if (supplier) {
    query += " AND supplier_name LIKE ?";
    params.push(`%${supplier}%`);
  }
  
  if (minAmount) {
    query += " AND total_amount >= ?";
    params.push(parseFloat(minAmount));
  }
  
  if (maxAmount) {
    query += " AND total_amount <= ?";
    params.push(parseFloat(maxAmount));
  }
  
  if (startDate) {
    query += " AND po_date >= ?";
    params.push(startDate);
  }
  
  if (endDate) {
    query += " AND po_date <= ?";
    params.push(endDate);
  }
  
  query += " ORDER BY po_date DESC, created_at DESC";
  
  db.query(query, params, (err, results) => {
    if (err) {
      console.error("Error fetching purchase orders:", err.message);
      return res.status(500).json({ message: "Failed to fetch purchase orders", error: err.message });
    }
    res.json(results);
  });
});

// Get single purchase order by ID with its items
app.get("/api/purchase-orders/:id", (req, res) => {
  const { id } = req.params;
  
  // Check if the ID is numeric (database ID) or alphanumeric (PO number)
  const isNumericId = /^\d+$/.test(id);
  const whereCondition = isNumericId ? "id = ?" : "po_number = ?";
  
  // First get the purchase order
  const poQuery = `SELECT * FROM purchase_orders WHERE ${whereCondition}`;
  db.query(poQuery, [id], (err, poResults) => {
    if (err) {
      console.error("Error fetching purchase order:", err.message);
      return res.status(500).json({ message: "Failed to fetch purchase order", error: err.message });
    }
    
    if (poResults.length === 0) {
      return res.status(404).json({ message: "Purchase order not found" });
    }
    
    const purchaseOrder = poResults[0];
    const actualId = purchaseOrder.id; // Always use the numeric database ID for items lookup
    
    // Get purchase order items (if table exists)
    const itemsQuery = "SELECT * FROM purchase_order_items WHERE purchase_order_id = ? ORDER BY item_no";
    db.query(itemsQuery, [actualId], (err, itemsResults) => {
      if (err) {
        console.error("Error fetching purchase order items:", err);
        console.error("Note: If purchase_order_items table doesn't exist, please run database_updates.sql");
        // Still return PO even if items fetch fails
        return res.json({
          ...purchaseOrder,
          items: [],
          note: "Items table not available"
        });
      }
      
      // Combine purchase order with items
      const poWithItems = {
        ...purchaseOrder,
        items: itemsResults || []
      };
      
      res.json(poWithItems);
    });
  });
});

// Create new purchase order with multiple items support
app.post("/api/purchase-orders", (req, res) => {
  console.log('Received PO creation request:', req.body); // Debug log

  const {
    po_number,
    po_date,
    supplier_name,
    supplier_email,
    supplier_phone,
    supplier_address,
    subtotal,
    tax_rate = 17,
    tax_amount,
    total_amount,
    currency = 'PKR',
    status = 'Pending',
    notes = '',
    items = []
  } = req.body;

  // Validate required fields
  if (!po_number || !po_date || !supplier_name) {
    return res.status(400).json({ message: "Missing required fields: po_number, po_date, supplier_name" });
  }

  // For multiple items, calculate total amount from items
  let calculatedSubtotal = subtotal;
  let calculatedTaxAmount = tax_amount;
  let calculatedTotal = total_amount;
  
  if (items && items.length > 0) {
    calculatedSubtotal = items.reduce((sum, item) => sum + (item.amount || 0), 0);
    calculatedTaxAmount = calculatedSubtotal * (tax_rate / 100);
    calculatedTotal = calculatedSubtotal + calculatedTaxAmount;
  }

  // Start transaction for PO and items
  db.beginTransaction((err) => {
    if (err) {
      console.error("Error starting transaction:", err);
      return res.status(500).json({ message: "Failed to start transaction", error: err.message });
    }

    const query = `
      INSERT INTO purchase_orders (
        po_number, po_date, supplier_name, supplier_email, supplier_phone, supplier_address,
        subtotal, tax_rate, tax_amount, total_amount, currency, status, notes
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `;
    
    const values = [
      po_number, po_date, supplier_name, supplier_email || '', supplier_phone || '', supplier_address || '',
      calculatedSubtotal, tax_rate, calculatedTaxAmount, calculatedTotal, currency, status, notes
    ];

    db.query(query, values, (err, result) => {
      if (err) {
        console.error("Error creating purchase order:", err.message);
        return db.rollback(() => {
          res.status(500).json({ message: "Failed to create purchase order", error: err.message });
        });
      }
      
      const poId = result.insertId;
      console.log('Purchase order created with ID:', poId);

      // Insert PO items if provided
      if (items && items.length > 0) {
        const itemsQuery = `
          INSERT INTO purchase_order_items (purchase_order_id, item_no, description, quantity, unit_price, amount)
          VALUES ?
        `;

        const itemsValues = items.map(item => [
          poId,
          item.item_no || 1,
          item.description || '',
          item.quantity || 1,
          item.unit_price || 0,
          item.amount || 0
        ]);

        db.query(itemsQuery, [itemsValues], (err, itemsResult) => {
          if (err) {
            console.error("Error creating PO items:", err);
            console.error("Note: If purchase_order_items table doesn't exist, please run database_updates.sql");
            // Still commit the PO even if items table doesn't exist
            return db.commit((commitErr) => {
              if (commitErr) {
                console.error("Error committing transaction:", commitErr);
                return db.rollback(() => {
                  res.status(500).json({ message: "Failed to commit transaction", error: commitErr.message });
                });
              }

              console.log('Purchase order created successfully (without items due to table error)');
              res.status(201).json({
                message: "Purchase order created successfully",
                purchase_order: {
                  id: poId,
                  po_number,
                  po_date,
                  supplier_name,
                  supplier_email: supplier_email || '',
                  supplier_phone: supplier_phone || '',
                  supplier_address: supplier_address || '',
                  subtotal: calculatedSubtotal,
                  tax_rate,
                  tax_amount: calculatedTaxAmount,
                  total_amount: calculatedTotal,
                  currency,
                  status,
                  notes,
                  items_count: 0,
                  items: [],
                  note: "Items table not available - run database_updates.sql"
                }
              });
            });
          }

          // Commit transaction and return success
          db.commit((err) => {
            if (err) {
              console.error("Error committing transaction:", err);
              return db.rollback(() => {
                res.status(500).json({ message: "Failed to commit transaction", error: err.message });
              });
            }

            console.log('Purchase order and items created successfully');
            res.status(201).json({
              message: "Purchase order created successfully",
              purchase_order: {
                id: poId,
                po_number,
                po_date,
                supplier_name,
                supplier_email: supplier_email || '',
                supplier_phone: supplier_phone || '',
                supplier_address: supplier_address || '',
                subtotal: calculatedSubtotal,
                tax_rate,
                tax_amount: calculatedTaxAmount,
                total_amount: calculatedTotal,
                currency,
                status,
                notes,
                items_count: items.length,
                items: items
              }
            });
          });
        });
      } else {
        // No items, just commit PO
        db.commit((err) => {
          if (err) {
            console.error("Error committing transaction:", err);
            return db.rollback(() => {
              res.status(500).json({ message: "Failed to commit transaction", error: err.message });
            });
          }

          console.log('Purchase order created successfully');
          res.status(201).json({
            message: "Purchase order created successfully",
            purchase_order: {
              id: poId,
              po_number,
              po_date,
              supplier_name,
              supplier_email: supplier_email || '',
              supplier_phone: supplier_phone || '',
              supplier_address: supplier_address || '',
              subtotal: calculatedSubtotal,
              tax_rate,
              tax_amount: calculatedTaxAmount,
              total_amount: calculatedTotal,
              currency,
              status,
              notes,
              items_count: 0,
              items: []
            }
          });
        });
      }
    });
  });
});

// Update purchase order
app.put("/api/purchase-orders/:id", (req, res) => {
  const id = req.params.id;
  
  // Check if the ID is numeric (database ID) or alphanumeric (PO number)
  const isNumericId = /^\d+$/.test(id);
  
  // If it's a PO number, we need to get the database ID first
  if (!isNumericId) {
    const getIdQuery = "SELECT id FROM purchase_orders WHERE po_number = ?";
    db.query(getIdQuery, [id], (err, results) => {
      if (err) {
        return res.status(500).json({ message: "Failed to find purchase order", error: err.message });
      }
      if (results.length === 0) {
        return res.status(404).json({ message: "Purchase order not found" });
      }
      const actualId = results[0].id;
      updatePurchaseOrder(actualId, req.body, res);
    });
  } else {
    updatePurchaseOrder(id, req.body, res);
  }
});

function updatePurchaseOrder(poId, requestBody, res) {
  const {
    po_number,
    po_date,
    supplier_name,
    supplier_email,
    supplier_phone,
    supplier_address,
    subtotal,
    tax_rate,
    tax_amount,
    total_amount,
    currency,
    status,
    notes,
    previous_status,
    items = []
  } = requestBody;

  // Begin transaction for updating PO and items
  db.beginTransaction((transactionErr) => {
    if (transactionErr) {
      return res.status(500).json({ message: "Database transaction error", error: transactionErr.message });
    }

    // Update purchase order
    const updatePOQuery = `
      UPDATE purchase_orders SET
        po_number = ?, po_date = ?, supplier_name = ?, supplier_email = ?, supplier_phone = ?,
        supplier_address = ?, subtotal = ?, tax_rate = ?, tax_amount = ?, total_amount = ?,
        currency = ?, status = ?, notes = ?, previous_status = ?, updated_at = CURRENT_TIMESTAMP
      WHERE id = ?
    `;

    const updatePOValues = [
      po_number, po_date, supplier_name, supplier_email || '', supplier_phone || '',
      supplier_address || '', subtotal, tax_rate, tax_amount, total_amount,
      currency, status, notes || '', previous_status || null, poId
    ];

    db.query(updatePOQuery, updatePOValues, (err, results) => {
      if (err) {
        console.error("Error updating purchase order:", err);
        return db.rollback(() => {
          res.status(500).json({ message: "Failed to update purchase order", error: err.message });
        });
      }

      if (results.affectedRows === 0) {
        return db.rollback(() => {
          res.status(404).json({ message: "Purchase order not found" });
        });
      }

      // Delete existing items
      const deleteItemsQuery = "DELETE FROM purchase_order_items WHERE purchase_order_id = ?";
      db.query(deleteItemsQuery, [poId], (deleteErr) => {
        if (deleteErr) {
          console.error("Error deleting existing items:", deleteErr);
          return db.rollback(() => {
            res.status(500).json({ message: "Failed to update items", error: deleteErr.message });
          });
        }

        // Insert new items if provided
        if (items && items.length > 0) {
          const itemsQuery = `
            INSERT INTO purchase_order_items (purchase_order_id, item_no, description, quantity, unit_price, amount)
            VALUES ?
          `;

          const itemsValues = items.map(item => [
            poId,
            item.item_no || 1,
            item.description || '',
            item.quantity || 1,
            item.unit_price || 0,
            item.amount || 0
          ]);

          db.query(itemsQuery, [itemsValues], (itemsErr) => {
            if (itemsErr) {
              console.error("Error updating PO items:", itemsErr);
              return db.rollback(() => {
                res.status(500).json({ message: "Failed to update items", error: itemsErr.message });
              });
            }

            // Commit transaction
            db.commit((commitErr) => {
              if (commitErr) {
                return db.rollback(() => {
                  res.status(500).json({ message: "Transaction commit failed", error: commitErr.message });
                });
              }

              res.json({ 
                message: "Purchase order updated successfully",
                purchase_order: {
                  id: poId,
                  po_number,
                  po_date,
                  supplier_name,
                  supplier_email,
                  supplier_phone,
                  supplier_address,
                  subtotal,
                  tax_rate,
                  tax_amount,
                  total_amount,
                  currency,
                  status,
                  notes,
                  items
                }
              });
            });
          });
        } else {
          // No items to insert, just commit the PO update
          db.commit((commitErr) => {
            if (commitErr) {
              return db.rollback(() => {
                res.status(500).json({ message: "Transaction commit failed", error: commitErr.message });
              });
            }

            res.json({ 
              message: "Purchase order updated successfully",
              purchase_order: {
                id: poId,
                po_number,
                po_date,
                supplier_name,
                supplier_email,
                supplier_phone,
                supplier_address,
                subtotal,
                tax_rate,
                tax_amount,
                total_amount,
                currency,
                status,
                notes,
                items: []
              }
            });
          });
        }
      });
    });
  });
}

// Delete purchase order
app.delete("/api/purchase-orders/:id", (req, res) => {
  const { id } = req.params;
  
  // Check if the ID is numeric (database ID) or alphanumeric (PO number)
  const isNumericId = /^\d+$/.test(id);
  const whereCondition = isNumericId ? "id = ?" : "po_number = ?";
  const query = `DELETE FROM purchase_orders WHERE ${whereCondition}`;
  
  db.query(query, [id], (err, results) => {
    if (err) {
      console.error("Error deleting purchase order:", err);
      res.status(500).json({ error: "Failed to delete purchase order" });
      return;
    }
    if (results.affectedRows === 0) {
      res.status(404).json({ error: "Purchase order not found" });
      return;
    }
    res.json({ message: "Purchase order deleted successfully" });
  });
});

// --- PO Invoice Routes ---

// Create invoice from PO
app.post("/api/po-invoices", (req, res) => {
  console.log('Creating PO invoice:', req.body);

  const {
    invoice_number,
    invoice_date,
    due_date,
    po_id,
    po_number,
    customer_name,
    customer_email,
    customer_phone,
    customer_address,
    subtotal,
    tax_rate,
    tax_amount,
    total_amount,
    currency = 'PKR',
    status = 'Not Sent',
    notes = '',
    items = []
  } = req.body;

  // Validate required fields
  if (!invoice_number || !invoice_date || !po_number || !customer_name) {
    return res.status(400).json({ message: "Missing required fields: invoice_number, invoice_date, po_number, customer_name" });
  }

  // Start transaction for invoice and items
  db.beginTransaction((err) => {
    if (err) {
      console.error("Error starting transaction:", err);
      return res.status(500).json({ message: "Failed to start transaction", error: err.message });
    }

    const query = `
      INSERT INTO po_invoices (
        invoice_number, invoice_date, due_date, po_id, po_number, customer_name, 
        customer_email, customer_phone, customer_address, subtotal, tax_rate, 
        tax_amount, total_amount, currency, status, notes
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `;
    
    const values = [
      invoice_number, invoice_date, due_date, po_id, po_number, customer_name,
      customer_email || '', customer_phone || '', customer_address || '',
      subtotal, tax_rate, tax_amount, total_amount, currency, status, notes
    ];

    db.query(query, values, (err, result) => {
      if (err) {
        console.error("Error creating PO invoice:", err.message);
        return db.rollback(() => {
          res.status(500).json({ message: "Failed to create PO invoice", error: err.message });
        });
      }
      
      const invoiceId = result.insertId;
      console.log('PO invoice created with ID:', invoiceId);

      // Insert invoice items if provided
      if (items && items.length > 0) {
        const itemsQuery = `
          INSERT INTO po_invoice_items (po_invoice_id, item_no, description, quantity, unit_price, amount)
          VALUES ?
        `;

        const itemsValues = items.map((item, index) => [
          invoiceId,
          item.item_no || index + 1,
          item.description || '',
          item.quantity || 1,
          item.unitPrice || item.unit_price || 0,
          item.amount || 0
        ]);

        db.query(itemsQuery, [itemsValues], (err, itemsResult) => {
          if (err) {
            console.error("Error creating PO invoice items:", err);
            console.error("Note: If po_invoice_items table doesn't exist, please run database_update.sql");
            
            // Still commit the invoice even if items table doesn't exist
            return db.commit((commitErr) => {
              if (commitErr) {
                console.error("Error committing transaction:", commitErr);
                return db.rollback(() => {
                  res.status(500).json({ message: "Failed to commit transaction", error: commitErr.message });
                });
              }

              console.log('PO invoice created successfully (without items due to table error)');
              res.status(201).json({
                message: "PO invoice created successfully",
                invoice: {
                  id: invoiceId,
                  invoice_number,
                  po_number,
                  customer_name,
                  total_amount,
                  status,
                  items_count: 0,
                  note: "Items table not available - run database_update.sql"
                }
              });
            });
          }

          // Commit transaction and return success
          db.commit((err) => {
            if (err) {
              console.error("Error committing transaction:", err);
              return db.rollback(() => {
                res.status(500).json({ message: "Failed to commit transaction", error: err.message });
              });
            }

            console.log('PO invoice and items created successfully');
            res.status(201).json({
              message: "PO invoice created successfully",
              invoice: {
                id: invoiceId,
                invoice_number,
                po_number,
                customer_name,
                total_amount,
                status,
                items_count: items.length
              }
            });
          });
        });
      } else {
        // No items, just commit invoice
        db.commit((err) => {
          if (err) {
            console.error("Error committing transaction:", err);
            return db.rollback(() => {
              res.status(500).json({ message: "Failed to commit transaction", error: err.message });
            });
          }

          console.log('PO invoice created successfully');
          res.status(201).json({
            message: "PO invoice created successfully",
            invoice: {
              id: invoiceId,
              invoice_number,
              po_number,
              customer_name,
              total_amount,
              status
            }
          });
        });
      }
    });
  });
});

// Get single PO invoice by ID with its items
app.get("/api/po-invoices/:id", (req, res) => {
  const { id } = req.params;
  
  // First get the PO invoice
  const invoiceQuery = "SELECT * FROM po_invoices WHERE id = ?";
  db.query(invoiceQuery, [id], (err, invoiceResults) => {
    if (err) {
      console.error("Error fetching PO invoice:", err);
      res.status(500).json({ error: "Failed to fetch invoice" });
      return;
    }
    if (invoiceResults.length === 0) {
      res.status(404).json({ error: "Invoice not found" });
      return;
    }
    
    const invoice = invoiceResults[0];
    
    // Get PO invoice items
    const itemsQuery = "SELECT * FROM po_invoice_items WHERE po_invoice_id = ? ORDER BY item_no";
    db.query(itemsQuery, [id], (err, itemsResults) => {
      if (err) {
        console.error("Error fetching PO invoice items:", err);
        console.log("Note: If po_invoice_items table doesn't exist, returning invoice without items");
        // Still return invoice even if items fetch fails
        return res.json({
          ...invoice,
          items: []
        });
      }
      
      // Combine invoice with items
      const invoiceWithItems = {
        ...invoice,
        items: itemsResults || []
      };
      
      res.json(invoiceWithItems);
    });
  });
});

// Update PO invoice status
app.put("/api/po-invoices/:id", (req, res) => {
  const { id } = req.params;
  const { status, payment_date, notes } = req.body;

  if (!status) {
    return res.status(400).json({ message: "Status is required" });
  }

  let query = "UPDATE po_invoices SET status = ?, updated_at = CURRENT_TIMESTAMP";
  let params = [status];

  // Add payment_date if provided (when marking as paid)
  if (payment_date) {
    query += ", payment_date = ?";
    params.push(payment_date);
  }

  // Add notes if provided
  if (notes !== undefined) {
    query += ", notes = ?";
    params.push(notes);
  }

  query += " WHERE id = ?";
  params.push(id);

  db.query(query, params, (err, result) => {
    if (err) {
      console.error("Error updating PO invoice:", err.message);
      return res.status(500).json({ message: "Failed to update invoice", error: err.message });
    }

    if (result.affectedRows === 0) {
      return res.status(404).json({ message: "Invoice not found" });
    }

    // Get the updated invoice to return
    const selectQuery = "SELECT * FROM po_invoices WHERE id = ?";
    db.query(selectQuery, [id], (err, results) => {
      if (err) {
        console.error("Error fetching updated invoice:", err.message);
        return res.status(500).json({ message: "Invoice updated but failed to retrieve details", error: err.message });
      }

      res.json({
        message: "Invoice updated successfully",
        invoice: results[0]
      });
    });
  });
});

// Get all invoices for a specific PO with enhanced tracking
app.get("/api/purchase-orders/:poNumber/invoices", (req, res) => {
  const { poNumber } = req.params;
  
  // First, ensure PO total amount is synced in summary table
  const syncQuery = `
    INSERT INTO po_invoice_summary (po_number, po_total_amount, total_invoiced_amount, remaining_amount, invoice_count)
    SELECT 
      po.po_number,
      po.total_amount,
      COALESCE(SUM(pi.total_amount), 0),
      po.total_amount - COALESCE(SUM(pi.total_amount), 0),
      COUNT(pi.id)
    FROM purchase_orders po
    LEFT JOIN po_invoices pi ON po.po_number = pi.po_number
    WHERE po.po_number = ?
    GROUP BY po.po_number, po.total_amount
    ON DUPLICATE KEY UPDATE
      po_total_amount = VALUES(po_total_amount),
      total_invoiced_amount = VALUES(total_invoiced_amount),
      remaining_amount = VALUES(remaining_amount),
      invoice_count = VALUES(invoice_count),
      updated_at = CURRENT_TIMESTAMP
  `;
  
  db.query(syncQuery, [poNumber], (syncErr) => {
    if (syncErr) {
      console.error("Error syncing PO summary:", syncErr.message);
      // Continue anyway - don't fail the request
    }
    
    // Now get the invoices with summary data
    const query = `
      SELECT 
        pi.*,
        pis.po_total_amount,
        pis.total_invoiced_amount,
        pis.remaining_amount,
        pis.invoice_count
      FROM po_invoices pi
      LEFT JOIN po_invoice_summary pis ON pi.po_number = pis.po_number
      WHERE pi.po_number = ?
      ORDER BY pi.created_at DESC
    `;
    
    db.query(query, [poNumber], (err, results) => {
      if (err) {
        console.error("Error fetching PO invoices:", err.message);
        return res.status(500).json({ message: "Failed to fetch PO invoices", error: err.message });
      }
      res.json(results);
    });
  });
});

// Get PO invoice summary
app.get("/api/purchase-orders/:poNumber/invoice-summary", (req, res) => {
  const { poNumber } = req.params;
  
  const query = "SELECT * FROM po_invoice_summary WHERE po_number = ?";
  
  db.query(query, [poNumber], (err, results) => {
    if (err) {
      console.error("Error fetching PO invoice summary:", err.message);
      return res.status(500).json({ message: "Failed to fetch PO invoice summary", error: err.message });
    }
    
    if (results.length === 0) {
      // Return default summary if no invoices exist yet
      return res.json({
        po_number: poNumber,
        po_total_amount: 0,
        total_invoiced_amount: 0,
        remaining_amount: 0,
        invoice_count: 0,
        last_invoice_date: null
      });
    }
    
    res.json(results[0]);
  });
});

// Get all PO summaries for invoice tracking
app.get("/api/po-summaries", (req, res) => {
  const query = `
    SELECT 
      po_number,
      po_total_amount,
      total_invoiced_amount,
      remaining_amount,
      invoice_count,
      last_invoice_date,
      created_at,
      updated_at
    FROM po_invoice_summary 
    ORDER BY updated_at DESC
  `;
  
  db.query(query, (err, results) => {
    if (err) {
      console.error("Error fetching PO summaries:", err);
      return res.status(500).json({ 
        message: "Failed to fetch PO summaries", 
        error: err.message 
      });
    }
    
    res.json(results);
  });
});

// Delete PO invoice with proper tracking and history
app.delete("/api/po-invoices/:id", (req, res) => {
  const { id } = req.params;
  
  console.log(`Deleting PO invoice with ID: ${id}`);
  
  // Start transaction to ensure data consistency
  db.beginTransaction((err) => {
    if (err) {
      console.error("Error starting transaction:", err);
      return res.status(500).json({ 
        message: "Failed to start transaction", 
        error: err.message 
      });
    }
    
    // First, get the PO invoice details before deletion for tracking
    const getInvoiceQuery = `
      SELECT 
        pi.*,
        po.po_number as po_number_check,
        po.total_amount as po_total_amount
      FROM po_invoices pi
      LEFT JOIN purchase_orders po ON pi.po_number = po.po_number
      WHERE pi.id = ?
    `;
    
    db.query(getInvoiceQuery, [id], (err, invoiceResults) => {
      if (err) {
        console.error("Error fetching PO invoice for deletion:", err);
        return db.rollback(() => {
          res.status(500).json({ 
            message: "Failed to fetch invoice for deletion", 
            error: err.message 
          });
        });
      }
      
      if (invoiceResults.length === 0) {
        return db.rollback(() => {
          res.status(404).json({ message: "PO invoice not found" });
        });
      }
      
      const invoiceToDelete = invoiceResults[0];
      console.log('Invoice to delete:', invoiceToDelete);
      
      // Create deletion history record before actual deletion
      const historyQuery = `
        INSERT INTO po_deletion_history (
          po_invoice_id,
          invoice_number,
          po_number,
          customer_name,
          invoice_amount,
          invoice_date,
          deletion_date,
          deletion_reason,
          deleted_by
        ) VALUES (?, ?, ?, ?, ?, ?, NOW(), 'Manual deletion via system', 'System User')
      `;
      
      db.query(historyQuery, [
        invoiceToDelete.id,
        invoiceToDelete.invoice_number,
        invoiceToDelete.po_number,
        invoiceToDelete.customer_name,
        invoiceToDelete.total_amount,
        invoiceToDelete.invoice_date
      ], (err, historyResult) => {
        if (err) {
          console.error("Error creating deletion history (table might not exist):", err);
          // Continue with deletion even if history table doesn't exist
        } else {
          console.log('Deletion history recorded successfully');
        }
        
        // Delete related invoice items first
        const deleteItemsQuery = "DELETE FROM po_invoice_items WHERE po_invoice_id = ?";
        db.query(deleteItemsQuery, [id], (err, itemsResult) => {
          if (err) {
            console.error("Error deleting PO invoice items:", err);
            // Continue even if items deletion fails (table might not exist)
          }
          
          // Now delete the main PO invoice
          const deleteInvoiceQuery = "DELETE FROM po_invoices WHERE id = ?";
          db.query(deleteInvoiceQuery, [id], (err, deleteResult) => {
            if (err) {
              console.error("Error deleting PO invoice:", err);
              return db.rollback(() => {
                res.status(500).json({ 
                  message: "Failed to delete PO invoice", 
                  error: err.message 
                });
              });
            }
            
            if (deleteResult.affectedRows === 0) {
              return db.rollback(() => {
                res.status(404).json({ message: "PO invoice not found" });
              });
            }
            
            console.log('PO invoice deleted successfully');
            
            // Update PO summary to reflect the deletion
            // The trigger should handle this automatically, but let's ensure consistency
            const updateSummaryQuery = `
              INSERT INTO po_invoice_summary (
                po_number, 
                po_total_amount, 
                total_invoiced_amount, 
                remaining_amount, 
                invoice_count, 
                last_invoice_date
              )
              SELECT 
                ?,
                COALESCE(?, 0),
                COALESCE(SUM(pi.total_amount), 0),
                COALESCE(?, 0) - COALESCE(SUM(pi.total_amount), 0),
                COUNT(pi.id),
                MAX(pi.invoice_date)
              FROM po_invoices pi
              WHERE pi.po_number = ?
              ON DUPLICATE KEY UPDATE
                po_total_amount = COALESCE(VALUES(po_total_amount), po_total_amount),
                total_invoiced_amount = VALUES(total_invoiced_amount),
                remaining_amount = VALUES(remaining_amount),
                invoice_count = VALUES(invoice_count),
                last_invoice_date = VALUES(last_invoice_date),
                updated_at = CURRENT_TIMESTAMP
            `;
            
            db.query(updateSummaryQuery, [
              invoiceToDelete.po_number,
              invoiceToDelete.po_total_amount,
              invoiceToDelete.po_total_amount,
              invoiceToDelete.po_number
            ], (err, summaryResult) => {
              if (err) {
                console.error("Error updating PO summary after deletion:", err);
                // Don't fail the entire operation for summary update issues
              } else {
                console.log('PO summary updated after deletion');
              }
              
              // Commit the transaction
              db.commit((err) => {
                if (err) {
                  console.error("Error committing transaction:", err);
                  return db.rollback(() => {
                    res.status(500).json({ 
                      message: "Failed to commit deletion transaction", 
                      error: err.message 
                    });
                  });
                }
                
                console.log('PO invoice deletion completed successfully');
                
                // Return success response with deletion details
                res.json({
                  message: "PO invoice deleted successfully",
                  deletedInvoice: {
                    id: invoiceToDelete.id,
                    invoice_number: invoiceToDelete.invoice_number,
                    po_number: invoiceToDelete.po_number,
                    customer_name: invoiceToDelete.customer_name,
                    amount: invoiceToDelete.total_amount,
                    deletion_date: new Date().toISOString()
                  },
                  poUpdate: {
                    po_number: invoiceToDelete.po_number,
                    amount_restored: invoiceToDelete.total_amount,
                    message: `${invoiceToDelete.total_amount} has been restored to PO remaining amount`
                  }
                });
              });
            });
          });
        });
      });
    });
  });
});

// --- Start Server ---
const PORT = 5000;
app.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);
});