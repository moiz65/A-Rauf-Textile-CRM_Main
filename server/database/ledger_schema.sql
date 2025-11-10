-- General Ledger Entries Table
CREATE TABLE IF NOT EXISTS ledger_entries (
    entry_id INT AUTO_INCREMENT PRIMARY KEY,
    customer_id INT NOT NULL,
    entry_date DATE NOT NULL,
    description TEXT,
    bill_no VARCHAR(100),
    payment_mode ENUM('Cash', 'Online', 'Cheque') DEFAULT 'Cash',
    cheque_no VARCHAR(5),
    debit_amount DECIMAL(15, 2) DEFAULT 0.00,
    credit_amount DECIMAL(15, 2) DEFAULT 0.00,
    balance DECIMAL(15, 2) DEFAULT 0.00,
    status ENUM('draft', 'pending', 'paid', 'overdue') DEFAULT 'pending',
    due_date DATE,
    has_multiple_items BOOLEAN DEFAULT FALSE,
    sales_tax_rate DECIMAL(5, 2) DEFAULT 0.00,
    sales_tax_amount DECIMAL(15, 2) DEFAULT 0.00,
    sequence INT DEFAULT 0,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (customer_id) REFERENCES customertable(customer_id) ON DELETE CASCADE,
    INDEX idx_customer_date (customer_id, entry_date),
    INDEX idx_entry_date (entry_date),
    INDEX idx_status (status)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Ledger Line Items Table (for multiple material entries)
CREATE TABLE IF NOT EXISTS ledger_line_items (
    line_item_id INT AUTO_INCREMENT PRIMARY KEY,
    entry_id INT NOT NULL,
    description VARCHAR(500) NOT NULL,
    quantity DECIMAL(10, 2) DEFAULT 0.00,
    rate DECIMAL(15, 2) DEFAULT 0.00,
    tax_rate DECIMAL(5, 2) DEFAULT 0.00,
    amount DECIMAL(15, 2) DEFAULT 0.00,
    total_with_tax DECIMAL(15, 2) DEFAULT 0.00,
    item_type ENUM('material', 'service', 'other') DEFAULT 'material',
    line_sequence INT DEFAULT 0,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (entry_id) REFERENCES ledger_entries(entry_id) ON DELETE CASCADE,
    INDEX idx_entry_id (entry_id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Single Material Entries Table (for backward compatibility and single entries)
CREATE TABLE IF NOT EXISTS ledger_single_materials (
    material_id INT AUTO_INCREMENT PRIMARY KEY,
    entry_id INT NOT NULL,
    bill_no VARCHAR(100),
    quantity_mtr DECIMAL(10, 2) DEFAULT 0.00,
    rate DECIMAL(15, 2) DEFAULT 0.00,
    tax_rate DECIMAL(5, 2) DEFAULT 0.00,
    amount DECIMAL(15, 2) DEFAULT 0.00,
    total_with_tax DECIMAL(15, 2) DEFAULT 0.00,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (entry_id) REFERENCES ledger_entries(entry_id) ON DELETE CASCADE,
    INDEX idx_entry_id (entry_id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Trigger to update balance after insert
-- NOTE: Disabled because backend calculates balance before insert
-- and MySQL doesn't allow triggers to update the same table being inserted
-- DELIMITER $$
-- 
-- CREATE TRIGGER after_ledger_entry_insert
-- AFTER INSERT ON ledger_entries
-- FOR EACH ROW
-- BEGIN
--     DECLARE prev_balance DECIMAL(15, 2);
--     
--     -- Get the previous balance for this customer
--     SELECT COALESCE(balance, 0) INTO prev_balance
--     FROM ledger_entries
--     WHERE customer_id = NEW.customer_id 
--     AND entry_id < NEW.entry_id
--     ORDER BY entry_date DESC, entry_id DESC
--     LIMIT 1;
--     
--     -- Update the new entry's balance
--     UPDATE ledger_entries
--     SET balance = prev_balance + NEW.debit_amount - NEW.credit_amount
--     WHERE entry_id = NEW.entry_id;
-- END$$
-- 
-- DELIMITER ;

-- View for complete ledger entries with line items
CREATE OR REPLACE VIEW vw_ledger_entries_complete AS
SELECT 
    le.entry_id,
    le.customer_id,
    c.customer AS customer_name,
    le.entry_date,
    le.description,
    le.bill_no,
    le.payment_mode,
    le.cheque_no,
    le.debit_amount,
    le.credit_amount,
    le.balance,
    le.status,
    le.due_date,
    le.has_multiple_items,
    le.sales_tax_rate,
    le.sales_tax_amount,
    le.sequence,
    le.created_at,
    le.updated_at,
    -- Single material data
    sm.quantity_mtr,
    sm.rate AS single_rate,
    sm.amount AS single_amount,
    sm.total_with_tax AS single_total_with_tax,
    -- Count of line items
    (SELECT COUNT(*) FROM ledger_line_items WHERE entry_id = le.entry_id) as line_items_count,
    -- Total from line items
    (SELECT SUM(amount) FROM ledger_line_items WHERE entry_id = le.entry_id) as line_items_total,
    -- Total with tax from line items
    (SELECT SUM(total_with_tax) FROM ledger_line_items WHERE entry_id = le.entry_id) as line_items_total_with_tax
FROM ledger_entries le
LEFT JOIN customertable c ON le.customer_id = c.customer_id
LEFT JOIN ledger_single_materials sm ON le.entry_id = sm.entry_id;
