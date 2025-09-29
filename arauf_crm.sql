-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Host: 127.0.0.1
-- Generation Time: Sep 29, 2025 at 08:21 PM
-- Server version: 10.4.32-MariaDB
-- PHP Version: 8.0.30

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Database: `arauf_crm`
--

-- --------------------------------------------------------

--
-- Table structure for table `categories`
--

CREATE TABLE `categories` (
  `id` int(11) NOT NULL,
  `name` varchar(255) NOT NULL,
  `description` text DEFAULT NULL,
  `type` enum('All','Expense','Income','Asset','Liability') NOT NULL DEFAULT 'Expense',
  `status` enum('Active','Inactive') NOT NULL DEFAULT 'Active',
  `created_date` date NOT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `categories`
--

INSERT INTO `categories` (`id`, `name`, `description`, `type`, `status`, `created_date`, `created_at`, `updated_at`) VALUES
(1, 'New Category', 'kkk', 'Expense', 'Active', '2025-09-26', '2025-09-26 16:06:21', '2025-09-26 16:06:21'),
(2, 'gfbgf', 'bgfbgfgfb', 'Expense', 'Active', '2025-09-26', '2025-09-26 16:06:39', '2025-09-26 16:06:39'),
(3, 'new', 'cdd', 'Income', 'Active', '2025-09-27', '2025-09-26 19:06:03', '2025-09-26 19:06:03'),
(4, 'All', 'All category types', 'All', 'Active', '2025-09-27', '2025-09-26 19:24:25', '2025-09-26 19:24:25'),
(5, 'Expense', 'Expense categories', 'Expense', 'Active', '2025-09-27', '2025-09-26 19:24:25', '2025-09-26 19:24:25'),
(6, 'Income', 'Income categories', 'Income', 'Active', '2025-09-27', '2025-09-26 19:24:25', '2025-09-26 19:24:25'),
(7, 'Asset', 'Asset categories', 'Asset', 'Active', '2025-09-27', '2025-09-26 19:24:25', '2025-09-26 19:24:25'),
(8, 'Liability', 'Liability categories', 'Liability', 'Active', '2025-09-27', '2025-09-26 19:24:25', '2025-09-26 19:24:25');

-- --------------------------------------------------------

--
-- Table structure for table `company_settings`
--

CREATE TABLE `company_settings` (
  `id` int(11) NOT NULL,
  `company_name` varchar(255) NOT NULL DEFAULT 'A Rauf Brother Textile',
  `address` text NOT NULL DEFAULT 'Room No.205 Floor Saleha Chamber, Plot No. 8-9/C-1 Site, Karachi',
  `email` varchar(255) NOT NULL DEFAULT 'contact@araufbrothe.com',
  `phone` varchar(50) NOT NULL DEFAULT '021-36404043',
  `st_reg_no` varchar(100) NOT NULL DEFAULT '3253255666541',
  `ntn_no` varchar(100) NOT NULL DEFAULT '7755266214-8',
  `logo_path` varchar(255) DEFAULT NULL,
  `updated_at` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `company_settings`
--

INSERT INTO `company_settings` (`id`, `company_name`, `address`, `email`, `phone`, `st_reg_no`, `ntn_no`, `logo_path`, `updated_at`) VALUES
(1, 'A Rauf Brother Textile', 'Room No.205 Floor Saleha Chamber, Plot No. 8-9/C-1 Site, Karachi', 'contact@araufbrothe.com', '021-36404043', '3253255666541', '7755266214-8', '/assets/Logo/Logo.png', '2025-09-26 19:24:25');

-- --------------------------------------------------------

--
-- Table structure for table `customertable`
--

CREATE TABLE `customertable` (
  `customer_id` int(11) NOT NULL,
  `customer` varchar(255) NOT NULL,
  `company` varchar(255) DEFAULT NULL,
  `date` date NOT NULL,
  `phone` varchar(50) NOT NULL,
  `address` text NOT NULL,
  `email` varchar(255) NOT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `customertable`
--

INSERT INTO `customertable` (`customer_id`, `customer`, `company`, `date`, `phone`, `address`, `email`, `created_at`, `updated_at`) VALUES
(2, 'Jane Smith', 'DesignCo', '2025-09-09', '987-654-3210', '456 Market Rd, LA', 'janesmith@example.com', '2025-09-10 18:46:55', '2025-09-10 18:46:55'),
(3, 'Ali Khan', 'Alpha Ltd', '2025-09-01', '0300-1234567', 'Gulberg, Lahore', 'alikhan@example.com', '2025-09-10 18:46:55', '2025-09-10 18:46:55'),
(4, 'Jane Smith (Copy)', 'DesignCo', '2025-09-04', '987-654-3210', '456 Market Rd, LA', 'janesmith@example.com', '2025-09-10 18:54:22', '2025-09-10 18:57:54'),
(5, 'Admin Admin', 'ABC Corporation', '2025-09-18', '+92123456789', 'Street 1', 'Admin@gmail.com', '2025-09-10 18:58:04', '2025-09-10 20:06:42'),
(7, 'Muhammad Hunain', 'Junior Software Developer', '2025-09-24', '03435980052', 'North Nazimabad SB-44 Block K', 'm.hunainofficial@gmail.com', '2025-09-24 14:27:27', '2025-09-24 14:27:27'),
(8, 'hunain', 'fast', '2025-09-24', '03172178847', '504 Floor Shan Residency SB-44 Block-K North Nazimabad karachi', 'ayesharizwan519@gmail.com', '2025-09-24 16:45:25', '2025-09-24 16:45:25');

-- --------------------------------------------------------

--
-- Table structure for table `expenses`
--

CREATE TABLE `expenses` (
  `id` int(11) NOT NULL,
  `title` varchar(255) NOT NULL,
  `date` date NOT NULL,
  `vendor` varchar(255) NOT NULL,
  `amount` decimal(10,2) NOT NULL,
  `category` varchar(50) NOT NULL,
  `paymentMethod` varchar(50) NOT NULL,
  `status` varchar(20) NOT NULL DEFAULT 'Pending',
  `description` text DEFAULT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp(),
  `category_id` int(11) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `expenses`
--

INSERT INTO `expenses` (`id`, `title`, `date`, `vendor`, `amount`, `category`, `paymentMethod`, `status`, `description`, `created_at`, `updated_at`, `category_id`) VALUES
(2, 'Machine Maintenance', '2025-03-15', 'TechServ Inc.', 75000.00, 'Equipment', 'Cash', 'Pending', 'Monthly maintenance service', '2025-09-08 18:33:58', '2025-09-08 18:33:58', NULL),
(4, 'Utility Bills', '2025-05-05', 'K-Electric', 45000.00, 'Utilities', 'Bank Transfer', 'Paid', 'Monthly electricity bill', '2025-09-08 18:33:58', '2025-09-08 18:33:58', NULL),
(5, 'Employee Salaries', '2025-06-10', 'Payroll', 250000.00, 'Payroll', 'Bank Transfer', 'Pending', 'Monthly staff salaries', '2025-09-08 18:33:58', '2025-09-08 18:33:58', NULL),
(6, 'Transportation', '2025-07-15', 'City Logistics', 18000.00, 'Logistics', 'Cash', 'Paid', 'Fabric delivery charges', '2025-09-08 18:33:58', '2025-09-08 18:33:58', NULL),
(8, 'Driver Expense', '2025-09-19', 'A Rauf Textile', 15000.00, 'Payroll', 'Online Payment', 'Paid', '', '2025-09-08 19:11:32', '2025-09-08 19:13:25', NULL),
(11, 'New Expense', '2025-09-26', 'Hunain', 440.00, 'Expense', 'Cash', 'Pending', '', '2025-09-26 20:34:47', '2025-09-26 20:34:47', NULL);

-- --------------------------------------------------------

--
-- Table structure for table `invoice`
--

CREATE TABLE `invoice` (
  `id` int(11) NOT NULL,
  `invoice_number` varchar(50) NOT NULL,
  `customer_id` int(11) DEFAULT NULL,
  `customer_name` varchar(255) NOT NULL,
  `customer_email` varchar(255) NOT NULL,
  `p_number` varchar(255) NOT NULL,
  `a_p_number` varchar(255) NOT NULL,
  `address` text NOT NULL,
  `st_reg_no` varchar(255) NOT NULL,
  `ntn_number` varchar(255) NOT NULL,
  `item_name` varchar(255) DEFAULT NULL,
  `quantity` decimal(10,2) DEFAULT 0.00,
  `rate` decimal(10,2) DEFAULT 0.00,
  `currency` varchar(10) DEFAULT 'PKR',
  `salesTax` decimal(5,2) DEFAULT 0.00,
  `item_amount` decimal(12,2) DEFAULT 0.00,
  `bill_date` date NOT NULL,
  `delivery_date` date DEFAULT NULL,
  `terms_of_payment` varchar(255) DEFAULT 'Within 15 days',
  `payment_deadline` date NOT NULL,
  `note` text DEFAULT NULL,
  `subtotal` decimal(12,2) NOT NULL DEFAULT 0.00,
  `tax_rate` decimal(5,2) NOT NULL DEFAULT 17.00,
  `tax_amount` decimal(12,2) NOT NULL DEFAULT 0.00,
  `total_amount` decimal(12,2) NOT NULL DEFAULT 0.00,
  `status` varchar(50) DEFAULT 'Draft',
  `is_sent` tinyint(1) DEFAULT 0,
  `sent_at` timestamp NULL DEFAULT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `invoice`
--

INSERT INTO `invoice` (`id`, `invoice_number`, `customer_id`, `customer_name`, `customer_email`, `p_number`, `a_p_number`, `address`, `st_reg_no`, `ntn_number`, `item_name`, `quantity`, `rate`, `currency`, `salesTax`, `item_amount`, `bill_date`, `delivery_date`, `terms_of_payment`, `payment_deadline`, `note`, `subtotal`, `tax_rate`, `tax_amount`, `total_amount`, `status`, `is_sent`, `sent_at`, `created_at`, `updated_at`) VALUES
(2, '', NULL, 'Jane Smith (Copy)', 'janesmith@example.com', '987-654-3210', '', '456 Market Rd, LA', '', '', 'sd', 500.00, 1.00, 'PKR', 100.00, 500.00, '2025-09-22', NULL, 'Within 15 days', '2025-10-06', '', 0.00, 17.00, 500.00, 1000.00, 'Paid', 0, NULL, '2025-09-23 20:55:26', '2025-09-24 14:36:27'),
(8, 'INV-2025-1758724514997', NULL, 'Muhammad Hunain', 'm.hunainofficial@gmail.com', '03435980052', '', 'North Nazimabad SB-44 Block K', '', '', 'Tape Ball', 100.00, 300.00, 'PKR', 12.00, 30000.00, '2025-09-24', NULL, 'Within 15 days', '2026-04-25', '', 0.00, 17.00, 3600.00, 33600.00, 'Overdue', 0, NULL, '2025-09-24 14:35:15', '2025-09-24 14:35:15'),
(11, 'INV-2025-1758732497401', NULL, 'Muhammad Hunain', 'm.hunainofficial@gmail.com', '03435980052', '', 'North Nazimabad SB-44 Block K', '', '', 'Tape Ball', 100.00, 300.00, 'PKR', 12.00, 30000.00, '2025-09-24', NULL, 'Within 15 days', '2026-04-24', '', 0.00, 17.00, 3600.00, 33600.00, 'Pending', 0, NULL, '2025-09-24 16:48:17', '2025-09-24 16:48:17'),
(13, 'INV-2025-1758915940869', 7, 'Muhammad Hunain', 'm.hunainofficial@gmail.com', '03435980052', '', 'North Nazimabad SB-44 Block K', '', '', NULL, 0.00, 0.00, 'PKR', 0.00, 0.00, '2025-09-26', NULL, 'Within 15 days', '2025-10-10', '', 100000.00, 15.00, 15000.00, 115000.00, 'Pending', 0, NULL, '2025-09-26 19:45:40', '2025-09-26 19:45:40');

-- --------------------------------------------------------

--
-- Table structure for table `invoice_items`
--

CREATE TABLE `invoice_items` (
  `id` int(11) NOT NULL,
  `invoice_id` int(11) NOT NULL,
  `item_no` int(11) NOT NULL,
  `description` varchar(255) NOT NULL,
  `quantity` int(11) NOT NULL,
  `net_weight` decimal(10,2) DEFAULT NULL,
  `rate` decimal(10,2) NOT NULL,
  `amount` decimal(12,2) NOT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `invoice_items`
--

INSERT INTO `invoice_items` (`id`, `invoice_id`, `item_no`, `description`, `quantity`, `net_weight`, `rate`, `amount`, `created_at`) VALUES
(6, 13, 1, 'tapes Ball ', 500, NULL, 100.00, 50000.00, '2025-09-26 19:45:40'),
(7, 13, 2, 'tt', 500, NULL, 100.00, 50000.00, '2025-09-26 19:45:40');

-- --------------------------------------------------------

--
-- Table structure for table `invoice_payments`
--

CREATE TABLE `invoice_payments` (
  `id` int(11) NOT NULL,
  `invoice_id` int(11) NOT NULL,
  `payment_type` enum('deposit','partial','full') NOT NULL DEFAULT 'partial',
  `payment_number` varchar(50) DEFAULT NULL,
  `amount` decimal(12,2) NOT NULL,
  `payment_date` date NOT NULL,
  `payment_method` varchar(50) DEFAULT NULL,
  `note` text DEFAULT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Stand-in structure for view `po_complete_history`
-- (See below for the actual view)
--
CREATE TABLE `po_complete_history` (
`po_number` varchar(50)
,`po_date` date
,`supplier_name` varchar(255)
,`po_total_amount` decimal(15,2)
,`po_status` enum('Draft','Pending','Approved','Received','Cancelled')
,`invoice_id` int(11)
,`invoice_number` varchar(100)
,`invoice_date` date
,`due_date` date
,`invoice_amount` decimal(15,2)
,`invoice_status` enum('Draft','Not Sent','Sent','Paid','Overdue','Cancelled')
,`payment_date` date
,`payment_method` varchar(50)
,`customer_name` varchar(255)
,`invoice_notes` text
,`total_invoiced_amount` decimal(15,2)
,`remaining_amount` decimal(15,2)
,`invoice_count` int(11)
,`last_invoice_date` date
,`invoicing_status` varchar(18)
,`invoicing_percentage` decimal(21,2)
,`invoice_created_at` timestamp
);

-- --------------------------------------------------------

--
-- Table structure for table `po_deletion_history`
--

CREATE TABLE `po_deletion_history` (
  `id` int(11) NOT NULL,
  `po_invoice_id` int(11) NOT NULL,
  `invoice_number` varchar(100) NOT NULL,
  `po_number` varchar(100) NOT NULL,
  `customer_name` varchar(255) NOT NULL,
  `invoice_amount` decimal(15,2) NOT NULL,
  `invoice_date` date NOT NULL,
  `deletion_date` timestamp NOT NULL DEFAULT current_timestamp(),
  `deletion_reason` text DEFAULT NULL,
  `deleted_by` varchar(100) DEFAULT 'System User',
  `notes` text DEFAULT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci COMMENT='Tracks deleted PO invoices for audit and history purposes';

--
-- Dumping data for table `po_deletion_history`
--

INSERT INTO `po_deletion_history` (`id`, `po_invoice_id`, `invoice_number`, `po_number`, `customer_name`, `invoice_amount`, `invoice_date`, `deletion_date`, `deletion_reason`, `deleted_by`, `notes`, `created_at`) VALUES
(1, 6, 'INV-PO-20250929-150543-1759141104412', 'PO-20250929-150543', 'Muhammad Hunain', 1270096.31, '2025-09-29', '2025-09-29 15:23:34', 'Manual deletion via system', 'System User', NULL, '2025-09-29 15:23:34'),
(2, 7, 'INV-PO-20250929-150543-1759141436632', 'PO-20250929-150543', 'Muhammad Hunain', 50000.00, '2025-09-29', '2025-09-29 16:13:52', 'Manual deletion via system', 'System User', NULL, '2025-09-29 16:13:52'),
(3, 12, 'INV-PO-20250929-221636-1759166266563', 'PO-20250929-221636', 'Muhammad Hunain', 50.00, '2025-09-29', '2025-09-29 17:22:23', 'Manual deletion via system', 'System User', NULL, '2025-09-29 17:22:23');

-- --------------------------------------------------------

--
-- Stand-in structure for view `po_deletion_summary`
-- (See below for the actual view)
--
CREATE TABLE `po_deletion_summary` (
`id` int(11)
,`po_invoice_id` int(11)
,`invoice_number` varchar(100)
,`po_number` varchar(100)
,`customer_name` varchar(255)
,`invoice_amount` decimal(15,2)
,`invoice_date` date
,`deletion_date` timestamp
,`deletion_reason` text
,`deleted_by` varchar(100)
,`notes` text
,`created_at` timestamp
,`po_total_amount` decimal(15,2)
,`total_invoiced_amount` decimal(15,2)
,`remaining_amount` decimal(15,2)
,`invoice_count` int(11)
,`current_status` varchar(12)
);

-- --------------------------------------------------------

--
-- Table structure for table `po_invoices`
--

CREATE TABLE `po_invoices` (
  `id` int(11) NOT NULL,
  `invoice_number` varchar(100) NOT NULL,
  `invoice_date` date NOT NULL,
  `due_date` date DEFAULT NULL,
  `po_id` varchar(100) DEFAULT NULL,
  `po_number` varchar(100) NOT NULL,
  `customer_name` varchar(255) NOT NULL,
  `customer_email` varchar(255) DEFAULT NULL,
  `customer_phone` varchar(50) DEFAULT NULL,
  `customer_address` text DEFAULT NULL,
  `subtotal` decimal(15,2) NOT NULL DEFAULT 0.00,
  `tax_rate` decimal(5,2) NOT NULL DEFAULT 0.00,
  `tax_amount` decimal(15,2) NOT NULL DEFAULT 0.00,
  `total_amount` decimal(15,2) NOT NULL DEFAULT 0.00,
  `currency` varchar(10) DEFAULT 'PKR',
  `status` enum('Draft','Not Sent','Sent','Paid','Overdue','Cancelled') DEFAULT 'Not Sent',
  `payment_date` date DEFAULT NULL,
  `payment_method` varchar(50) DEFAULT NULL,
  `payment_reference` varchar(100) DEFAULT NULL,
  `notes` text DEFAULT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `po_invoices`
--

INSERT INTO `po_invoices` (`id`, `invoice_number`, `invoice_date`, `due_date`, `po_id`, `po_number`, `customer_name`, `customer_email`, `customer_phone`, `customer_address`, `subtotal`, `tax_rate`, `tax_amount`, `total_amount`, `currency`, `status`, `payment_date`, `payment_method`, `payment_reference`, `notes`, `created_at`, `updated_at`) VALUES
(1, 'INV-PO-20250927-180053-1758985774235', '2025-09-27', '2025-10-27', 'PO-20250927-180053', 'PO-20250927-180053', 'ABC Textiles Ltd', 'contact@abctextiles.com', '+92-21-0052', 'Plot No. 123, Industrial Area, Karachi, Pakistan', 94966.67, 17.00, 16144.33, 111111.00, 'PKR', 'Not Sent', NULL, NULL, NULL, 'Generated from Purchase Order: PO-20250927-180053', '2025-09-27 15:09:46', '2025-09-29 16:59:32'),
(4, 'INV-PO-20250927-182905-1758997206757', '2025-09-27', '2025-10-27', 'PO-20250927-182905', 'PO-20250927-182905', 'Muhammad Hunain', 'a@gmail.com', '0052', '202 Floor Shan Residency SB-44 Block-K North Nazimabad karachi', 1000.00, 10.00, 0.00, 1000.00, 'PKR', 'Sent', NULL, NULL, NULL, 'Generated from Purchase Order: PO-20250927-182905', '2025-09-27 18:26:44', '2025-09-29 14:38:49'),
(5, 'INV-PO-20250927-182905-1759009002676', '2025-09-27', '2025-10-27', 'PO-20250927-182905', 'PO-20250927-182905', 'Muhammad Hunain', 'a@gmail.com', '0052', '202 Floor Shan Residency SB-44 Block-K North Nazimabad karachi', 1000.00, 10.00, 0.00, 1000.00, 'PKR', 'Sent', NULL, NULL, NULL, 'Generated from Purchase Order: PO-20250927-182905', '2025-09-27 21:37:05', '2025-09-29 14:38:49'),
(8, 'INV-PO-20250929-150543-1759153841509', '2025-09-29', '2025-10-29', 'PO-20250929-150543', 'PO-20250929-150543', 'Muhammad Hunain', 'N/A', 'N/A', 'N/A', 5000.00, 11.00, 0.00, 5000.00, 'PKR', 'Sent', NULL, NULL, NULL, 'Generated from Purchase Order: PO-20250929-150543', '2025-09-29 13:50:55', '2025-09-29 14:38:49'),
(9, 'INV-PO-20250929-150543-1759154008024', '2025-09-29', '2025-10-29', 'PO-20250929-150543', 'PO-20250929-150543', 'Muhammad Hunain', 'N/A', 'N/A', 'N/A', 45000.00, 11.00, 0.00, 45000.00, 'PKR', 'Sent', NULL, NULL, NULL, 'Generated from Purchase Order: PO-20250929-150543', '2025-09-29 13:53:49', '2025-09-29 14:38:49'),
(10, 'INV-PO-20250929-150543-1759162977238', '2025-09-29', '2025-10-29', 'PO-20250929-150543', 'PO-20250929-150543', 'Muhammad Hunain', 'N/A', 'N/A', 'N/A', 1220096.31, 11.00, 0.00, 1220096.31, 'PKR', 'Draft', NULL, NULL, NULL, 'Generated from Purchase Order: PO-20250929-150543', '2025-09-29 16:23:11', '2025-09-29 16:23:11'),
(11, 'INV-PO-20250929-215641-1759165040127', '2025-09-29', '2025-09-27', 'PO-20250929-215641', 'PO-20250929-215641', '11', '519@gmail.com', '0052', 'SB-44 Block-K North Nazimabad karachi', 100000.00, 0.00, 0.00, 100000.00, 'PKR', 'Draft', NULL, NULL, NULL, 'Generated from Purchase Order: PO-20250929-215641', '2025-09-29 16:58:00', '2025-09-29 16:58:00');

--
-- Triggers `po_invoices`
--
DELIMITER $$
CREATE TRIGGER `trg_po_summary_after_delete` AFTER DELETE ON `po_invoices` FOR EACH ROW BEGIN
    DECLARE po_total DECIMAL(15,2) DEFAULT 0;
    DECLARE remaining_invoices INT DEFAULT 0;
    
    -- Get the actual PO total amount from purchase_orders table
    SELECT total_amount INTO po_total 
    FROM purchase_orders 
    WHERE po_number = OLD.po_number 
    LIMIT 1;
    
    -- Count remaining invoices for this PO
    SELECT COUNT(*) INTO remaining_invoices 
    FROM po_invoices 
    WHERE po_number = OLD.po_number;
    
    IF remaining_invoices > 0 THEN
        -- Update existing summary record
        UPDATE po_invoice_summary 
        SET 
            po_total_amount = COALESCE(po_total, po_total_amount),
            total_invoiced_amount = total_invoiced_amount - OLD.total_amount,
            remaining_amount = COALESCE(po_total, po_total_amount) - (total_invoiced_amount - OLD.total_amount),
            invoice_count = invoice_count - 1,
            last_invoice_date = (
                SELECT MAX(invoice_date) 
                FROM po_invoices 
                WHERE po_number = OLD.po_number
            ),
            updated_at = CURRENT_TIMESTAMP
        WHERE po_number = OLD.po_number;
    ELSE
        -- Delete summary record if no invoices remain
        DELETE FROM po_invoice_summary WHERE po_number = OLD.po_number;
    END IF;
END
$$
DELIMITER ;
DELIMITER $$
CREATE TRIGGER `trg_po_summary_after_insert` AFTER INSERT ON `po_invoices` FOR EACH ROW BEGIN
    DECLARE po_total DECIMAL(15,2) DEFAULT 0;
    
    -- Get the actual PO total amount from purchase_orders table
    SELECT total_amount INTO po_total 
    FROM purchase_orders 
    WHERE po_number = NEW.po_number 
    LIMIT 1;
    
    -- If PO not found, use 0 as fallback
    IF po_total IS NULL THEN
        SET po_total = 0;
    END IF;
    
    -- Insert or update the summary
    INSERT INTO po_invoice_summary (
        po_number, 
        po_total_amount, 
        total_invoiced_amount, 
        remaining_amount, 
        invoice_count, 
        last_invoice_date,
        created_at,
        updated_at
    )
    VALUES (
        NEW.po_number,
        po_total,
        NEW.total_amount,
        po_total - NEW.total_amount,
        1,
        NEW.invoice_date,
        CURRENT_TIMESTAMP,
        CURRENT_TIMESTAMP
    )
    ON DUPLICATE KEY UPDATE
        po_total_amount = po_total,
        total_invoiced_amount = total_invoiced_amount + NEW.total_amount,
        remaining_amount = po_total - (total_invoiced_amount + NEW.total_amount),
        invoice_count = invoice_count + 1,
        last_invoice_date = NEW.invoice_date,
        updated_at = CURRENT_TIMESTAMP;
END
$$
DELIMITER ;
DELIMITER $$
CREATE TRIGGER `trg_po_summary_after_update` AFTER UPDATE ON `po_invoices` FOR EACH ROW BEGIN
    DECLARE po_total DECIMAL(15,2) DEFAULT 0;
    
    -- Get the actual PO total amount from purchase_orders table
    SELECT total_amount INTO po_total 
    FROM purchase_orders 
    WHERE po_number = NEW.po_number 
    LIMIT 1;
    
    -- If PO not found, use existing po_total_amount
    IF po_total IS NULL THEN
        SELECT po_total_amount INTO po_total 
        FROM po_invoice_summary 
        WHERE po_number = NEW.po_number;
    END IF;
    
    -- Update the summary
    UPDATE po_invoice_summary 
    SET 
        po_total_amount = po_total,
        total_invoiced_amount = total_invoiced_amount - OLD.total_amount + NEW.total_amount,
        remaining_amount = po_total - (total_invoiced_amount - OLD.total_amount + NEW.total_amount),
        last_invoice_date = NEW.invoice_date,
        updated_at = CURRENT_TIMESTAMP
    WHERE po_number = NEW.po_number;
END
$$
DELIMITER ;

-- --------------------------------------------------------

--
-- Stand-in structure for view `po_invoice_history`
-- (See below for the actual view)
--
CREATE TABLE `po_invoice_history` (
`id` int(11)
,`invoice_number` varchar(100)
,`invoice_date` date
,`due_date` date
,`po_number` varchar(100)
,`customer_name` varchar(255)
,`invoice_amount` decimal(15,2)
,`status` enum('Draft','Not Sent','Sent','Paid','Overdue','Cancelled')
,`notes` text
,`po_total_amount` decimal(15,2)
,`total_invoiced_amount` decimal(15,2)
,`remaining_amount` decimal(15,2)
,`invoice_count` int(11)
,`created_at` timestamp
);

-- --------------------------------------------------------

--
-- Table structure for table `po_invoice_items`
--

CREATE TABLE `po_invoice_items` (
  `id` int(11) NOT NULL,
  `po_invoice_id` int(11) NOT NULL,
  `item_no` int(11) NOT NULL DEFAULT 1,
  `description` text NOT NULL,
  `quantity` decimal(10,2) NOT NULL DEFAULT 0.00,
  `unit_price` decimal(15,2) NOT NULL DEFAULT 0.00,
  `amount` decimal(15,2) NOT NULL DEFAULT 0.00,
  `specifications` text DEFAULT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `po_invoice_items`
--

INSERT INTO `po_invoice_items` (`id`, `po_invoice_id`, `item_no`, `description`, `quantity`, `unit_price`, `amount`, `specifications`, `created_at`, `updated_at`) VALUES
(2, 8, 1, '1111', 1111.00, 1111.00, 1234321.00, NULL, '2025-09-29 13:50:55', '2025-09-29 13:50:55'),
(3, 9, 1, '1111', 1111.00, 1111.00, 1234321.00, NULL, '2025-09-29 13:53:49', '2025-09-29 13:53:49'),
(4, 10, 1, '1111', 1111.00, 1111.00, 1234321.00, NULL, '2025-09-29 16:23:11', '2025-09-29 16:23:11'),
(5, 11, 1, 'blah  blah ', 1000.00, 111.00, 111000.00, NULL, '2025-09-29 16:58:00', '2025-09-29 16:58:00');

-- --------------------------------------------------------

--
-- Table structure for table `po_invoice_summary`
--

CREATE TABLE `po_invoice_summary` (
  `id` int(11) NOT NULL,
  `po_number` varchar(100) NOT NULL,
  `po_total_amount` decimal(15,2) NOT NULL DEFAULT 0.00,
  `total_invoiced_amount` decimal(15,2) NOT NULL DEFAULT 0.00,
  `remaining_amount` decimal(15,2) NOT NULL DEFAULT 0.00,
  `invoice_count` int(11) NOT NULL DEFAULT 0,
  `last_invoice_date` date DEFAULT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `po_invoice_summary`
--

INSERT INTO `po_invoice_summary` (`id`, `po_number`, `po_total_amount`, `total_invoiced_amount`, `remaining_amount`, `invoice_count`, `last_invoice_date`, `created_at`, `updated_at`) VALUES
(1, 'PO-20250927-180053', 0.00, 111111.00, -111111.00, 1, '2025-09-27', '2025-09-27 15:09:46', '2025-09-29 16:59:32'),
(4, 'PO-20250927-182905', 0.00, 2000.00, -2000.00, 2, '2025-09-27', '2025-09-27 18:26:44', '2025-09-29 14:38:49'),
(6, 'PO-20250929-150543', 1370096.31, 1270096.31, 100000.00, 3, '2025-09-29', '2025-09-29 10:18:21', '2025-09-29 17:24:43'),
(25, 'PO-20250929-150451', 1.01, 0.00, 1.01, 0, NULL, '2025-09-29 13:24:55', '2025-09-29 14:00:08'),
(43, 'PO-20250929-150512', 1.11, 0.00, 1.11, 0, NULL, '2025-09-29 14:03:21', '2025-09-29 16:08:02'),
(45, 'PO-20250927-205007', 136886.31, 0.00, 136886.31, 0, NULL, '2025-09-29 14:29:20', '2025-09-29 14:29:20'),
(51, 'PO-20250929-194943', 56000.00, 0.00, 56000.00, 0, NULL, '2025-09-29 14:50:33', '2025-09-29 14:50:33'),
(59, 'PO-20250929-215641', 111000.00, 100000.00, 11000.00, 1, '2025-09-29', '2025-09-29 16:57:16', '2025-09-29 17:23:24'),
(67, 'PO-20250929-221636', 200.00, 0.00, 200.00, 0, NULL, '2025-09-29 17:22:23', '2025-09-29 17:22:23');

-- --------------------------------------------------------

--
-- Table structure for table `purchase_orders`
--

CREATE TABLE `purchase_orders` (
  `id` int(11) NOT NULL,
  `po_number` varchar(50) NOT NULL,
  `po_date` date NOT NULL,
  `supplier_name` varchar(255) NOT NULL,
  `supplier_email` varchar(255) DEFAULT NULL,
  `supplier_phone` varchar(50) DEFAULT NULL,
  `supplier_address` text DEFAULT NULL,
  `subtotal` decimal(15,2) DEFAULT 0.00,
  `tax_rate` decimal(5,2) DEFAULT 0.00,
  `tax_amount` decimal(15,2) DEFAULT 0.00,
  `total_amount` decimal(15,2) NOT NULL,
  `currency` varchar(10) DEFAULT 'PKR',
  `status` enum('Draft','Pending','Approved','Received','Cancelled') DEFAULT 'Pending',
  `previous_status` varchar(50) DEFAULT NULL,
  `notes` text DEFAULT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `purchase_orders`
--

INSERT INTO `purchase_orders` (`id`, `po_number`, `po_date`, `supplier_name`, `supplier_email`, `supplier_phone`, `supplier_address`, `subtotal`, `tax_rate`, `tax_amount`, `total_amount`, `currency`, `status`, `previous_status`, `notes`, `created_at`, `updated_at`) VALUES
(1, 'PO-20250927-174936', '2025-09-27', 'Muhammad Hunain', 'a@gmail.com', '0052', 'Block-K North Nazimabad karachi', 1000.00, 15.00, 150.00, 1150.00, 'PKR', 'Pending', NULL, 'stejse46', '2025-09-27 12:50:33', '2025-09-27 12:50:33'),
(4, 'PO-20250927-202751', '2025-09-27', 'Muhammad Hunain', 'a@gmail.com', '0052', 'Block-K North Nazimabad karachi', 1.00, 1.00, 0.01, 1.01, 'PKR', 'Pending', NULL, '', '2025-09-27 15:28:01', '2025-09-27 15:28:01'),
(5, 'PO-20250927-202808', '2025-09-27', 'Muhammad Hunain', 'a@gmail.com', '0052', 'Block-K North Nazimabad karachi', 100000.00, 17.00, 17000.00, 117000.00, 'PKR', 'Pending', NULL, '', '2025-09-27 15:28:24', '2025-09-27 15:28:24'),
(6, 'PO-20250927-204944', '2025-09-27', 'Hunain', 'a@gmail.com', '03172178847', 'Block-K North Nazimabad karachii', 4400.00, 39.80, 1751.20, 6151.20, 'PKR', 'Pending', NULL, '', '2025-09-27 15:50:01', '2025-09-27 15:50:01'),
(7, 'PO-20250927-205007', '2025-09-26', 'aaaa', 'a@gmail.com', '0052', 'Block-K North Nazimabad karachii', 123321.00, 11.00, 13565.31, 136886.31, 'PKR', 'Cancelled', 'Pending', '', '2025-09-27 15:50:21', '2025-09-29 14:29:11'),
(8, 'PO-20250929-150451', '2025-09-29', 'aaaa', 'a@gmail.com', '0052', 'Block-K North Nazimabad karachii', 1.00, 1.00, 0.01, 1.01, 'PKR', 'Approved', NULL, '', '2025-09-29 10:05:07', '2025-09-29 10:05:07'),
(9, 'PO-20250929-150512', '2025-09-28', '11', '', '', '', 1.00, 11.00, 0.11, 1.11, 'PKR', 'Cancelled', 'Pending', '', '2025-09-29 10:05:22', '2025-09-29 16:08:02'),
(11, 'PO-20250929-150543', '2025-09-29', 'Muhammad Hunain', '', '', '', 1234321.00, 11.00, 135775.31, 1370096.31, 'PKR', 'Pending', NULL, '', '2025-09-29 10:05:52', '2025-09-29 10:05:52'),
(12, 'PO-20250929-194943', '2025-09-29', 'Muhammad Hunain', 'ayesharizwan519@gmail.com', '0052', '504 Floor Shan Residency SB-44 Block-K North Nazimabad karachi', 50000.00, 12.00, 6000.00, 56000.00, 'PKR', 'Pending', NULL, 'req penidng from higher ups \n', '2025-09-29 14:50:27', '2025-09-29 14:50:27'),
(13, 'PO-20250929-215641', '2025-09-27', '11', 'a@gmail.com', '03172178847', 'Block-K North Nazimabad karachi', 111000.00, 0.00, 0.00, 111000.00, 'PKR', 'Approved', NULL, '', '2025-09-29 16:57:10', '2025-09-29 17:22:57'),
(14, 'PO-20250929-221636', '2025-09-29', 'Muhammad Hunain', 'a@gmail.com', '0052', 'Block-K North Nazimabad karachi', 200.00, 0.00, 0.00, 200.00, 'PKR', 'Pending', NULL, 'jkb', '2025-09-29 17:17:30', '2025-09-29 17:17:30');

--
-- Triggers `purchase_orders`
--
DELIMITER $$
CREATE TRIGGER `trg_sync_po_total_on_update` AFTER UPDATE ON `purchase_orders` FOR EACH ROW BEGIN
    -- Update the summary table when PO total amount changes
    UPDATE `po_invoice_summary` 
    SET 
        po_total_amount = NEW.total_amount,
        remaining_amount = NEW.total_amount - total_invoiced_amount,
        updated_at = CURRENT_TIMESTAMP
    WHERE po_number = NEW.po_number;
END
$$
DELIMITER ;

-- --------------------------------------------------------

--
-- Table structure for table `purchase_order_items`
--

CREATE TABLE `purchase_order_items` (
  `id` int(11) NOT NULL,
  `purchase_order_id` int(11) DEFAULT NULL,
  `item_no` int(11) NOT NULL,
  `description` text NOT NULL,
  `quantity` decimal(10,2) NOT NULL,
  `unit_price` decimal(15,2) NOT NULL,
  `amount` decimal(15,2) NOT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `purchase_order_items`
--

INSERT INTO `purchase_order_items` (`id`, `purchase_order_id`, `item_no`, `description`, `quantity`, `unit_price`, `amount`, `created_at`, `updated_at`) VALUES
(3, 4, 1, 'xx', 1.00, 1.00, 1.00, '2025-09-27 15:28:01', '2025-09-27 15:28:01'),
(4, 5, 1, 'gfgg', 100000.00, 1.00, 100000.00, '2025-09-27 15:28:24', '2025-09-27 15:28:24'),
(5, 6, 1, 'kkkkk', 11.00, 400.00, 4400.00, '2025-09-27 15:50:01', '2025-09-27 15:50:01'),
(7, 8, 1, 'aa', 1.00, 1.00, 1.00, '2025-09-29 10:05:07', '2025-09-29 10:05:07'),
(10, 11, 1, '1111', 1111.00, 1111.00, 1234321.00, '2025-09-29 10:05:52', '2025-09-29 10:05:52'),
(11, 12, 1, 'tape ball ', 100.00, 500.00, 50000.00, '2025-09-29 14:50:28', '2025-09-29 14:50:28'),
(13, 14, 1, 'bnbhbnhj', 1.00, 100.00, 100.00, '2025-09-29 17:17:30', '2025-09-29 17:17:30'),
(14, 14, 2, 'njhjkbnkn', 1.00, 100.00, 100.00, '2025-09-29 17:17:30', '2025-09-29 17:17:30');

-- --------------------------------------------------------

--
-- Table structure for table `reporttable`
--

CREATE TABLE `reporttable` (
  `id` varchar(11) NOT NULL,
  `date` varchar(255) NOT NULL,
  `customer` varchar(255) NOT NULL,
  `price` decimal(10,2) NOT NULL,
  `status` varchar(255) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `reporttable`
--

INSERT INTO `reporttable` (`id`, `date`, `customer`, `price`, `status`) VALUES
('15', '2025-09-08', 'Abdul Moiz', 250000.00, 'Pending'),
('16', '2025-09-25', 'Muhammad Huinain', 4995.00, 'On the way'),
('17', '2025-09-25', 'Rizwan', 7000.00, 'Pending');

-- --------------------------------------------------------

--
-- Table structure for table `users`
--

CREATE TABLE `users` (
  `firstName` text NOT NULL,
  `lastName` text NOT NULL,
  `email` text NOT NULL,
  `password` text NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `users`
--

INSERT INTO `users` (`firstName`, `lastName`, `email`, `password`) VALUES
('John', 'Doe', 'johndoe@gmail.com', 'admin'),
('Admin', 'Admin', 'Admin@gmail.com', 'Admin123'),
('Shameel', 'Arif', 'shameel@gmail.com', 'shameel123'),
('Admin', 'Admin', 'Admin@gmail.com', 'ADmin!@#');

-- --------------------------------------------------------

--
-- Table structure for table `user_sessions`
--

CREATE TABLE `user_sessions` (
  `id` int(11) NOT NULL,
  `user_id` int(11) NOT NULL,
  `session_token` varchar(255) NOT NULL,
  `ip_address` varchar(45) DEFAULT NULL,
  `user_agent` text DEFAULT NULL,
  `login_time` timestamp NOT NULL DEFAULT current_timestamp(),
  `last_activity` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp(),
  `is_active` tinyint(1) DEFAULT 1,
  `expires_at` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Table structure for table `user_settings`
--

CREATE TABLE `user_settings` (
  `id` int(11) NOT NULL,
  `user_id` int(11) NOT NULL DEFAULT 1,
  `first_name` varchar(50) DEFAULT NULL,
  `last_name` varchar(50) DEFAULT NULL,
  `email` varchar(150) NOT NULL,
  `phone` varchar(20) DEFAULT NULL,
  `company` varchar(100) DEFAULT NULL,
  `address` text DEFAULT NULL,
  `profile_picture_url` varchar(255) DEFAULT NULL,
  `job_title` varchar(100) DEFAULT NULL,
  `bio` text DEFAULT NULL,
  `timezone` varchar(50) DEFAULT 'UTC+5',
  `language` varchar(10) DEFAULT 'en',
  `currency_preference` varchar(10) DEFAULT 'PKR',
  `date_format` varchar(20) DEFAULT 'YYYY-MM-DD',
  `two_factor_enabled` tinyint(1) DEFAULT 0,
  `email_notifications` tinyint(1) DEFAULT 1,
  `marketing_emails` tinyint(1) DEFAULT 1,
  `theme_preference` varchar(20) DEFAULT 'light',
  `dashboard_layout` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_bin DEFAULT NULL CHECK (json_valid(`dashboard_layout`)),
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Structure for view `po_complete_history`
--
DROP TABLE IF EXISTS `po_complete_history`;

CREATE ALGORITHM=UNDEFINED DEFINER=`root`@`localhost` SQL SECURITY DEFINER VIEW `po_complete_history`  AS SELECT `po`.`po_number` AS `po_number`, `po`.`po_date` AS `po_date`, `po`.`supplier_name` AS `supplier_name`, `po`.`total_amount` AS `po_total_amount`, `po`.`status` AS `po_status`, `pi`.`id` AS `invoice_id`, `pi`.`invoice_number` AS `invoice_number`, `pi`.`invoice_date` AS `invoice_date`, `pi`.`due_date` AS `due_date`, `pi`.`total_amount` AS `invoice_amount`, `pi`.`status` AS `invoice_status`, `pi`.`payment_date` AS `payment_date`, `pi`.`payment_method` AS `payment_method`, `pi`.`customer_name` AS `customer_name`, `pi`.`notes` AS `invoice_notes`, `ps`.`total_invoiced_amount` AS `total_invoiced_amount`, `ps`.`remaining_amount` AS `remaining_amount`, `ps`.`invoice_count` AS `invoice_count`, `ps`.`last_invoice_date` AS `last_invoice_date`, CASE WHEN `ps`.`total_invoiced_amount` >= `po`.`total_amount` THEN 'Fully Invoiced' WHEN `ps`.`total_invoiced_amount` > 0 THEN 'Partially Invoiced' ELSE 'Not Invoiced' END AS `invoicing_status`, round(`ps`.`total_invoiced_amount` / `po`.`total_amount` * 100,2) AS `invoicing_percentage`, `pi`.`created_at` AS `invoice_created_at` FROM ((`purchase_orders` `po` left join `po_invoices` `pi` on(`po`.`po_number` = `pi`.`po_number`)) left join `po_invoice_summary` `ps` on(`po`.`po_number` = `ps`.`po_number`)) ORDER BY `po`.`po_date` DESC, `pi`.`invoice_date` DESC ;

-- --------------------------------------------------------

--
-- Structure for view `po_deletion_summary`
--
DROP TABLE IF EXISTS `po_deletion_summary`;

CREATE ALGORITHM=UNDEFINED DEFINER=`root`@`localhost` SQL SECURITY DEFINER VIEW `po_deletion_summary`  AS SELECT `pdh`.`id` AS `id`, `pdh`.`po_invoice_id` AS `po_invoice_id`, `pdh`.`invoice_number` AS `invoice_number`, `pdh`.`po_number` AS `po_number`, `pdh`.`customer_name` AS `customer_name`, `pdh`.`invoice_amount` AS `invoice_amount`, `pdh`.`invoice_date` AS `invoice_date`, `pdh`.`deletion_date` AS `deletion_date`, `pdh`.`deletion_reason` AS `deletion_reason`, `pdh`.`deleted_by` AS `deleted_by`, `pdh`.`notes` AS `notes`, `pdh`.`created_at` AS `created_at`, `pis`.`po_total_amount` AS `po_total_amount`, `pis`.`total_invoiced_amount` AS `total_invoiced_amount`, `pis`.`remaining_amount` AS `remaining_amount`, `pis`.`invoice_count` AS `invoice_count`, CASE WHEN `pis`.`invoice_count` > 0 THEN 'Has Invoices' ELSE 'No Invoices' END AS `current_status` FROM (`po_deletion_history` `pdh` left join `po_invoice_summary` `pis` on(`pdh`.`po_number` = `pis`.`po_number`)) ORDER BY `pdh`.`deletion_date` DESC ;

-- --------------------------------------------------------

--
-- Structure for view `po_invoice_history`
--
DROP TABLE IF EXISTS `po_invoice_history`;

CREATE ALGORITHM=UNDEFINED DEFINER=`root`@`localhost` SQL SECURITY DEFINER VIEW `po_invoice_history`  AS SELECT `pi`.`id` AS `id`, `pi`.`invoice_number` AS `invoice_number`, `pi`.`invoice_date` AS `invoice_date`, `pi`.`due_date` AS `due_date`, `pi`.`po_number` AS `po_number`, `pi`.`customer_name` AS `customer_name`, `pi`.`total_amount` AS `invoice_amount`, `pi`.`status` AS `status`, `pi`.`notes` AS `notes`, `ps`.`po_total_amount` AS `po_total_amount`, `ps`.`total_invoiced_amount` AS `total_invoiced_amount`, `ps`.`remaining_amount` AS `remaining_amount`, `ps`.`invoice_count` AS `invoice_count`, `pi`.`created_at` AS `created_at` FROM (`po_invoices` `pi` left join `po_invoice_summary` `ps` on(`pi`.`po_number` = `ps`.`po_number`)) ORDER BY `pi`.`created_at` DESC ;

--
-- Indexes for dumped tables
--

--
-- Indexes for table `categories`
--
ALTER TABLE `categories`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `name` (`name`);

--
-- Indexes for table `company_settings`
--
ALTER TABLE `company_settings`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `customertable`
--
ALTER TABLE `customertable`
  ADD PRIMARY KEY (`customer_id`);

--
-- Indexes for table `expenses`
--
ALTER TABLE `expenses`
  ADD PRIMARY KEY (`id`),
  ADD KEY `fk_expense_category` (`category_id`),
  ADD KEY `idx_expenses_date` (`date`),
  ADD KEY `idx_expenses_category` (`category`);

--
-- Indexes for table `invoice`
--
ALTER TABLE `invoice`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `invoice_number` (`invoice_number`),
  ADD KEY `fk_invoice_customer` (`customer_id`),
  ADD KEY `idx_invoice_status` (`status`),
  ADD KEY `idx_invoice_date` (`bill_date`);

--
-- Indexes for table `invoice_items`
--
ALTER TABLE `invoice_items`
  ADD PRIMARY KEY (`id`),
  ADD KEY `fk_invoice_items_invoice` (`invoice_id`),
  ADD KEY `idx_item_no` (`item_no`);

--
-- Indexes for table `invoice_payments`
--
ALTER TABLE `invoice_payments`
  ADD PRIMARY KEY (`id`),
  ADD KEY `fk_invoice_payments_invoice` (`invoice_id`),
  ADD KEY `idx_payment_date` (`payment_date`);

--
-- Indexes for table `po_deletion_history`
--
ALTER TABLE `po_deletion_history`
  ADD PRIMARY KEY (`id`),
  ADD KEY `idx_po_number` (`po_number`),
  ADD KEY `idx_deletion_date` (`deletion_date`),
  ADD KEY `idx_po_invoice_id` (`po_invoice_id`);

--
-- Indexes for table `po_invoices`
--
ALTER TABLE `po_invoices`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `invoice_number` (`invoice_number`),
  ADD KEY `idx_po_number` (`po_number`),
  ADD KEY `idx_invoice_date` (`invoice_date`),
  ADD KEY `idx_status` (`status`),
  ADD KEY `idx_customer_name` (`customer_name`),
  ADD KEY `idx_po_invoices_po_number` (`po_number`),
  ADD KEY `idx_po_invoices_status` (`status`),
  ADD KEY `idx_po_invoices_invoice_date` (`invoice_date`);

--
-- Indexes for table `po_invoice_items`
--
ALTER TABLE `po_invoice_items`
  ADD PRIMARY KEY (`id`),
  ADD KEY `idx_po_invoice_items_invoice_id` (`po_invoice_id`),
  ADD KEY `idx_po_invoice_items_item_no` (`item_no`);

--
-- Indexes for table `po_invoice_summary`
--
ALTER TABLE `po_invoice_summary`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `unique_po_number` (`po_number`),
  ADD KEY `idx_po_number` (`po_number`),
  ADD KEY `idx_po_invoice_summary_po_number` (`po_number`);

--
-- Indexes for table `purchase_orders`
--
ALTER TABLE `purchase_orders`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `po_number` (`po_number`),
  ADD KEY `idx_po_number` (`po_number`),
  ADD KEY `idx_po_date` (`po_date`),
  ADD KEY `idx_po_status` (`status`);

--
-- Indexes for table `purchase_order_items`
--
ALTER TABLE `purchase_order_items`
  ADD PRIMARY KEY (`id`),
  ADD KEY `idx_po_items_order_id` (`purchase_order_id`);

--
-- Indexes for table `reporttable`
--
ALTER TABLE `reporttable`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `user_sessions`
--
ALTER TABLE `user_sessions`
  ADD PRIMARY KEY (`id`),
  ADD KEY `idx_user_id` (`user_id`),
  ADD KEY `idx_session_token` (`session_token`),
  ADD KEY `idx_is_active` (`is_active`);

--
-- Indexes for table `user_settings`
--
ALTER TABLE `user_settings`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `email` (`email`),
  ADD KEY `idx_user_id` (`user_id`),
  ADD KEY `idx_email` (`email`);

--
-- AUTO_INCREMENT for dumped tables
--

--
-- AUTO_INCREMENT for table `categories`
--
ALTER TABLE `categories`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=9;

--
-- AUTO_INCREMENT for table `company_settings`
--
ALTER TABLE `company_settings`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=2;

--
-- AUTO_INCREMENT for table `customertable`
--
ALTER TABLE `customertable`
  MODIFY `customer_id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=9;

--
-- AUTO_INCREMENT for table `expenses`
--
ALTER TABLE `expenses`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=12;

--
-- AUTO_INCREMENT for table `invoice`
--
ALTER TABLE `invoice`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=14;

--
-- AUTO_INCREMENT for table `invoice_items`
--
ALTER TABLE `invoice_items`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=8;

--
-- AUTO_INCREMENT for table `invoice_payments`
--
ALTER TABLE `invoice_payments`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=4;

--
-- AUTO_INCREMENT for table `po_deletion_history`
--
ALTER TABLE `po_deletion_history`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=4;

--
-- AUTO_INCREMENT for table `po_invoices`
--
ALTER TABLE `po_invoices`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=13;

--
-- AUTO_INCREMENT for table `po_invoice_items`
--
ALTER TABLE `po_invoice_items`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=8;

--
-- AUTO_INCREMENT for table `po_invoice_summary`
--
ALTER TABLE `po_invoice_summary`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=71;

--
-- AUTO_INCREMENT for table `purchase_orders`
--
ALTER TABLE `purchase_orders`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=15;

--
-- AUTO_INCREMENT for table `purchase_order_items`
--
ALTER TABLE `purchase_order_items`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=15;

--
-- AUTO_INCREMENT for table `user_sessions`
--
ALTER TABLE `user_sessions`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `user_settings`
--
ALTER TABLE `user_settings`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

--
-- Constraints for dumped tables
--

--
-- Constraints for table `expenses`
--
ALTER TABLE `expenses`
  ADD CONSTRAINT `fk_expense_category` FOREIGN KEY (`category_id`) REFERENCES `categories` (`id`) ON DELETE SET NULL;

--
-- Constraints for table `invoice`
--
ALTER TABLE `invoice`
  ADD CONSTRAINT `fk_invoice_customer` FOREIGN KEY (`customer_id`) REFERENCES `customertable` (`customer_id`) ON DELETE SET NULL;

--
-- Constraints for table `invoice_items`
--
ALTER TABLE `invoice_items`
  ADD CONSTRAINT `fk_invoice_items_invoice` FOREIGN KEY (`invoice_id`) REFERENCES `invoice` (`id`) ON DELETE CASCADE;

--
-- Constraints for table `invoice_payments`
--
ALTER TABLE `invoice_payments`
  ADD CONSTRAINT `fk_invoice_payments_invoice` FOREIGN KEY (`invoice_id`) REFERENCES `invoice` (`id`) ON DELETE CASCADE;

--
-- Constraints for table `po_invoice_items`
--
ALTER TABLE `po_invoice_items`
  ADD CONSTRAINT `fk_po_invoice_items_invoice` FOREIGN KEY (`po_invoice_id`) REFERENCES `po_invoices` (`id`) ON DELETE CASCADE;

--
-- Constraints for table `purchase_order_items`
--
ALTER TABLE `purchase_order_items`
  ADD CONSTRAINT `purchase_order_items_ibfk_1` FOREIGN KEY (`purchase_order_id`) REFERENCES `purchase_orders` (`id`) ON DELETE CASCADE;

--
-- Constraints for table `user_sessions`
--
ALTER TABLE `user_sessions`
  ADD CONSTRAINT `user_sessions_ibfk_1` FOREIGN KEY (`user_id`) REFERENCES `user_settings` (`user_id`) ON DELETE CASCADE;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
