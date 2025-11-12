const express = require('express');
const router = express.Router();
const db = require('../src/config/db');

// Helper function to calculate balance
const calculateBalance = async (customerId, currentEntryId = null) => {
  try {
    let query = `
      SELECT COALESCE(SUM(debit_amount - credit_amount), 0) as balance 
      FROM ledger_entries 
      WHERE customer_id = ?
    `;
    const params = [customerId];
    
    if (currentEntryId) {
      query += ' AND entry_id < ?';
      params.push(currentEntryId);
    }
    
    const [result] = await db.query(query, params);
    const balance = Number(result[0].balance) || 0;
    return balance;
  } catch (error) {
    console.error('Error calculating balance:', error);
    return 0;
  }
};

// Helper function to get next sequence number
const getNextSequence = async (customerId, entryDate) => {
  try {
    const [result] = await db.query(
      `SELECT COALESCE(MAX(sequence), 0) + 1 as next_seq 
       FROM ledger_entries 
       WHERE customer_id = ? AND entry_date = ?`,
      [customerId, entryDate]
    );
    return result[0].next_seq;
  } catch (error) {
    console.error('Error getting next sequence:', error);
    return 1;
  }
};

// POST: Create new ledger entry for a customer
router.post('/customer/:customerId', async (req, res) => {
  const connection = await db.getConnection();
  
  try {
    await connection.beginTransaction();
    
    const { customerId } = req.params;
    const {
      entryDate,
      description,
      billNo,
      paymentMode,
      chequeNo,
      debitAmount,
      creditAmount,
      dueDate,
      status,
      salesTaxRate,
      salesTaxAmount,
      useLineItems,
      // Single material entry fields
      mtr,
      rate,
      // Multiple line items
      lineItems
    } = req.body;

    // Validate required fields
    if (!entryDate) {
      return res.status(400).json({ error: 'Entry date is required' });
    }

    if (!debitAmount && !creditAmount) {
      return res.status(400).json({ error: 'Either debit or credit amount is required' });
    }

    // Get the previous balance
    const previousBalance = await calculateBalance(customerId);
    
    // Calculate new balance - ensure all values are numbers
    const debit = Number(debitAmount) || 0;
    const credit = Number(creditAmount) || 0;
    const newBalance = Number(previousBalance) + Number(debit) - Number(credit);
    
    // Validate newBalance is a finite number
    if (!Number.isFinite(newBalance)) {
      console.error('[ledgerEntries] Invalid balance calculation:', { previousBalance, debit, credit, newBalance });
      return res.status(400).json({ error: 'Invalid balance calculation' });
    }

    // Get next sequence for this date
    const sequence = await getNextSequence(customerId, entryDate);
    const numSequence = Number(sequence) || 1;  // Ensure sequence is a number

    // Insert main ledger entry
    const [entryResult] = await connection.query(
      `INSERT INTO ledger_entries 
       (customer_id, entry_date, description, bill_no, payment_mode, cheque_no, 
        debit_amount, credit_amount, balance, status, due_date, has_multiple_items, 
        sales_tax_rate, sales_tax_amount, sequence)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        customerId,
        entryDate,
        description || null,
        billNo || null,
        paymentMode || 'Cash',
        chequeNo || null,
        debit,
        credit,
        Number(newBalance.toFixed(2)),  // Ensure rounded to 2 decimals
        status || 'pending',
        dueDate || null,
        useLineItems ? 1 : 0,
        Number(parseFloat(salesTaxRate) || 0),
        Number(parseFloat(salesTaxAmount) || 0),
        numSequence
      ]
    );

    const entryId = entryResult.insertId;

    // Handle line items or single material entry
    if (useLineItems && lineItems && lineItems.length > 0) {
      // Insert multiple line items
      for (let i = 0; i < lineItems.length; i++) {
        const item = lineItems[i];
        const itemAmount = (parseFloat(item.quantity) || 0) * (parseFloat(item.rate) || 0);
        const taxRate = parseFloat(item.taxRate) || 0;
        const totalWithTax = itemAmount * (1 + taxRate / 100);
        
        await connection.query(
          `INSERT INTO ledger_line_items 
           (entry_id, description, quantity, rate, tax_rate, amount, total_with_tax, item_type, line_sequence)
           VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`,
          [
            entryId,
            item.description || '',
            parseFloat(item.quantity) || 0,
            parseFloat(item.rate) || 0,
            taxRate,
            itemAmount,
            totalWithTax,
            item.type || 'material',
            i + 1
          ]
        );
      }
    } else if (!useLineItems && (mtr || rate)) {
      // Insert single material entry
      const singleAmount = (parseFloat(mtr) || 0) * (parseFloat(rate) || 0);
      const taxRate = parseFloat(salesTaxRate) || 0;
      const totalWithTax = singleAmount * (1 + taxRate / 100);
      
      await connection.query(
        `INSERT INTO ledger_single_materials 
         (entry_id, bill_no, quantity_mtr, rate, tax_rate, amount, total_with_tax)
         VALUES (?, ?, ?, ?, ?, ?, ?)`,
        [
          entryId,
          billNo || null,
          parseFloat(mtr) || 0,
          parseFloat(rate) || 0,
          taxRate,
          singleAmount,
          totalWithTax
        ]
      );
    }

    // If there's sales tax, create a separate tax entry
    if (salesTaxAmount && parseFloat(salesTaxAmount) > 0) {
      const taxSequence = numSequence + 0.5; // Tax entry comes after main entry
      const taxAmount = Number(salesTaxAmount) || 0;
      const taxBalance = Number(newBalance) + Number(taxAmount);
      
      // Validate tax balance
      if (!Number.isFinite(taxBalance)) {
        console.error('[ledgerEntries] Invalid tax balance calculation:', { newBalance, taxAmount, taxBalance });
        throw new Error('Invalid tax balance calculation');
      }
      
      await connection.query(
        `INSERT INTO ledger_entries 
         (customer_id, entry_date, description, bill_no, payment_mode, 
          debit_amount, credit_amount, balance, status, has_multiple_items, sequence)
         VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
        [
          customerId,
          entryDate,
          `Sales Tax (${salesTaxRate}%) - ${description || billNo || 'Entry'}`,
          billNo || null,
          paymentMode || 'Cash',
          Number(taxAmount),
          0,
          Number(taxBalance.toFixed(2)),
          status || 'pending',
          0,
          Number(taxSequence.toFixed(1))  // Ensure it's a proper decimal
        ]
      );
    }

    await connection.commit();

    // Fetch the created entry with all details
    const [createdEntry] = await connection.query(
      `SELECT * FROM vw_ledger_entries_complete WHERE entry_id = ?`,
      [entryId]
    );

    // Fetch line items if exists
    let items = [];
    if (useLineItems) {
      [items] = await connection.query(
        `SELECT * FROM ledger_line_items WHERE entry_id = ? ORDER BY line_sequence`,
        [entryId]
      );
    }

    res.status(201).json({
      success: true,
      message: 'Ledger entry created successfully',
      data: {
        entry: createdEntry[0],
        lineItems: items
      }
    });

  } catch (error) {
    await connection.rollback();
    console.error('Error creating ledger entry:', error);
    res.status(500).json({ 
      error: 'Failed to create ledger entry',
      details: error.message 
    });
  } finally {
    connection.release();
  }
});

