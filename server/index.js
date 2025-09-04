// --- Required Modules ---
const express = require("express");
const cors = require("cors");
const path = require("path");

// --- Initialize Express App ---
const app = express();
app.use(cors());
app.use(express.json());

// --- MySQL Database Connection ---
const db = require("./src/config/db");

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

// --- InvoiceTable Routes ---

// // Get all invoices
// app.get("/api/v1/invoiceTable", (req, res) => {
//   db.query("SELECT * FROM invoiceTable", (err, results) => {
//     if (err) {
//       console.error("Error fetching invoices:", err.message);
//       return res.status(500).json({ message: "Failed to fetch invoices", error: err.message });
//     }
//     res.json(results);
//   });
// });

// // Create a new invoice
// app.post("/api/v1/invoiceTable", (req, res) => {
//   const { invoice_id, date, customer, amount, status, items, due_date } = req.body;

//   // Validate required fields
//   if (!invoice_id || !date || !customer || !amount || !status) {
//     return res.status(400).json({ message: "Missing required fields" });
//   }

//   const query = `
//     INSERT INTO invoiceTable (invoice_id, date, customer, amount, status, items, due_date)
//     VALUES (?, ?, ?, ?, ?, ?, ?)
//   `;
//   const values = [invoice_id, date, customer, amount, status, JSON.stringify(items), due_date];

//   db.query(query, values, (err, result) => {
//     if (err) {
//       console.error("Error creating invoice:", err.message);
//       return res.status(500).json({ message: "Failed to create invoice", error: err.message });
//     }
//     res.status(201).json({ message: "Invoice created successfully", insertId: result.insertId });
//   });
// });

// // Get a single invoice by ID
// app.get("/api/v1/invoiceTable/:id", (req, res) => {
//   const invoiceId = req.params.id;

//   const query = "SELECT * FROM invoiceTable WHERE invoice_id = ?";
  
//   db.query(query, [invoiceId], (err, results) => {
//     if (err) {
//       console.error("Error fetching invoice:", err.message);
//       return res.status(500).json({ message: "Failed to fetch invoice", error: err.message });
//     }
//     if (results.length === 0) {
//       return res.status(404).json({ message: "Invoice not found" });
//     }
    
//     // Parse items JSON string back to object
//     const invoice = results[0];
//     if (invoice.items) {
//       try {
//         invoice.items = JSON.parse(invoice.items);
//       } catch (e) {
//         console.error("Error parsing items JSON:", e.message);
//         invoice.items = [];
//       }
//     }
    
//     res.json(invoice);
//   });
// });

// // Update an invoice
// app.put("/api/v1/invoiceTable/:id", (req, res) => {
//   const invoiceId = req.params.id;
//   const { date, customer, amount, status, items, due_date } = req.body;

//   // Validate required fields
//   if (!date || !customer || !amount || !status) {
//     return res.status(400).json({ message: "Missing required fields" });
//   }

//   const query = `
//     UPDATE invoiceTable 
//     SET date = ?, customer = ?, amount = ?, status = ?, items = ?, due_date = ?
//     WHERE invoice_id = ?
//   `;
//   const values = [date, customer, amount, status, JSON.stringify(items), due_date, invoiceId];

//   db.query(query, values, (err, result) => {
//     if (err) {
//       console.error("Error updating invoice:", err.message);
//       return res.status(500).json({ message: "Failed to update invoice", error: err.message });
//     }
//     if (result.affectedRows === 0) return res.status(404).json({ message: "Invoice not found" });
//     res.json({ message: "Invoice updated successfully" });
//   });
// });

// // Delete an invoice
// app.delete("/api/v1/invoiceTable/:id", (req, res) => {
//   const invoiceId = req.params.id;

//   const query = "DELETE FROM invoiceTable WHERE invoice_id = ?";
//   db.query(query, [invoiceId], (err, result) => {
//     if (err) {
//       console.error("Error deleting invoice:", err.message);
//       return res.status(500).json({ message: "Failed to delete invoice", error: err.message });
//     }
//     if (result.affectedRows === 0) return res.status(404).json({ message: "Invoice not found" });
//     res.json({ message: "Invoice deleted successfully" });
//   });
// });

