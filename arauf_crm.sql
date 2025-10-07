-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Host: 127.0.0.1
-- Generation Time: Oct 07, 2025 at 06:56 PM
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
(1, 'Payment', 'Payment of Employess Month of Sept', 'Income', 'Active', '2025-09-30', '2025-09-30 12:54:41', '2025-09-30 12:54:41'),
(2, 'Loan ', 'Liability - Loan ', 'Liability', 'Active', '2025-09-30', '2025-09-30 14:35:49', '2025-10-06 17:30:19'),
(3, 'Computer', 'Hardware Asset', 'Asset', 'Active', '2025-09-30', '2025-09-30 14:41:57', '2025-09-30 14:51:39'),
(4, 'Travel Expense', '', 'Expense', 'Active', '2025-09-30', '2025-09-30 14:49:34', '2025-09-30 14:49:34'),
(5, 'Computer loan ', '', 'Liability', 'Active', '2025-09-30', '2025-09-30 17:12:53', '2025-09-30 17:12:53');

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
  `stn` varchar(100) DEFAULT '',
  `ntn` varchar(100) DEFAULT '',
  `email` varchar(255) NOT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `customertable`
--

INSERT INTO `customertable` (`customer_id`, `customer`, `company`, `date`, `phone`, `address`, `stn`, `ntn`, `email`, `created_at`, `updated_at`) VALUES
(1, 'Muhammad Huinain', 'Digious', '2025-09-30', '+923435980052', '202 Floor Shan Residency SB-44 Block-K North Nazimabad karachi', '', '', 'm.hunainofficial@gmail.com', '2025-09-30 11:49:35', '2025-09-30 11:49:35'),
(2, 'XYZ', 'FAST', '2025-09-30', '03435980052', '504 Floor Shan Residency SB-44 Block-K North Nazimabad karachi', '', '', 'xyz@gmail.com', '2025-09-30 13:02:28', '2025-09-30 13:02:28'),
(3, 'MH', NULL, '2025-10-02', '+923435980052', 'Floor Shan Residency SB-44 Block-K North Nazimabad karachi', '1111111', '1111111', '19@gmail.com', '2025-10-02 13:16:16', '2025-10-02 13:16:16');

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
(2, 'Loan ', '2025-09-30', 'Digious Sol.', 5000.00, 'Loan ', 'Cash', 'Pending', '', '2025-09-30 14:37:44', '2025-09-30 16:37:31', NULL),
(3, 'Travel Expense ', '2025-09-30', 'Digious Sol.', 15000.00, 'Travel Expense', 'Cash', 'Paid', '', '2025-09-30 14:50:25', '2025-09-30 16:37:31', NULL),
(4, 'New Expense', '2025-09-30', 'Digious Sol.', 25000.00, 'Computer', 'Cash', 'Paid', '', '2025-09-30 14:51:33', '2025-09-30 16:37:31', NULL),
(5, 'computer loan ', '2025-10-02', 'xyz', 10000.00, 'Computer loan ', 'Cash', 'Paid', 'mmmmm', '2025-09-30 17:13:31', '2025-10-01 19:59:57', NULL);

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
(2, 'INV-2025-1759237352951', 2, 'XYZ', 'xyz@gmail.com', '03435980052', '', '504 Floor Shan Residency SB-44 Block-K North Nazimabad karachi', '', '', NULL, 0.00, 0.00, 'PKR', 0.00, 0.00, '2025-09-30', NULL, 'Within 15 days', '2025-10-01', 'this is another test ', 2500.00, 14.99, 374.75, 2874.75, 'Paid', 0, NULL, '2025-09-30 13:02:32', '2025-09-30 16:38:40'),
(3, 'INV-2025-1759237849385', 1, 'Muhammad Huinain', 'm.hunainofficial@gmail.com', '+923435980052', '', '202 Floor Shan Residency SB-44 Block-K North Nazimabad karachi', '', '', NULL, 0.00, 0.00, 'PKR', 0.00, 0.00, '2025-09-30', NULL, 'Within 15 days', '2025-09-30', 'Paid ', 1750.00, 12.00, 210.00, 1960.00, 'Paid', 0, NULL, '2025-09-30 13:10:49', '2025-09-30 13:10:49'),
(8, 'INV-2025-1759425800766', 3, 'MH', '19@gmail.com', '+923435980052', '', 'Floor Shan Residency SB-44 Block-K North Nazimabad karachi', '', '', NULL, 0.00, 0.00, 'PKR', 0.00, 0.00, '2025-09-30', NULL, 'Within 15 days', '2025-09-30', 'iiiiii', 512.82, 17.00, 87.18, 600.00, 'Pending', 0, NULL, '2025-10-02 17:23:20', '2025-10-02 17:37:29'),
(11, 'INV-2025-1759845903844', 3, 'MH', '19@gmail.com', '+923435980052', '', 'Floor Shan Residency SB-44 Block-K North Nazimabad karachi', '1111111', '1111111', NULL, 0.00, 0.00, 'PKR', 0.00, 0.00, '2025-10-07', NULL, 'Within 15 days', '2025-10-07', '', 500.00, 0.00, 0.00, 500.00, 'Pending', 0, NULL, '2025-10-07 14:05:03', '2025-10-07 14:05:03');

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
  `unit` varchar(50) DEFAULT NULL,
  `net_weight` decimal(10,2) DEFAULT NULL,
  `rate` decimal(10,2) NOT NULL,
  `amount` decimal(12,2) NOT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `invoice_items`