// GET: Fetch all ledger entries for a customer
router.get('/customer/:customerId', async (req, res) => {
  try {
    const { customerId } = req.params;
    const { fromDate, toDate, status } = req.query;

    let query = `
      SELECT * FROM vw_ledger_entries_complete 
      WHERE customer_id = ?
    `;
    const params = [customerId];

    if (fromDate) {
      query += ' AND entry_date >= ?';
      params.push(fromDate);
    }

    if (toDate) {
      query += ' AND entry_date <= ?';
      params.push(toDate);
    }

    if (status) {
      query += ' AND status = ?';
      params.push(status);
    }

    query += ' ORDER BY entry_date DESC, sequence ASC';

    const [entries] = await db.query(query, params);

    // Fetch line items for entries that have them
    const entriesWithItems = await Promise.all(
      entries.map(async (entry) => {
        if (entry.has_multiple_items) {
          const [items] = await db.query(
            `SELECT * FROM ledger_line_items WHERE entry_id = ? ORDER BY line_sequence`,
            [entry.entry_id]
          );
          return { ...entry, lineItems: items };
        }
        return entry;
      })
    );

    // Calculate summary
    const summary = {
      totalDebit: entries.reduce((sum, e) => sum + parseFloat(e.debit_amount || 0), 0),
      totalCredit: entries.reduce((sum, e) => sum + parseFloat(e.credit_amount || 0), 0),
      currentBalance: entries.length > 0 ? parseFloat(entries[0].balance || 0) : 0,
      totalEntries: entries.length
    };

    res.json({
      success: true,
      data: {
        entries: entriesWithItems,
        summary
      }
    });

  } catch (error) {
    console.error('Error fetching ledger entries:', error);
    res.status(500).json({ 
      error: 'Failed to fetch ledger entries',
      details: error.message 
    });
  }
});