// // Get invoices with filtering and pagination
// app.get("/api/v1/invoiceTable/filter", (req, res) => {
//   const { page = 1, limit = 10, status, search, startDate, endDate } = req.query;
//   const offset = (page - 1) * limit;

//   let query = "SELECT * FROM invoiceTable WHERE 1=1";
//   let countQuery = "SELECT COUNT(*) as total FROM invoiceTable WHERE 1=1";
//   let queryParams = [];
//   let countParams = [];

//   // Add status filter
//   if (status && status !== 'All') {
//     query += " AND status = ?";
//     countQuery += " AND status = ?";
//     queryParams.push(status);
//     countParams.push(status);
//   }

//   // Add search filter
//   if (search) {
//     const searchParam = `%${search}%`;
//     query += " AND (customer LIKE ? OR invoice_id LIKE ?)";
//     countQuery += " AND (customer LIKE ? OR invoice_id LIKE ?)";
//     queryParams.push(searchParam, searchParam);
//     countParams.push(searchParam, searchParam);
//   }

//   // Add date range filter
//   if (startDate) {
//     query += " AND date >= ?";
//     countQuery += " AND date >= ?";
//     queryParams.push(startDate);
//     countParams.push(startDate);
//   }
  
//   if (endDate) {
//     query += " AND date <= ?";
//     countQuery += " AND date <= ?";
//     queryParams.push(endDate);
//     countParams.push(endDate);
//   }

//   // Add pagination
//   query += " ORDER BY date DESC LIMIT ? OFFSET ?";
//   queryParams.push(parseInt(limit), parseInt(offset));

//   // First get total count
//   db.query(countQuery, countParams, (err, countResult) => {
//     if (err) {
//       console.error("Error counting invoices:", err.message);
//       return res.status(500).json({ message: "Failed to fetch invoices", error: err.message });
//     }

//     // Then get paginated data
//     db.query(query, queryParams, (err, results) => {
//       if (err) {
//         console.error("Error fetching invoices:", err.message);
//         return res.status(500).json({ message: "Failed to fetch invoices", error: err.message });
//       }

//       // Parse items JSON for each invoice
//       results.forEach(invoice => {
//         if (invoice.items) {
//           try {
//             invoice.items = JSON.parse(invoice.items);
//           } catch (e) {
//             console.error("Error parsing items JSON:", e.message);
//             invoice.items = [];
//           }
//         }
//       });

//       res.json({
//         invoices: results,
//         total: countResult[0].total,
//         page: parseInt(page),
//         totalPages: Math.ceil(countResult[0].total / limit)
//       });
//     });
//   });
// });

// // Get invoice statistics
// app.get("/api/v1/invoiceTable/stats", (req, res) => {
//   const queries = [
//     "SELECT COUNT(*) as total FROM invoiceTable",
//     "SELECT COUNT(*) as paid FROM invoiceTable WHERE status = 'Paid'",
//     "SELECT COUNT(*) as pending FROM invoiceTable WHERE status = 'Pending'",
//     "SELECT COUNT(*) as overdue FROM invoiceTable WHERE status = 'Overdue'",
//     "SELECT SUM(amount) as total_revenue FROM invoiceTable WHERE status = 'Paid'",
//     "SELECT SUM(amount) as pending_amount FROM invoiceTable WHERE status = 'Pending'",
//     "SELECT SUM(amount) as overdue_amount FROM invoiceTable WHERE status = 'Overdue'"
//   ];

//   db.query(queries.join(';'), (err, results) => {
//     if (err) {
//       console.error("Error fetching invoice stats:", err.message);
//       return res.status(500).json({ message: "Failed to fetch invoice statistics", error: err.message });
//     }

//     res.json({
//       total: results[0][0].total,
//       paid: results[1][0].paid,
//       pending: results[2][0].pending,
//       overdue: results[3][0].overdue,
//       totalRevenue: results[4][0].total_revenue || 0,
//       pendingAmount: results[5][0].pending_amount || 0,
//       overdueAmount: results[6][0].overdue_amount || 0
//     });
//   });
// });

