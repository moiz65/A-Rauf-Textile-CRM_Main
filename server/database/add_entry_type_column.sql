-- Migration: Add entry_type column to ledger_entries table
-- This column helps identify whether an entry is from an invoice, PO invoice, or payment
-- allowing more accurate duplicate prevention

ALTER TABLE ledger_entries ADD COLUMN entry_type ENUM('invoice', 'invoice_tax', 'po_invoice', 'po_invoice_tax', 'payment', 'payment_tax', 'manual') DEFAULT 'manual' AFTER bill_no;

-- Add index for faster lookups on entry_type and bill_no combination
ALTER TABLE ledger_entries ADD INDEX idx_bill_no_type (bill_no, entry_type);

-- Update existing entries to mark them as manual if not already categorized
UPDATE ledger_entries SET entry_type = 'manual' WHERE entry_type IS NULL;