// GET: Fetch single ledger entry by ID
router.get('/entry/:entryId', async (req, res) => {
  try {
    const { entryId } = req.params;

    const [entries] = await db.query(
      `SELECT * FROM vw_ledger_entries_complete WHERE entry_id = ?`,
      [entryId]
    );

    if (entries.length === 0) {
      return res.status(404).json({ error: 'Ledger entry not found' });
    }

    const entry = entries[0];

    // Fetch line items if exists
    if (entry.has_multiple_items) {
      const [items] = await db.query(
        `SELECT * FROM ledger_line_items WHERE entry_id = ? ORDER BY line_sequence`,
        [entryId]
      );
      entry.lineItems = items;
    }

    res.json({
      success: true,
      data: entry
    });

  } catch (error) {
    console.error('Error fetching ledger entry:', error);
    res.status(500).json({ 
      error: 'Failed to fetch ledger entry',
      details: error.message 
    });
  }
});

// PUT: Update ledger entry
router.put('/entry/:entryId', async (req, res) => {
  const connection = await db.getConnection();
  
  try {
    await connection.beginTransaction();
    
    const { entryId } = req.params;
    const {
      description,
      status,
      dueDate,
      paymentMode,
      chequeNo
    } = req.body;

    // Update main entry
    await connection.query(
      `UPDATE ledger_entries 
       SET description = ?, status = ?, due_date = ?, payment_mode = ?, cheque_no = ?
       WHERE entry_id = ?`,
      [
        description,
        status,
        dueDate || null,
        paymentMode,
        chequeNo || null,
        entryId
      ]
    );

    await connection.commit();

    // Fetch updated entry
    const [updatedEntry] = await connection.query(
      `SELECT * FROM vw_ledger_entries_complete WHERE entry_id = ?`,
      [entryId]
    );

    res.json({
      success: true,
      message: 'Ledger entry updated successfully',
      data: updatedEntry[0]
    });

  } catch (error) {
    await connection.rollback();
    console.error('Error updating ledger entry:', error);
    res.status(500).json({ 
      error: 'Failed to update ledger entry',
      details: error.message 
    });
  } finally {
    connection.release();
  }
});

// DELETE: Delete ledger entry
router.delete('/entry/:entryId', async (req, res) => {
  const connection = await db.getConnection();
  
  try {
    await connection.beginTransaction();
    
    const { entryId } = req.params;

    // Get entry details before deletion
    const [entries] = await connection.query(
      `SELECT customer_id, entry_date FROM ledger_entries WHERE entry_id = ?`,
      [entryId]
    );

    if (entries.length === 0) {
      return res.status(404).json({ error: 'Ledger entry not found' });
    }

    const { customer_id, entry_date } = entries[0];

    // Delete entry (cascades to line_items and single_materials)
    await connection.query(
      `DELETE FROM ledger_entries WHERE entry_id = ?`,
      [entryId]
    );

    // Recalculate balances for subsequent entries
    await connection.query(
      `UPDATE ledger_entries e1
       SET balance = (
         SELECT COALESCE(SUM(e2.debit_amount - e2.credit_amount), 0)
         FROM ledger_entries e2
         WHERE e2.customer_id = e1.customer_id
         AND (e2.entry_date < e1.entry_date OR (e2.entry_date = e1.entry_date AND e2.entry_id <= e1.entry_id))
       )
       WHERE customer_id = ? AND (entry_date > ? OR (entry_date = ? AND entry_id > ?))`,
      [customer_id, entry_date, entry_date, entryId]
    );

    await connection.commit();

    res.json({
      success: true,
      message: 'Ledger entry deleted successfully'
    });

  } catch (error) {
    await connection.rollback();
    console.error('Error deleting ledger entry:', error);
    res.status(500).json({ 
      error: 'Failed to delete ledger entry',
      details: error.message 
    });
  } finally {
    connection.release();
  }
});

module.exports = router;