// // Bulk delete invoices
// app.post("/api/v1/invoiceTable/bulk-delete", (req, res) => {
//   const { ids } = req.body;

//   if (!ids || !Array.isArray(ids) || ids.length === 0) {
//     return res.status(400).json({ message: "No invoice IDs provided" });
//   }

//   const query = "DELETE FROM invoiceTable WHERE invoice_id IN (?)";
  
//   db.query(query, [ids], (err, result) => {
//     if (err) {
//       console.error("Error deleting invoices:", err.message);
//       return res.status(500).json({ message: "Failed to delete invoices", error: err.message });
//     }
//     res.json({ 
//       message: `${result.affectedRows} invoices deleted successfully` 
//     });
//   });
// });

// // Update invoice status
// app.put("/api/v1/invoiceTable/:id/status", (req, res) => {
//   const invoiceId = req.params.id;
//   const { status } = req.body;

//   if (!status) {
//     return res.status(400).json({ message: "Status is required" });
//   }

//   const query = "UPDATE invoiceTable SET status = ? WHERE invoice_id = ?";
//   const values = [status, invoiceId];

//   db.query(query, values, (err, result) => {
//     if (err) {
//       console.error("Error updating invoice status:", err.message);
//       return res.status(500).json({ message: "Failed to update invoice status", error: err.message });
//     }
//     if (result.affectedRows === 0) {
//       return res.status(404).json({ message: "Invoice not found" });
//     }
//     res.json({ message: "Invoice status updated successfully" });
//   });
// });

// // Error handling middleware
// app.use((err, req, res, next) => {
//   console.error(err.stack);
//   res.status(500).json({ message: 'Something went wrong!', error: err.message });
// });

// // 404 handler
// app.use((req, res) => {
//   res.status(404).json({ message: 'Route not found' });
// });


// --- Invoice Routes (using `invoice` table) ---

// Get all invoices
app.get("/api/v1/invoices", (req, res) => {
  db.query("SELECT * FROM invoice", (err, results) => {
    if (err) {
      console.error("Error fetching invoices:", err.message);
      return res.status(500).json({ message: "Failed to fetch invoices", error: err.message });
    }
    res.json(results);
  });
});

// Create a new invoice
app.post("/api/v1/invoices", (req, res) => {
  const { invoice_id, date, customer, amount, status, items, due_date } = req.body;

  if (!invoice_id || !date || !customer || !amount || !status) {
    return res.status(400).json({ message: "Missing required fields" });
  }

  const query = `
    INSERT INTO invoice (invoice_id, date, customer, amount, status, items, due_date)
    VALUES (?, ?, ?, ?, ?, ?, ?)
  `;
  const values = [invoice_id, date, customer, amount, status, JSON.stringify(items), due_date];

  db.query(query, values, (err, result) => {
    if (err) {
      console.error("Error creating invoice:", err.message);
      return res.status(500).json({ message: "Failed to create invoice", error: err.message });
    }
    res.status(201).json({ message: "Invoice created successfully", insertId: result.insertId });
  });
});

// Get single invoice by ID
app.get("/api/v1/invoices/:id", (req, res) => {
  const invoiceId = req.params.id;

  const query = "SELECT * FROM invoice WHERE invoice_id = ?";

  db.query(query, [invoiceId], (err, results) => {
    if (err) {
      console.error("Error fetching invoice:", err.message);
      return res.status(500).json({ message: "Failed to fetch invoice", error: err.message });
    }
    if (results.length === 0) {
      return res.status(404).json({ message: "Invoice not found" });
    }

    const invoice = results[0];
    if (invoice.items) {
      try {
        invoice.items = JSON.parse(invoice.items);
      } catch {
        invoice.items = [];
      }
    }

    res.json(invoice);
  });
});