--

INSERT INTO `invoice_items` (`id`, `invoice_id`, `item_no`, `description`, `quantity`, `unit`, `net_weight`, `rate`, `amount`, `created_at`) VALUES
(2, 2, 1, 'this is another test ', 5, NULL, NULL, 500.00, 2500.00, '2025-09-30 13:02:32'),
(3, 3, 1, 'Tape Ball ', 5, NULL, NULL, 350.00, 1750.00, '2025-09-30 13:10:49'),
(12, 8, 1, 'iiiii', 1, 'Nos', NULL, 512.82, 512.82, '2025-10-02 17:37:29'),
(17, 11, 1, 'a', 1, '', NULL, 500.00, 500.00, '2025-10-07 14:05:03');

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
(1, 9, 'INV-PO-20250929-150543-1759154008024', 'PO-20250929-150543', 'Muhammad Hunain', 45000.00, '2025-09-29', '2025-09-30 12:11:01', 'Manual deletion via system', 'System User', NULL, '2025-09-30 12:11:01'),
(2, 8, 'INV-PO-20250929-150543-1759153841509', 'PO-20250929-150543', 'Muhammad Hunain', 5000.00, '2025-09-29', '2025-09-30 12:11:06', 'Manual deletion via system', 'System User', NULL, '2025-09-30 12:11:06'),
(3, 5, 'INV-PO-20250927-182905-1759009002676', 'PO-20250927-182905', 'Muhammad Hunain', 1000.00, '2025-09-27', '2025-09-30 12:11:23', 'Manual deletion via system', 'System User', NULL, '2025-09-30 12:11:23'),
(4, 4, 'INV-PO-20250927-182905-1758997206757', 'PO-20250927-182905', 'Muhammad Hunain', 1000.00, '2025-09-27', '2025-09-30 12:11:27', 'Manual deletion via system', 'System User', NULL, '2025-09-30 12:11:27'),
(5, 1, 'INV-PO-20250927-180053-1758985774235', 'PO-20250927-180053', 'ABC Textiles Ltd', 111111.00, '2025-09-27', '2025-09-30 12:11:31', 'Manual deletion via system', 'System User', NULL, '2025-09-30 12:11:31'),
(6, 13, 'INV25-9-001', 'PO-20250929-215641', '11', 111000.00, '2025-09-29', '2025-09-30 12:11:35', 'Manual deletion via system', 'System User', NULL, '2025-09-30 12:11:35'),
(7, 11, 'INV-PO-20250929-215641-1759165040127', 'PO-20250929-215641', '11', 100000.00, '2025-09-29', '2025-09-30 12:11:40', 'Manual deletion via system', 'System User', NULL, '2025-09-30 12:11:40'),
(8, 10, 'INV-PO-20250929-150543-1759162977238', 'PO-20250929-150543', 'Muhammad Hunain', 1220096.31, '2025-09-29', '2025-09-30 12:11:46', 'Manual deletion via system', 'System User', NULL, '2025-09-30 12:11:46'),
(9, 25, 'PI25-004', 'PO25-9-004', 'Hunain', 5000.00, '2025-09-30', '2025-10-01 14:56:40', 'PO cancelled - invoices automatically removed', 'System Trigger', NULL, '2025-10-01 14:56:40'),
(10, 26, 'PI25-004-1', 'PO25-9-004', 'Hunain', 20000.00, '2025-10-01', '2025-10-01 14:56:40', 'PO cancelled - invoices automatically removed', 'System Trigger', NULL, '2025-10-01 14:56:40'),
(11, 29, 'PI25-005', 'PO25-10-003', 'efg', 10.00, '2025-10-02', '2025-10-03 15:43:56', 'PO permanently deleted', 'System User', NULL, '2025-10-03 15:43:56');

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
(20, 'PI25-001', '2025-09-30', '2025-10-30', '18', 'PO25-9-002', 'Muhammad ', 'rizwan519@gmail.com', '03435980052', '504 Floor Shan Residency SB-44 Block-K North Nazimabad karachi', 19900.00, 19.90, 0.00, 19900.00, 'PKR', 'Paid', '2025-09-30', NULL, NULL, 'Generated from Purchase Order: PO25-9-002', '2025-09-30 12:20:42', '2025-09-30 13:22:27'),
(21, 'PI25-002', '2025-09-30', '2025-10-30', '17', 'PO25-9-001', 'Muhammad Hunain', 'm.hunainofficial@gmail.com', '03435980052', '202 Floor Shan Residency SB-44 Block-K North Nazimabad karachi', 15000.00, 15.00, 0.00, 15000.00, 'PKR', 'Paid', '2025-09-30', NULL, NULL, 'Generated from Purchase Order: PO25-9-001', '2025-09-30 12:31:15', '2025-09-30 12:52:06'),
(22, 'PI25-003', '2025-09-30', '2025-10-30', '19', 'PO25-9-003', 'Paysys', 'paysys@gmail.com', '03435980052', 'Shan Residency SB-44 Block-K North Nazimabad karachi', 340000.00, 11.70, 0.00, 340000.00, 'PKR', 'Paid', '2025-09-30', NULL, NULL, 'Generated from Purchase Order: PO25-9-003', '2025-09-30 14:46:31', '2025-09-30 14:46:48'),
(23, 'PI25-003-1', '2025-09-30', '2025-10-30', '19', 'PO25-9-003', 'Paysys', 'paysys@gmail.com', '03435980052', 'Shan Residency SB-44 Block-K North Nazimabad karachi', 1000000.00, 11.70, 0.00, 1000000.00, 'PKR', 'Not Sent', NULL, NULL, NULL, 'Generated from Purchase Order: PO25-9-003', '2025-09-30 14:47:43', '2025-10-02 20:28:27'),
(24, 'PI25-003-2', '2025-09-30', '2025-10-30', '19', 'PO25-9-003', 'Paysys', 'paysys@gmail.com', '03435980052', 'Shan Residency SB-44 Block-K North Nazimabad karachi', 21000000.00, 11.70, 2340000.00, 21000000.00, 'PKR', 'Paid', '2025-09-30', NULL, NULL, 'Generated from Purchase Order: PO25-9-003', '2025-09-30 16:35:51', '2025-09-30 16:36:07'),
(27, 'PI25-004', '2025-10-01', '2025-10-31', '24', 'PO25-10-001', 'Muhammad Hunain', 'ayesharizwan519@gmail.com', '03435980052', '504 Floor Shan Residency SB-44 Block-K North Nazimabad karachi', 50.00, 5.00, 0.00, 50.00, 'PKR', 'Paid', '2025-10-02', NULL, NULL, 'Generated from Purchase Order: PO25-10-001', '2025-10-01 17:42:15', '2025-10-02 21:07:30'),
(28, 'PI25-004-1', '2025-10-02', '2025-10-01', '24', 'PO25-10-001', 'Muhammad Hunain', 'ayesharizwan519@gmail.com', '03435980052', '504 Floor Shan Residency SB-44 Block-K North Nazimabad karachi', 1000.00, 5.00, 50.00, 1000.00, 'PKR', 'Overdue', NULL, NULL, NULL, 'Generated from Purchase Order: PO25-10-001', '2025-10-02 13:47:54', '2025-10-02 13:48:36');

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
(1, 23, 1, 'Textile Materials (Cotton Fabric)', 1000.00, 1000.00, 1000000.00, 'Premium quality cotton fabric as per PO requirements', '2025-09-30 18:49:08', '2025-09-30 18:49:08');

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
(25, 'PO-20250929-150451', 1.01, 0.00, 1.01, 0, NULL, '2025-09-29 13:24:55', '2025-09-30 11:55:00'),
(43, 'PO-20250929-150512', 1.11, 0.00, 1.11, 0, NULL, '2025-09-29 14:03:21', '2025-09-29 16:08:02'),
(45, 'PO-20250927-205007', 136886.31, 0.00, 136886.31, 0, NULL, '2025-09-29 14:29:20', '2025-09-29 14:29:20'),
(51, 'PO-20250929-194943', 56000.00, 0.00, 56000.00, 0, NULL, '2025-09-29 14:50:33', '2025-09-30 11:54:30'),
(67, 'PO-20250929-221636', 200.00, 0.00, 200.00, 0, NULL, '2025-09-29 17:22:23', '2025-09-30 11:53:50'),
(71, 'PO25-9-001', 115000.00, 15000.00, 100000.00, 1, '2025-09-30', '2025-09-29 21:20:00', '2025-09-30 12:52:35'),
(119, 'PO-20250927-182905', 0.00, 0.00, 0.00, 0, NULL, '2025-09-30 12:11:27', '2025-09-30 12:11:27'),
(120, 'PO-20250927-180053', 0.00, 0.00, 0.00, 0, NULL, '2025-09-30 12:11:31', '2025-09-30 12:11:31'),
(122, 'PO-20250929-215641', 0.00, 0.00, 0.00, 0, NULL, '2025-09-30 12:11:40', '2025-09-30 12:11:40'),
(123, 'PO-20250929-150543', 0.00, 0.00, 0.00, 0, NULL, '2025-09-30 12:11:46', '2025-09-30 12:11:46'),
(127, 'PO25-9-002', 119900.00, 19900.00, 100000.00, 1, '2025-09-30', '2025-09-30 12:17:28', '2025-10-03 15:34:49'),
(138, 'PO25-9-003', 22340000.00, 22340000.00, 0.00, 3, '2025-09-30', '2025-09-30 14:46:18', '2025-10-02 20:28:27'),
(158, 'PO25-10-001', 1050.00, 1050.00, 0.00, 2, '2025-10-01', '2025-10-01 17:42:02', '2025-10-02 21:07:30');

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
(17, 'PO25-9-001', '2025-09-30', 'Muhammad Hunain', 'm.hunainofficial@gmail.com', '03435980052', '202 Floor Shan Residency SB-44 Block-K North Nazimabad karachi', 100000.00, 15.00, 15000.00, 115000.00, 'PKR', 'Approved', NULL, 'this is test ', '2025-09-30 12:02:32', '2025-09-30 12:02:32'),
(18, 'PO25-9-002', '2025-09-30', 'Muhammad ', 'rizwan519@gmail.com', '03435980052', '504 Floor Shan Residency SB-44 Block-K North Nazimabad karachi', 100000.00, 19.90, 19900.00, 119900.00, 'PKR', 'Approved', NULL, '', '2025-09-30 12:03:21', '2025-09-30 12:03:21'),
(19, 'PO25-9-003', '2025-09-30', 'Paysys', 'paysys@gmail.com', '03435980052', 'Shan Residency SB-44 Block-K North Nazimabad karachi', 20000000.00, 11.70, 2340000.00, 22340000.00, 'PKR', 'Approved', NULL, 'approved by IT team ', '2025-09-30 14:46:10', '2025-09-30 14:46:10'),
(24, 'PO25-10-001', '2025-10-01', 'Muhammad Hunain', 'ayesharizwan519@gmail.com', '03435980052', '504 Floor Shan Residency SB-44 Block-K North Nazimabad karachi', 1000.00, 5.00, 50.00, 1050.00, 'PKR', 'Approved', NULL, '', '2025-10-01 17:36:57', '2025-10-01 17:49:57'),
(25, 'PO25-10-002', '2025-10-03', 'ABC', 'ABC@gmail.com', '03435980052', 'SB-44 Block-K North Nazimabad karachi', 15000.00, 20.00, 3000.00, 18000.00, 'PKR', 'Pending', NULL, 'iii', '2025-10-02 19:52:24', '2025-10-02 19:52:44'),
(27, 'PO25-10-003', '2025-10-06', 'Muhammad Hunain', 'ayesharizwan519@gmail.com', '03172178847', '202 Floor Shan Residency SB-44 Block-K North Nazimabad karachi', 1111.00, 1.00, 11.11, 1122.11, 'PKR', 'Pending', NULL, '', '2025-10-06 15:15:18', '2025-10-06 15:15:18');

