-- Financial Year Management Tables

-- Financial Years Table (stores financial year periods for each customer)
CREATE TABLE IF NOT EXISTS ledger_financial_years (
    fy_id INT AUTO_INCREMENT PRIMARY KEY,
    customer_id INT NOT NULL,
    fy_name VARCHAR(100) NOT NULL,
    start_date DATE NOT NULL,
    end_date DATE NOT NULL,
    opening_debit DECIMAL(15, 2) DEFAULT 0.00,
    opening_credit DECIMAL(15, 2) DEFAULT 0.00,
    opening_balance DECIMAL(15, 2) DEFAULT 0.00,
    closing_debit DECIMAL(15, 2) DEFAULT 0.00,
    closing_credit DECIMAL(15, 2) DEFAULT 0.00,
    closing_balance DECIMAL(15, 2) DEFAULT 0.00,
    status ENUM('open', 'closed', 'archived') DEFAULT 'open',
    notes TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (customer_id) REFERENCES customertable(customer_id) ON DELETE CASCADE,
    INDEX idx_customer_fy (customer_id, start_date),
    INDEX idx_status (status),
    UNIQUE KEY unique_fy_period (customer_id, start_date, end_date)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Financial Year Entries Link Table (to track which entries belong to which FY)
CREATE TABLE IF NOT EXISTS ledger_entry_fy_mapping (
    mapping_id INT AUTO_INCREMENT PRIMARY KEY,
    entry_id INT NOT NULL,
    fy_id INT NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (entry_id) REFERENCES ledger_entries(entry_id) ON DELETE CASCADE,
    FOREIGN KEY (fy_id) REFERENCES ledger_financial_years(fy_id) ON DELETE CASCADE,
    UNIQUE KEY unique_entry_fy (entry_id, fy_id),
    INDEX idx_fy_id (fy_id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Closing Balance History (for archival and reference)
CREATE TABLE IF NOT EXISTS ledger_fy_closing_balance (
    closing_id INT AUTO_INCREMENT PRIMARY KEY,
    fy_id INT NOT NULL,
    customer_id INT NOT NULL,
    closing_date DATE NOT NULL,
    closing_debit DECIMAL(15, 2) DEFAULT 0.00,
    closing_credit DECIMAL(15, 2) DEFAULT 0.00,
    closing_balance DECIMAL(15, 2) DEFAULT 0.00,
    pdf_file_path VARCHAR(500),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (fy_id) REFERENCES ledger_financial_years(fy_id) ON DELETE CASCADE,
    FOREIGN KEY (customer_id) REFERENCES customertable(customer_id) ON DELETE CASCADE,
    INDEX idx_customer_fy (customer_id, fy_id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- View for Financial Year Summary
CREATE OR REPLACE VIEW vw_financial_year_summary AS
SELECT 
    lfy.fy_id,
    lfy.customer_id,
    c.customer AS customer_name,
    lfy.fy_name,
    lfy.start_date,
    lfy.end_date,
    lfy.opening_debit,
    lfy.opening_credit,
    lfy.opening_balance,
    lfy.closing_debit,
    lfy.closing_credit,
    lfy.closing_balance,
    lfy.status,
    lfy.notes,
    -- Count of entries in this FY
    (SELECT COUNT(*) FROM ledger_entry_fy_mapping WHERE fy_id = lfy.fy_id) as entry_count,
    -- Total debit in this FY
    (SELECT COALESCE(SUM(debit_amount), 0) FROM ledger_entries le 
     INNER JOIN ledger_entry_fy_mapping lfm ON le.entry_id = lfm.entry_id 
     WHERE lfm.fy_id = lfy.fy_id AND le.entry_date BETWEEN lfy.start_date AND lfy.end_date) as total_debit,
    -- Total credit in this FY
    (SELECT COALESCE(SUM(credit_amount), 0) FROM ledger_entries le 
     INNER JOIN ledger_entry_fy_mapping lfm ON le.entry_id = lfm.entry_id 
     WHERE lfm.fy_id = lfy.fy_id AND le.entry_date BETWEEN lfy.start_date AND lfy.end_date) as total_credit,
    lfy.created_at,
    lfy.updated_at
FROM ledger_financial_years lfy
LEFT JOIN customertable c ON lfy.customer_id = c.customer_id;