// Update an invoice
app.put("/api/v1/invoices/:id", (req, res) => {
  const invoiceId = req.params.id;
  const { date, customer, amount, status, items, due_date } = req.body;

  if (!date || !customer || !amount || !status) {
    return res.status(400).json({ message: "Missing required fields" });
  }

  const query = `
    UPDATE invoice
    SET date = ?, customer = ?, amount = ?, status = ?, items = ?, due_date = ?
    WHERE invoice_id = ?
  `;
  const values = [date, customer, amount, status, JSON.stringify(items), due_date, invoiceId];

  db.query(query, values, (err, result) => {
    if (err) {
      console.error("Error updating invoice:", err.message);
      return res.status(500).json({ message: "Failed to update invoice", error: err.message });
    }
    if (result.affectedRows === 0) return res.status(404).json({ message: "Invoice not found" });
    res.json({ message: "Invoice updated successfully" });
  });
});

// Delete an invoice
app.delete("/api/v1/invoices/:id", (req, res) => {
  const invoiceId = req.params.id;

  const query = "DELETE FROM invoice WHERE invoice_id = ?";
  db.query(query, [invoiceId], (err, result) => {
    if (err) {
      console.error("Error deleting invoice:", err.message);
      return res.status(500).json({ message: "Failed to delete invoice", error: err.message });
    }
    if (result.affectedRows === 0) return res.status(404).json({ message: "Invoice not found" });
    res.json({ message: "Invoice deleted successfully" });
  });
});

// Filtering + Pagination
app.get("/api/v1/invoices/filter", (req, res) => {
  const { page = 1, limit = 10, status, search, startDate, endDate } = req.query;
  const offset = (page - 1) * limit;

  let query = "SELECT * FROM invoice WHERE 1=1";
  let countQuery = "SELECT COUNT(*) as total FROM invoice WHERE 1=1";
  let params = [];
  let countParams = [];

  if (status && status !== "All") {
    query += " AND status = ?";
    countQuery += " AND status = ?";
    params.push(status);
    countParams.push(status);
  }

  if (search) {
    const s = `%${search}%`;
    query += " AND (customer LIKE ? OR invoice_id LIKE ?)";
    countQuery += " AND (customer LIKE ? OR invoice_id LIKE ?)";
    params.push(s, s);
    countParams.push(s, s);
  }

  if (startDate) {
    query += " AND date >= ?";
    countQuery += " AND date >= ?";
    params.push(startDate);
    countParams.push(startDate);
  }

  if (endDate) {
    query += " AND date <= ?";
    countQuery += " AND date <= ?";
    params.push(endDate);
    countParams.push(endDate);
  }

  query += " ORDER BY date DESC LIMIT ? OFFSET ?";
  params.push(parseInt(limit), parseInt(offset));

  db.query(countQuery, countParams, (err, countResult) => {
    if (err) {
      console.error("Error counting invoices:", err.message);
      return res.status(500).json({ message: "Failed to fetch invoices", error: err.message });
    }

    db.query(query, params, (err, results) => {
      if (err) {
        console.error("Error fetching invoices:", err.message);
        return res.status(500).json({ message: "Failed to fetch invoices", error: err.message });
      }

      results.forEach((inv) => {
        if (inv.items) {
          try {
            inv.items = JSON.parse(inv.items);
          } catch {
            inv.items = [];
          }
        }
      });

      res.json({
        invoices: results,
        total: countResult[0].total,
        page: parseInt(page),
        totalPages: Math.ceil(countResult[0].total / limit),
      });
    });
  });
});

// Invoice statistics
app.get("/api/v1/invoices/stats", (req, res) => {
  const queries = [
    "SELECT COUNT(*) as total FROM invoice",
    "SELECT COUNT(*) as paid FROM invoice WHERE status = 'Paid'",
    "SELECT COUNT(*) as pending FROM invoice WHERE status = 'Pending'",
    "SELECT COUNT(*) as overdue FROM invoice WHERE status = 'Overdue'",
    "SELECT SUM(amount) as total_revenue FROM invoice WHERE status = 'Paid'",
    "SELECT SUM(amount) as pending_amount FROM invoice WHERE status = 'Pending'",
    "SELECT SUM(amount) as overdue_amount FROM invoice WHERE status = 'Overdue'"
  ];

  db.query(queries.join(";"), (err, results) => {
    if (err) {
      console.error("Error fetching stats:", err.message);
      return res.status(500).json({ message: "Failed to fetch invoice stats", error: err.message });
    }

    res.json({
      total: results[0][0].total,
      paid: results[1][0].paid,
      pending: results[2][0].pending,
      overdue: results[3][0].overdue,
      totalRevenue: results[4][0].total_revenue || 0,
      pendingAmount: results[5][0].pending_amount || 0,
      overdueAmount: results[6][0].overdue_amount || 0,
    });
  });
});