--
-- Triggers `purchase_orders`
--
DELIMITER $$
CREATE TRIGGER `trg_po_delete_cleanup` BEFORE DELETE ON `purchase_orders` FOR EACH ROW BEGIN
    -- Create deletion history records for all related invoices
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
    )
    SELECT 
        pi.id,
        pi.invoice_number,
        pi.po_number,
        pi.customer_name,
        pi.total_amount,
        pi.invoice_date,
        NOW(),
        'PO permanently deleted - invoices automatically removed',
        'System Trigger'
    FROM po_invoices pi 
    WHERE pi.po_number = OLD.po_number;
    
    -- Delete related PO invoice items first (foreign key constraint)
    DELETE pii FROM po_invoice_items pii
    INNER JOIN po_invoices pi ON pii.po_invoice_id = pi.id
    WHERE pi.po_number = OLD.po_number;
    
    -- Delete PO invoices
    DELETE FROM po_invoices WHERE po_number = OLD.po_number;
    
    -- Clear PO invoice summary
    DELETE FROM po_invoice_summary WHERE po_number = OLD.po_number;
END
$$
DELIMITER ;
DELIMITER $$
CREATE TRIGGER `trg_po_status_change_cleanup` AFTER UPDATE ON `purchase_orders` FOR EACH ROW BEGIN
    -- Check if PO is being cancelled (new status is Cancelled and old status was not Cancelled)
    IF NEW.status = 'Cancelled' AND OLD.status != 'Cancelled' THEN
        -- Create deletion history records for all related invoices
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
        )
        SELECT 
            pi.id,
            pi.invoice_number,
            pi.po_number,
            pi.customer_name,
            pi.total_amount,
            pi.invoice_date,
            NOW(),
            'PO cancelled - invoices automatically removed',
            'System Trigger'
        FROM po_invoices pi 
        WHERE pi.po_number = NEW.po_number;
        
        -- Delete related PO invoice items first (foreign key constraint)
        DELETE pii FROM po_invoice_items pii
        INNER JOIN po_invoices pi ON pii.po_invoice_id = pi.id
        WHERE pi.po_number = NEW.po_number;
        
        -- Delete PO invoices
        DELETE FROM po_invoices WHERE po_number = NEW.po_number;
        
        -- Clear or delete PO invoice summary
        DELETE FROM po_invoice_summary WHERE po_number = NEW.po_number;
    END IF;
END
$$
DELIMITER ;
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
  `unit` varchar(50) DEFAULT NULL,
  `unit_price` decimal(15,2) NOT NULL,
  `amount` decimal(15,2) NOT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `purchase_order_items`
--

INSERT INTO `purchase_order_items` (`id`, `purchase_order_id`, `item_no`, `description`, `quantity`, `unit`, `unit_price`, `amount`, `created_at`, `updated_at`) VALUES
(18, 17, 1, 'this is test', 10000.00, 'pcs', 10.00, 100000.00, '2025-09-30 12:02:32', '2025-10-02 18:58:09'),
(19, 18, 1, 'this is another test', 10000.00, 'pcs', 10.00, 100000.00, '2025-09-30 12:03:21', '2025-10-02 18:58:09'),
(20, 19, 1, 'Computer i5 7 gen ', 10.00, 'pcs', 2000000.00, 20000000.00, '2025-09-30 14:46:10', '2025-10-02 18:58:09'),
(28, 24, 1, 'mmm', 1.00, 'pcs', 1000.00, 1000.00, '2025-10-01 17:49:57', '2025-10-02 18:58:09'),
(31, 25, 1, 'aaa', 1.00, 'NOS', 5000.00, 5000.00, '2025-10-02 19:52:44', '2025-10-02 19:52:44'),
(32, 25, 2, 'bbb', 1.00, 'JOB', 10000.00, 10000.00, '2025-10-02 19:52:44', '2025-10-02 19:52:44'),
(34, 27, 1, 'mm', 1.00, 'pcs', 1111.00, 1111.00, '2025-10-06 15:15:18', '2025-10-06 15:15:18');

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
('01', '2025-09-30', 'Muhammad Huinain', 150000.00, 'Pending'),
('02', '2025-09-30', 'hunain ', 1000000.00, 'Pending'),
('03', '2025-10-01', 'Muhammad Huinain', 15000.00, 'Pending');