// Bulk delete
app.post("/api/v1/invoices/bulk-delete", (req, res) => {
  const { ids } = req.body;

  if (!ids || !Array.isArray(ids) || ids.length === 0) {
    return res.status(400).json({ message: "No invoice IDs provided" });
  }

  const query = "DELETE FROM invoice WHERE invoice_id IN (?)";

  db.query(query, [ids], (err, result) => {
    if (err) {
      console.error("Error deleting invoices:", err.message);
      return res.status(500).json({ message: "Failed to delete invoices", error: err.message });
    }
    res.json({ message: `${result.affectedRows} invoices deleted successfully` });
  });
});

// Update status
app.put("/api/v1/invoices/:id/status", (req, res) => {
  const invoiceId = req.params.id;
  const { status } = req.body;

  if (!status) {
    return res.status(400).json({ message: "Status is required" });
  }

  const query = "UPDATE invoice SET status = ? WHERE invoice_id = ?";

  db.query(query, [status, invoiceId], (err, result) => {
    if (err) {
      console.error("Error updating status:", err.message);
      return res.status(500).json({ message: "Failed to update invoice status", error: err.message });
    }
    if (result.affectedRows === 0) {
      return res.status(404).json({ message: "Invoice not found" });
    }
    res.json({ message: "Invoice status updated successfully" });
  });
});


// Get all customers
app.get("/api/v1/customertable", (req, res) => {
  db.query("SELECT * FROM customertable", (err, results) => {
    if (err) return res.status(500).json({ message: "Failed to fetch customers", error: err.message });
    res.json(results);
  });
});

// Create a new customer
app.post("/api/v1/customertable", (req, res) => {
  const { name, date, phoneNumber, price, category, address, email, startDate } = req.body;

  if (!name || !date || !phoneNumber || !price) {
    return res.status(400).json({ message: "Missing required fields" });
  }

  const query = `
    INSERT INTO customertable (customer, date, phone, price, category, address, email, start_date)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?)
  `;
  const values = [name, date, phoneNumber, price, category, address, email, startDate];

  db.query(query, values, (err, result) => {
    if (err) return res.status(500).json({ message: "Failed to create customer", error: err.message });
    res.status(201).json({ id: result.insertId, ...req.body });
  });
});

// Update customer
app.put("/api/v1/customertable/:id", (req, res) => {
  const { id } = req.params;
  const { name, date, phoneNumber, price, category, address, email, startDate } = req.body;

  const query = `
    UPDATE customertable
    SET customer = ?, date = ?, phone = ?, price = ?, category = ?, address = ?, email = ?, start_date = ?
    WHERE customer_id = ?
  `;
  const values = [name, date, phoneNumber, price, category, address, email, startDate, id];

  db.query(query, values, (err, result) => {
    if (err) return res.status(500).json({ message: "Failed to update customer", error: err.message });
    if (result.affectedRows === 0) return res.status(404).json({ message: "Customer not found" });
    res.json({ id, ...req.body });
  });
});

// Delete customer
app.delete("/api/v1/customertable/:id", (req, res) => {
  const { id } = req.params;
  db.query("DELETE FROM customertable WHERE customer_id = ?", [id], (err, result) => {
    if (err) return res.status(500).json({ message: "Failed to delete customer", error: err.message });
    if (result.affectedRows === 0) return res.status(404).json({ message: "Customer not found" });
    res.json({ success: true });
  });
});

// --- Start Server ---
const PORT = 5000;
app.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);
});