-- --------------------------------------------------------

--
-- Table structure for table `users`
--

CREATE TABLE `users` (
  `id` int(11) NOT NULL,
  `firstName` text NOT NULL,
  `lastName` text NOT NULL,
  `email` text NOT NULL,
  `password` text NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `users`
--

INSERT INTO `users` (`id`, `firstName`, `lastName`, `email`, `password`) VALUES
(2, 'Muhammad', 'Hunain', 'm.hunainofficial@gmail.com', 'Karachi@123'),
(3, 'Muhammad', 'Ahmed', 'digious.Sol@gmail.com', 'Pakistan@123');

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
  `updated_at` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp(),
  `profile_picture` varchar(255) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `user_settings`
--

INSERT INTO `user_settings` (`id`, `user_id`, `first_name`, `last_name`, `email`, `phone`, `company`, `address`, `profile_picture_url`, `job_title`, `bio`, `timezone`, `language`, `currency_preference`, `date_format`, `two_factor_enabled`, `email_notifications`, `marketing_emails`, `theme_preference`, `dashboard_layout`, `created_at`, `updated_at`, `profile_picture`) VALUES
(1, 2, NULL, NULL, '', '03435980052', 'A Rauf Textile', 'North Khi Block K', 'user_2_1759856151414.png', NULL, NULL, 'UTC+5', 'en', 'PKR', 'YYYY-MM-DD', 0, 1, 1, 'light', NULL, '2025-10-01 16:53:22', '2025-10-07 16:55:51', 'user_2_1759494851048.png');

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
  ADD PRIMARY KEY (`customer_id`),
  ADD KEY `idx_customertable_phone` (`phone`),
  ADD KEY `idx_customertable_email` (`email`),
  ADD KEY `idx_customertable_stn_ntn` (`stn`,`ntn`);

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
-- Indexes for table `users`
--
ALTER TABLE `users`
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
  ADD KEY `idx_email` (`email`),
  ADD KEY `idx_user_settings_user_id` (`user_id`);

--
-- AUTO_INCREMENT for dumped tables
--

--
-- AUTO_INCREMENT for table `categories`
--
ALTER TABLE `categories`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=7;

--
-- AUTO_INCREMENT for table `company_settings`
--
ALTER TABLE `company_settings`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `customertable`
--
ALTER TABLE `customertable`
  MODIFY `customer_id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=6;

--
-- AUTO_INCREMENT for table `expenses`
--
ALTER TABLE `expenses`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=7;

--
-- AUTO_INCREMENT for table `invoice`
--
ALTER TABLE `invoice`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=12;

--
-- AUTO_INCREMENT for table `invoice_items`
--
ALTER TABLE `invoice_items`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=18;

--
-- AUTO_INCREMENT for table `invoice_payments`
--
ALTER TABLE `invoice_payments`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `po_deletion_history`
--
ALTER TABLE `po_deletion_history`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=12;

--
-- AUTO_INCREMENT for table `po_invoices`
--
ALTER TABLE `po_invoices`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=30;

--
-- AUTO_INCREMENT for table `po_invoice_items`
--
ALTER TABLE `po_invoice_items`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=2;

--
-- AUTO_INCREMENT for table `po_invoice_summary`
--
ALTER TABLE `po_invoice_summary`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=177;

--
-- AUTO_INCREMENT for table `purchase_orders`
--
ALTER TABLE `purchase_orders`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=28;

--
-- AUTO_INCREMENT for table `purchase_order_items`
--
ALTER TABLE `purchase_order_items`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=35;

--
-- AUTO_INCREMENT for table `users`
--
ALTER TABLE `users`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=4;

--
-- AUTO_INCREMENT for table `user_sessions`
--
ALTER TABLE `user_sessions`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `user_settings`
--
ALTER TABLE `user_settings`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=69;

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
