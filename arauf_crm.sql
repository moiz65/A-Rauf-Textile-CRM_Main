-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Host: localhost
-- Generation Time: Nov 27, 2025 at 02:59 PM
-- Server version: 10.4.32-MariaDB
-- PHP Version: 8.2.12

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
-- Table structure for table `accounts_payable`
--

CREATE TABLE `accounts_payable` (
  `id` int(11) NOT NULL,
  `supplier_id` int(11) NOT NULL,
  `supplier_name` varchar(255) NOT NULL,
  `supplier_email` varchar(255) DEFAULT NULL,
  `supplier_phone` varchar(50) DEFAULT NULL,
  `po_id` int(11) DEFAULT NULL,
  `po_number` varchar(50) DEFAULT NULL,
  `po_date` date DEFAULT NULL,
  `due_date` date DEFAULT NULL,
  `invoice_amount` decimal(15,2) NOT NULL,
  `amount_paid` decimal(15,2) DEFAULT 0.00,
  `amount_due` decimal(15,2) NOT NULL,
  `aging_days` int(11) DEFAULT 0,
  `aging_status` enum('Current','30+ Days','60+ Days','90+ Days','120+ Days') DEFAULT 'Current',
  `status` enum('Open','Partial','Paid','Overdue','Cancelled') DEFAULT 'Open',
  `currency` varchar(10) DEFAULT 'PKR',
  `notes` text DEFAULT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Table structure for table `accounts_receivable`
--

CREATE TABLE `accounts_receivable` (
  `id` int(11) NOT NULL,
  `customer_id` int(11) NOT NULL,
  `customer_name` varchar(255) NOT NULL,
  `invoice_id` int(11) DEFAULT NULL,
  `invoice_number` varchar(50) DEFAULT NULL,
  `invoice_date` date DEFAULT NULL,
  `due_date` date DEFAULT NULL,
  `invoice_amount` decimal(15,2) NOT NULL,
  `amount_paid` decimal(15,2) DEFAULT 0.00,
  `amount_due` decimal(15,2) NOT NULL,
  `aging_days` int(11) DEFAULT 0,
  `aging_status` enum('Current','30+ Days','60+ Days','90+ Days','120+ Days') DEFAULT 'Current',
  `status` enum('Open','Partial','Paid','Overdue','Cancelled') DEFAULT 'Open',
  `currency` varchar(10) DEFAULT 'PKR',
  `notes` text DEFAULT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

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
(5, 'Computer loan ', '', 'Liability', 'Active', '2025-09-30', '2025-09-30 17:12:53', '2025-09-30 17:12:53'),
(7, 'educational loan ', 'aaaa', 'Expense', 'Active', '2025-10-08', '2025-10-08 18:40:43', '2025-10-08 18:40:43'),
(8, 'Muhammad Hunain', '', 'Expense', 'Active', '2025-10-08', '2025-10-08 18:47:57', '2025-10-08 18:47:57');

-- --------------------------------------------------------

--
-- Table structure for table `chart_of_accounts`
--

CREATE TABLE `chart_of_accounts` (
  `id` int(11) NOT NULL,
  `account_code` varchar(50) NOT NULL,
  `account_name` varchar(255) NOT NULL,
  `account_type` enum('Asset','Liability','Equity','Income','Expense','Receivable','Payable') NOT NULL,
  `category` varchar(100) NOT NULL,
  `description` text DEFAULT NULL,
  `opening_balance` decimal(15,2) DEFAULT 0.00,
  `current_balance` decimal(15,2) DEFAULT 0.00,
  `status` enum('Active','Inactive') DEFAULT 'Active',
  `parent_account_id` int(11) DEFAULT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

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
(3, 'MH', 'XYZ', '2025-10-14', '+9234359800521', 'Floor Shan Residency SB-44 Block-K North Nazimabad karachi', '1111111', '1111111', '19@gmail.com', '2025-10-02 13:16:16', '2025-10-14 14:22:50'),
(7, 'Digious Sol', 'Digious Solution pvt ltd', '2025-11-12', '0987543211', 'North Nazimabad Karachi', '9876543', '1235678', 'sol@gmail.com', '2025-11-12 18:27:40', '2025-11-12 18:27:40'),
(13, 'test', 'test456', '2025-11-21', '456', 'test456', 'test456', 'test4561', 'test456@gmail.com', '2025-11-21 18:40:38', '2025-11-21 18:40:38'),
(17, 'Abdul Moiz', 'Digious Solution', '2025-11-27', '123456', 'block H', '1234', '5678', 'moiz@gmail.com', '2025-11-26 18:31:46', '2025-11-26 18:31:46');

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
(5, 'computer loan ', '2025-10-02', 'xyz', 10000.00, 'Computer loan ', 'Cash', 'Paid', 'mmmmm', '2025-09-30 17:13:31', '2025-10-01 19:59:57', NULL),
(7, 'aaa111', '2025-10-08', 'mmm', 500.00, 'educational loan ', 'Cash', 'Pending', '', '2025-10-08 18:41:08', '2025-10-08 18:41:08', NULL),
(8, ',bbb', '2025-10-08', 'bbbb', 51.00, 'Muhammad Hunain', 'Cash', 'Paid', '', '2025-10-08 18:48:19', '2025-10-08 18:48:19', NULL);

-- --------------------------------------------------------

--
-- Table structure for table `general_ledger`
--

CREATE TABLE `general_ledger` (
  `id` int(11) NOT NULL,
  `transaction_date` date NOT NULL,
  `voucher_number` varchar(50) NOT NULL,
  `voucher_type` enum('Invoice','Payment','Expense','Receipt','Transfer','Adjustment') NOT NULL,
  `account_id` int(11) NOT NULL,
  `reference_id` int(11) DEFAULT NULL,
  `reference_type` varchar(50) DEFAULT NULL COMMENT 'invoice_id, expense_id, payment_id, etc.',
  `description` text NOT NULL,
  `debit_amount` decimal(15,2) DEFAULT 0.00,
  `credit_amount` decimal(15,2) DEFAULT 0.00,
  `running_balance` decimal(15,2) DEFAULT 0.00,
  `posted_by` int(11) DEFAULT NULL,
  `is_posted` tinyint(1) DEFAULT 1,
  `notes` text DEFAULT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

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
  `updated_at` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp(),
  `payment_days` int(11) DEFAULT 30 COMMENT 'Number of days for payment terms (default 30 days)'
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `invoice`
--

INSERT INTO `invoice` (`id`, `invoice_number`, `customer_id`, `customer_name`, `customer_email`, `p_number`, `a_p_number`, `address`, `st_reg_no`, `ntn_number`, `item_name`, `quantity`, `rate`, `currency`, `salesTax`, `item_amount`, `bill_date`, `delivery_date`, `terms_of_payment`, `payment_deadline`, `note`, `subtotal`, `tax_rate`, `tax_amount`, `total_amount`, `status`, `is_sent`, `sent_at`, `created_at`, `updated_at`, `payment_days`) VALUES
(2, 'INV-2025-1759237352951', 2, 'XYZ', 'xyz@gmail.com', '03435980052', '', '504 Floor Shan Residency SB-44 Block-K North Nazimabad karachi', '', '', NULL, 0.00, 0.00, 'PKR', 0.00, 0.00, '2025-09-30', NULL, 'Within 15 days', '2025-10-01', 'this is another test ', 2500.00, 14.99, 374.75, 2874.75, 'Paid', 0, NULL, '2025-09-30 13:02:32', '2025-09-30 16:38:40', 30),
(3, 'INV-2025-1759237849385', 1, 'Muhammad Huinain', 'm.hunainofficial@gmail.com', '+923435980052', '', '202 Floor Shan Residency SB-44 Block-K North Nazimabad karachi', '', '', NULL, 0.00, 0.00, 'PKR', 0.00, 0.00, '2025-09-30', NULL, 'Within 15 days', '2025-09-30', 'Paid ', 1750.00, 12.00, 210.00, 1960.00, 'Paid', 0, NULL, '2025-09-30 13:10:49', '2025-09-30 13:10:49', 30),
(8, 'INV-2025-1759425800766', 3, 'MH', '19@gmail.com', '+923435980052', '', 'Floor Shan Residency SB-44 Block-K North Nazimabad karachi', '', '', NULL, 0.00, 0.00, 'PKR', 0.00, 0.00, '2025-09-30', NULL, 'Within 15 days', '2025-09-30', 'iiiiii', 512.82, 17.00, 87.18, 600.00, 'Pending', 0, NULL, '2025-10-02 17:23:20', '2025-10-02 17:37:29', 30),
(11, 'INV-2025-1759845903844', 3, 'MH', '19@gmail.com', '+923435980052', '', 'Floor Shan Residency SB-44 Block-K North Nazimabad karachi', '1111111', '1111111', NULL, 0.00, 0.00, 'PKR', 0.00, 0.00, '2025-10-07', NULL, 'Within 15 days', '2025-10-07', '', 500.00, 0.00, 0.00, 500.00, 'Pending', 0, NULL, '2025-10-07 14:05:03', '2025-10-07 14:05:03', 30),
(12, 'INV-2025-1760443020181', 3, 'MH', '19@gmail.com', '+923435980052', '', 'Floor Shan Residency SB-44 Block-K North Nazimabad karachi', '1111111', '1111111', NULL, 0.00, 0.00, 'PKR', 0.00, 0.00, '2025-10-14', NULL, 'Within 15 days', '2025-10-29', '', 1111.00, 1.00, 11.11, 1122.11, 'Pending', 0, NULL, '2025-10-14 11:57:00', '2025-10-14 11:57:00', 15),
(14, 'INV-2025-1760443882789', 3, 'MH', '19@gmail.com', '+923435980052', '', 'Floor Shan Residency SB-44 Block-K North Nazimabad karachi', '1111111', '1111111', NULL, 0.00, 0.00, 'PKR', 0.00, 0.00, '2025-10-12', NULL, 'Within 15 days', '0000-00-00', '', 12221.00, 0.00, 0.00, 12221.00, 'Paid', 0, NULL, '2025-10-14 12:11:22', '2025-10-14 12:43:03', 10),
(18, 'INV-2025-1762278399628', 3, 'MH', '19@gmail.com', '+9234359800521', '', 'Floor Shan Residency SB-44 Block-K North Nazimabad karachi', '1111111', '1111111', NULL, 0.00, 0.00, 'PKR', 0.00, 0.00, '2025-11-04', NULL, 'Within 15 days', '2025-12-04', '', 2221.99, 10.00, 222.20, 2444.19, 'Pending', 0, NULL, '2025-11-04 17:46:39', '2025-11-04 17:46:39', 30),
(19, 'INV-2025-1762972128956', 7, 'Digious Sol', 'sol@gmail.com', '0987543211', '', 'North Nazimabad Karachi', '9876543', '1235678', NULL, 0.00, 0.00, 'PKR', 0.00, 0.00, '2025-11-11', NULL, 'Within 15 days', '2025-11-21', '', 99000.00, 18.00, 17820.00, 116820.00, 'Paid', 0, NULL, '2025-11-12 18:28:48', '2025-11-19 16:21:01', 10),
(20, 'INV-2025-1762972208966', 7, 'Digious Sol', 'sol@gmail.com', '0987543211', '', 'North Nazimabad Karachi', '9876543', '1235678', NULL, 0.00, 0.00, 'PKR', 0.00, 0.00, '2025-11-03', NULL, 'Within 15 days', '2025-11-10', 'this is Overdue test', 200000.00, 18.00, 36000.00, 236000.00, 'Overdue', 0, NULL, '2025-11-12 18:30:08', '2025-11-12 18:30:08', 7),
(21, 'INV-2025-1763567376710', 7, 'Digious Sol', 'sol@gmail.com', '0987543211', '', 'North Nazimabad Karachi', '9876543', '1235678', NULL, 0.00, 0.00, 'PKR', 0.00, 0.00, '2025-11-19', NULL, 'Within 15 days', '2025-12-19', 'Test auto ledger', 50000.00, 18.00, 9000.00, 59000.00, 'Paid', 0, NULL, '2025-11-19 15:49:36', '2025-11-19 15:52:46', 30),
(22, 'INV-2025-1763569302847', 3, 'MH', '19@gmail.com', '+923435980052', '', 'Floor Shan Residency SB-44 Block-K North Nazimabad karachi', '1111111', '1111111', NULL, 0.00, 0.00, 'PKR', 0.00, 0.00, '2025-11-19', NULL, 'Within 15 days', '2025-12-04', 'Test 2: Material B unpaid', 75000.00, 10.00, 7500.00, 82500.00, 'Pending', 0, NULL, '2025-11-19 16:21:42', '2025-11-19 16:21:42', 15),
(24, 'INV-2025-1763571656835', NULL, 'Test double ledger', 'test@example.com', '1234567890', '', 'Test Address', 'TEST123', 'NTN123', NULL, 0.00, 0.00, 'PKR', 0.00, 0.00, '2025-11-18', NULL, 'Within 15 days', '2025-12-18', 'Test separate entries', 100000.00, 18.00, 18000.00, 118000.00, 'Paid', 0, NULL, '2025-11-19 17:00:56', '2025-11-19 17:02:13', 30),
(25, 'INV-2025-1763658776755', NULL, 'testing user', 'testinguser@gmail.com', '0987654321', '', 'testing user', '12435687', '0981237465', NULL, 0.00, 0.00, 'PKR', 0.00, 0.00, '2025-11-19', NULL, 'Within 15 days', '2025-12-19', '', 10000.00, 18.00, 1800.00, 11800.00, 'Paid', 0, NULL, '2025-11-20 17:12:56', '2025-11-20 17:22:34', 30),
(26, 'INV-2025-1763666177540', 3, 'MH', '19@gmail.com', '12345', '', 'Test Address', '', '', NULL, 0.00, 0.00, 'PKR', 0.00, 0.00, '2025-11-20', NULL, 'Within 15 days', '2025-12-20', 'Test complete flow', 10000.00, 18.00, 1800.00, 11800.00, 'Paid', 0, NULL, '2025-11-20 19:16:17', '2025-11-20 19:16:50', 30),
(28, 'INV-2025-1763735687885', NULL, 'test', 'testinguser@gmail.com', '0987654321', '', 'test@gmail.com', '0129384567', '987650123', NULL, 0.00, 0.00, 'PKR', 0.00, 0.00, '2025-11-20', NULL, 'Within 15 days', '2025-12-20', '', 1221.00, 10.00, 122.10, 1343.10, 'Paid', 0, NULL, '2025-11-21 14:34:47', '2025-11-21 14:38:25', 30),
(29, 'INV-2025-1763738752977', 3, 'MH', '19@gmail.com', '12345', '', 'Test Address', '', '', NULL, 0.00, 0.00, 'PKR', 0.00, 0.00, '2025-11-21', NULL, 'Within 15 days', '2025-12-21', 'Test ledger entry count', 5000.00, 18.00, 900.00, 5900.00, 'Pending', 0, NULL, '2025-11-21 15:25:52', '2025-11-21 15:25:52', 30),
(30, 'INV-2025-1763739606127', 3, 'MH', '19@gmail.com', '12345', '', 'Test Address', '', '', NULL, 0.00, 0.00, 'PKR', 0.00, 0.00, '2025-11-21', NULL, 'Within 15 days', '2025-12-21', 'FINAL TEST - Marked as PAID', 1221.00, 10.00, 122.10, 1343.10, 'Paid', 0, NULL, '2025-11-21 15:40:06', '2025-11-21 15:43:22', 30),
(31, 'INV-2025-1763745514695', NULL, 'test', 'Hunain122aa@gmail.com', '01987654563', '', 'Hunain122aaasd', '12345654321', '09876567890', NULL, 0.00, 0.00, 'PKR', 0.00, 0.00, '2025-11-20', NULL, 'Within 15 days', '2025-12-20', '', 14808.00, 8.00, 1184.64, 15992.64, 'Paid', 0, NULL, '2025-11-21 17:18:34', '2025-11-21 17:19:02', 30),
(32, 'INV-2025-1763745994631', NULL, 'test', 'Hunain122aa@gmail.com', '01987654563', '', 'Hunain122aaasd', '12345654321', '09876567890', NULL, 0.00, 0.00, 'PKR', 0.00, 0.00, '2025-11-20', NULL, 'Within 15 days', '2025-12-20', '', 12300.00, 10.00, 1230.00, 13530.00, 'Paid', 0, NULL, '2025-11-21 17:26:34', '2025-11-21 17:27:14', 30),
(33, 'INV-2025-1763746577544', NULL, 'test', 'Hunain122aa@gmail.com', '01987654563', '', 'Hunain122aaasd', '12345654321', '09876567890', NULL, 0.00, 0.00, 'PKR', 0.00, 0.00, '2025-11-21', NULL, 'Within 15 days', '2025-12-21', '', 1230.00, 10.00, 123.00, 1353.00, 'Paid', 0, NULL, '2025-11-21 17:36:17', '2025-11-21 17:36:17', 30),
(34, 'INV-2025-1763750477000', 13, 'test', 'test456@gmail.com', '456', '', 'test456', 'test456', 'test4561', NULL, 0.00, 0.00, 'PKR', 0.00, 0.00, '2025-11-20', NULL, 'Within 15 days', '2025-12-20', '', 45600.00, 10.00, 4560.00, 50160.00, 'Paid', 0, NULL, '2025-11-21 18:41:17', '2025-11-21 18:41:51', 30),
(35, 'INV-2025-1763751663719', 13, 'test', 'test456@gmail.com', '456', '', 'test456', 'test456', 'test4561', NULL, 0.00, 0.00, 'PKR', 0.00, 0.00, '2025-11-20', NULL, 'Within 15 days', '2025-12-20', '', 13653.00, 0.00, 0.00, 13653.00, 'Paid', 0, NULL, '2025-11-21 19:01:03', '2025-11-21 19:01:39', 30),
(36, 'INV-2025-1763751869054', 13, 'test', 'test456@gmail.com', '456', '', 'test456', 'test456', 'test4561', NULL, 0.00, 0.00, 'PKR', 0.00, 0.00, '2025-11-20', NULL, 'Within 15 days', '2025-12-20', '', 500.00, 10.00, 50.00, 550.00, 'Paid', 0, NULL, '2025-11-21 19:04:29', '2025-11-21 19:06:04', 30),
(37, 'INV-37', 13, 'test', 'test456@gmail.com', '456', '', 'test456', 'test456', 'test4561', NULL, 0.00, 0.00, 'PKR', 0.00, 0.00, '2025-11-23', NULL, 'Within 15 days', '2025-12-23', '', 10000.00, 18.00, 1800.00, 11800.00, 'Paid', 0, NULL, '2025-11-24 17:44:02', '2025-11-24 18:01:47', 30),
(38, 'INV-38', NULL, 'HUNAIN', 'Hunain122a@gmail.com', '09874567', '', 'Hunain122aa@gmail.com', '18920398465', '09123456', NULL, 0.00, 0.00, 'PKR', 0.00, 0.00, '2025-11-25', NULL, 'Within 15 days', '2025-12-25', '', 1000.00, 18.00, 180.00, 1180.00, 'Paid', 0, NULL, '2025-11-26 12:08:31', '2025-11-26 12:08:55', 30);

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
(17, 11, 1, 'a', 1, '', NULL, 500.00, 500.00, '2025-10-07 14:05:03'),
(18, 12, 1, 'aaa', 1, '', 15.00, 1111.00, 1111.00, '2025-10-14 11:57:00'),
(22, 14, 1, 'aaa', 11, '', 15.00, 1111.00, 12221.00, '2025-10-14 12:43:03'),
(27, 18, 1, 'aaa1', 1, '', 1.00, 1110.99, 1110.99, '2025-11-04 17:46:39'),
(28, 18, 2, 'bbb2', 1, '', 1.00, 1111.00, 1111.00, '2025-11-04 17:46:39'),
(30, 20, 1, 'Printed Layout design', 100, '', 35.00, 2000.00, 200000.00, '2025-11-12 18:30:08'),
(32, 21, 1, 'Textile Material A', 100, 'Meters', 0.00, 500.00, 50000.00, '2025-11-19 15:52:46'),
(33, 19, 1, 'Cotton Fabric ', 50, '', 70.00, 1980.00, 99000.00, '2025-11-19 16:21:01'),
(34, 22, 1, 'Material B', 150, 'Meters', 0.00, 500.00, 75000.00, '2025-11-19 16:21:42'),
(37, 24, 1, 'Test Material XYZ', 100, 'Meters', 0.00, 1000.00, 100000.00, '2025-11-19 17:02:13'),
(39, 25, 1, 'qwert', 100, '', 100.00, 100.00, 10000.00, '2025-11-20 17:22:34'),
(41, 26, 1, 'Material A', 100, 'Meters', 0.00, 100.00, 10000.00, '2025-11-20 19:16:50'),
(44, 28, 1, 'test1', 111, '', 10.00, 11.00, 1221.00, '2025-11-21 14:38:25'),
(45, 29, 1, 'Test Product', 50, 'pcs', 0.00, 100.00, 5000.00, '2025-11-21 15:25:52'),
(47, 30, 1, 'Test Material', 10, 'pcs', 0.00, 122.10, 1221.00, '2025-11-21 15:43:22'),
(49, 31, 1, 'asdf', 1234, '', 12.00, 12.00, 14808.00, '2025-11-21 17:19:02'),
(51, 32, 1, 'qaz', 123, '', 10.00, 100.00, 12300.00, '2025-11-21 17:27:14'),
(52, 33, 1, 'oipui', 123, '', 1.00, 10.00, 1230.00, '2025-11-21 17:36:17'),
(54, 34, 1, '123', 456, '', 12.00, 100.00, 45600.00, '2025-11-21 18:41:51'),
(56, 35, 1, 'test2', 111, '', 10.00, 123.00, 13653.00, '2025-11-21 19:01:39'),
(58, 36, 1, 'testmoi', 50, '', 10.00, 10.00, 500.00, '2025-11-21 19:06:04'),
(60, 37, 1, 'this is test', 100, '', 1.00, 100.00, 10000.00, '2025-11-24 18:01:47'),
(62, 38, 1, 'this is invoice test', 100, '', 10.00, 10.00, 1000.00, '2025-11-26 12:08:55');

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
-- Table structure for table `ledger_entries`
--

CREATE TABLE `ledger_entries` (
  `entry_id` int(11) NOT NULL,
  `customer_id` int(11) NOT NULL,
  `entry_date` date NOT NULL,
  `description` varchar(500) DEFAULT NULL,
  `bill_no` varchar(100) DEFAULT NULL,
  `payment_mode` varchar(50) DEFAULT 'Cash',
  `cheque_no` varchar(100) DEFAULT NULL,
  `debit_amount` decimal(15,2) DEFAULT 0.00,
  `credit_amount` decimal(15,2) DEFAULT 0.00,
  `balance` decimal(15,2) DEFAULT 0.00,
  `status` varchar(50) DEFAULT 'paid',
  `due_date` date DEFAULT NULL,
  `has_multiple_items` tinyint(1) DEFAULT 0,
  `sales_tax_rate` decimal(5,2) DEFAULT 0.00,
  `sales_tax_amount` decimal(15,2) DEFAULT 0.00,
  `sequence` decimal(10,1) DEFAULT 1.0,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `ledger_entries`
--

INSERT INTO `ledger_entries` (`entry_id`, `customer_id`, `entry_date`, `description`, `bill_no`, `payment_mode`, `cheque_no`, `debit_amount`, `credit_amount`, `balance`, `status`, `due_date`, `has_multiple_items`, `sales_tax_rate`, `sales_tax_amount`, `sequence`, `created_at`, `updated_at`) VALUES
(22, 3, '2025-11-10', 'CF', 'SB44', 'Cash', NULL, 0.00, 111.00, -111.00, 'draft', NULL, 0, 11.00, 0.00, 1.0, '2025-11-10 10:07:27', '2025-11-10 10:07:27'),
(23, 3, '2025-11-10', 'Sales Tax @ 11%', 'TAX-SB44', 'Cash', NULL, 0.00, 12.21, -123.21, 'draft', NULL, 0, 0.00, 0.00, 2.0, '2025-11-10 10:07:27', '2025-11-10 10:07:27'),
(31, 3, '2025-11-10', 'CF', 'SB-44', 'Cash', NULL, 0.00, 1000.00, -1123.21, 'paid', NULL, 0, 10.00, 0.00, 3.0, '2025-11-10 11:21:17', '2025-11-10 11:21:17'),
(32, 3, '2025-11-10', 'Sales Tax @ 10%', 'TAX-SB-44', 'Cash', NULL, 0.00, 100.00, -1223.21, 'paid', NULL, 0, 0.00, 0.00, 4.0, '2025-11-10 11:21:17', '2025-11-10 11:21:17'),
(35, 3, '2025-11-11', 'CF', 'INV-J.', 'Cash', NULL, 0.00, 500.00, -1723.21, 'paid', NULL, 0, 10.00, 0.00, 1.0, '2025-11-11 18:43:50', '2025-11-11 18:43:50'),
(36, 3, '2025-11-11', 'Sales Tax @ 10%', 'TAX-INV-J.', 'Cash', NULL, 0.00, 50.00, -1773.21, 'paid', NULL, 0, 0.00, 0.00, 2.0, '2025-11-11 18:43:50', '2025-11-11 18:43:50'),
(39, 3, '2025-11-12', 'qwerty', 'qwert', 'Cash', NULL, 15129.00, 0.00, 13355.79, 'paid', NULL, 0, 10.00, 0.00, 1.0, '2025-11-12 15:17:12', '2025-11-12 15:24:13'),
(41, 3, '2025-11-12', 'qwerty', 'qwe123', 'Cash', NULL, 1522756.00, 0.00, 1536111.79, 'paid', NULL, 0, 10.00, 0.00, 2.0, '2025-11-12 15:19:59', '2025-11-12 15:24:13'),
(43, 3, '2025-11-12', 'hhggg', 'bbhhh', 'Cash', NULL, 15129.00, 0.00, 1551240.79, 'paid', NULL, 0, 10.00, 0.00, 3.0, '2025-11-12 15:26:50', '2025-11-12 15:26:50'),
(44, 3, '2025-11-12', 'Sales Tax @ 10%', 'TAX-bbhhh', 'Cash', NULL, 1512.90, 0.00, 1552753.69, 'paid', NULL, 0, 0.00, 1512.90, 4.0, '2025-11-12 15:26:50', '2025-11-12 15:26:50'),
(45, 3, '2025-11-12', 'Sales Tax (0%) - Sales Tax @ 10%', 'TAX-bbhhh', 'Cash', NULL, 1512.90, 0.00, 1554266.59, 'paid', NULL, 0, 0.00, 0.00, 4.5, '2025-11-12 15:26:50', '2025-11-12 15:26:50'),
(46, 3, '2025-11-12', 'invgt', 'invgt', 'Cheque', '12345', 8800.00, 0.00, 1563066.59, 'paid', NULL, 1, 0.00, 0.00, 5.5, '2025-11-12 18:23:24', '2025-11-12 18:23:24'),
(47, 7, '2025-11-13', 'Printed Lawn', 'JFg-5037', 'Cash', NULL, 0.00, 675000.00, -675000.00, 'paid', NULL, 0, 18.00, 0.00, 1.0, '2025-11-12 18:39:02', '2025-11-12 18:39:02'),
(48, 7, '2025-11-13', 'Sales Tax @ 18%', 'TAX-JFg-5037', 'Cash', NULL, 0.00, 121500.00, -796500.00, 'paid', NULL, 0, 0.00, 0.00, 2.0, '2025-11-12 18:39:02', '2025-11-12 18:39:02'),
(49, 7, '2025-11-13', 'mnhunain', 'qwerty', 'Online', '98765', 5000.00, 0.00, -791500.00, 'paid', NULL, 0, 10.00, 0.00, 3.0, '2025-11-12 20:53:48', '2025-11-12 20:53:48'),
(50, 7, '2025-11-13', 'Sales Tax @ 10%', 'TAX-qwerty', 'Online', NULL, 500.00, 0.00, -791000.00, 'paid', NULL, 0, 0.00, 500.00, 4.0, '2025-11-12 20:53:48', '2025-11-12 20:53:48'),
(51, 7, '2025-11-13', 'Sales Tax (0%) - Sales Tax @ 10%', 'TAX-qwerty', 'Online', NULL, 500.00, 0.00, -790500.00, 'paid', NULL, 0, 0.00, 0.00, 4.5, '2025-11-12 20:53:48', '2025-11-12 20:53:48'),
(52, 7, '2025-11-18', 'CTO', 'Adidas Recv-89', 'Online', '12345', 0.00, 1000.00, -676000.00, 'paid', NULL, 0, 18.00, 0.00, 1.0, '2025-11-18 18:30:30', '2025-11-18 18:30:30'),
(53, 7, '2025-11-18', 'Sales Tax @ 18%', 'TAX-Adidas Recv-89', 'Online', NULL, 0.00, 180.00, -675180.00, 'paid', NULL, 0, 0.00, 0.00, 2.0, '2025-11-18 18:30:30', '2025-11-18 18:30:30'),
(54, 1, '2025-11-19', 'Material A - Cotton Fabric', 'INV-TEST-001', 'Cash', NULL, 100000.00, 0.00, 100000.00, 'pending', '2025-12-19', 0, 0.00, 0.00, 1.0, '2025-11-19 14:32:07', '2025-11-19 14:32:07'),
(55, 1, '2025-11-20', 'Payment for INV-TEST-001', 'INV-TEST-001', 'Online', '12345', 0.00, 100000.00, 0.00, 'paid', NULL, 0, 0.00, 0.00, 1.0, '2025-11-19 14:32:19', '2025-11-19 14:32:19'),
(56, 1, '2025-11-19', 'Material B - Polyester Fabric', 'INV-TEST-002', 'Cash', NULL, 250000.00, 0.00, 250000.00, 'pending', '2025-12-19', 0, 0.00, 0.00, 2.0, '2025-11-19 14:36:14', '2025-11-19 14:36:14'),
(57, 1, '2025-11-19', 'Partial Payment 1 for INV-TEST-002', 'INV-TEST-002', 'Online', NULL, 0.00, 100000.00, 150000.00, 'paid', NULL, 0, 0.00, 0.00, 3.0, '2025-11-19 14:37:33', '2025-11-19 14:37:33'),
(58, 1, '2025-11-20', 'Partial Payment 2 for INV-TEST-002', 'INV-TEST-002', 'Cheque', '54321', 0.00, 150000.00, 100000.00, 'paid', NULL, 0, 0.00, 0.00, 2.0, '2025-11-19 14:37:33', '2025-11-19 14:37:33'),
(59, 7, '2025-11-19', 'Invoice - PKR', 'INV-2025-1763567376710', 'Pending', NULL, 59000.00, 0.00, 59000.00, 'unpaid', '2025-12-19', 0, 18.00, 9000.00, 4.5, '2025-11-19 15:49:36', '2025-11-19 15:49:36'),
(60, 7, '2025-11-19', 'Payment - Invoice INV-2025-1763567376710', 'INV-2025-1763567376710', 'Cash', NULL, 0.00, 59000.00, -59000.00, 'paid', NULL, 0, 0.00, 0.00, 4.5, '2025-11-19 15:52:46', '2025-11-19 15:52:46'),
(61, 7, '2025-11-19', 'Payment - Invoice INV-2025-1762972128956', 'INV-2025-1762972128956', 'Cash', NULL, 0.00, 116820.00, -116820.00, 'paid', NULL, 0, 0.00, 0.00, 4.5, '2025-11-19 16:21:01', '2025-11-19 16:21:01'),
(62, 3, '2025-11-19', 'Invoice - PKR', 'INV-2025-1763569302847', 'Pending', NULL, 82500.00, 0.00, 82500.00, 'unpaid', '2025-12-04', 0, 10.00, 7500.00, 5.5, '2025-11-19 16:21:42', '2025-11-19 16:21:42'),
(72, 3, '2025-11-20', 'Material A', 'INV-2025-1763666177540', 'Pending', NULL, 10000.00, 0.00, 10000.00, 'paid', '2025-12-20', 0, 18.00, 0.00, 5.5, '2025-11-20 19:16:17', '2025-11-20 19:16:50'),
(73, 3, '2025-11-20', 'Sales Tax @ 18%', 'TAX-INV-2025-1763666177540', 'Pending', NULL, 1800.00, 0.00, 1800.00, 'paid', '2025-12-20', 0, 0.00, 1800.00, 5.5, '2025-11-20 19:16:17', '2025-11-20 19:16:50'),
(74, 3, '2025-11-20', 'Payment Received', 'INV-2025-1763666177540', 'Cash', NULL, 0.00, 10000.00, -10000.00, 'paid', NULL, 0, 18.00, 0.00, 5.5, '2025-11-20 19:16:50', '2025-11-20 19:16:50'),
(75, 3, '2025-11-20', 'Tax Payment @ 18.00%', 'TAX-INV-2025-1763666177540', 'Cash', NULL, 0.00, 1800.00, -1800.00, 'paid', NULL, 0, 0.00, 1800.00, 5.5, '2025-11-20 19:16:50', '2025-11-20 19:16:50'),
(82, 3, '2025-11-21', 'Test Product', 'INV-2025-1763738752977', 'Pending', NULL, 5000.00, 0.00, 5000.00, 'unpaid', '2025-12-21', 0, 18.00, 0.00, 5.5, '2025-11-21 15:25:53', '2025-11-21 15:25:53'),
(83, 3, '2025-11-21', 'Sales Tax @ 18%', 'TAX-INV-2025-1763738752977', 'Pending', NULL, 900.00, 0.00, 900.00, 'unpaid', '2025-12-21', 0, 0.00, 900.00, 5.5, '2025-11-21 15:25:53', '2025-11-21 15:25:53'),
(84, 3, '2025-11-21', 'Test Material', 'INV-2025-1763739606127', 'Pending', NULL, 1221.00, 0.00, 1221.00, 'paid', '2025-12-21', 0, 10.00, 0.00, 5.5, '2025-11-21 15:40:06', '2025-11-21 15:43:22'),
(85, 3, '2025-11-21', 'Sales Tax @ 10%', 'TAX-INV-2025-1763739606127', 'Pending', NULL, 122.10, 0.00, 122.10, 'paid', '2025-12-21', 0, 0.00, 122.10, 5.5, '2025-11-21 15:40:06', '2025-11-21 15:43:22'),
(86, 3, '2025-11-21', 'Payment Received', 'INV-2025-1763739606127', 'Cash', NULL, 0.00, 1221.00, -1221.00, 'paid', NULL, 0, 10.00, 0.00, 5.5, '2025-11-21 15:43:22', '2025-11-21 15:43:22'),
(87, 3, '2025-11-21', 'Tax Payment @ 10.00%', 'TAX-INV-2025-1763739606127', 'Cash', NULL, 0.00, 122.10, -122.10, 'paid', NULL, 0, 0.00, 122.10, 5.5, '2025-11-21 15:43:22', '2025-11-21 15:43:22'),
(94, 13, '2025-11-21', '123', 'INV-2025-1763750477000', 'Pending', NULL, 45600.00, 0.00, 45600.00, 'paid', '2025-12-21', 0, 10.00, 0.00, 0.0, '2025-11-21 18:41:17', '2025-11-21 18:41:51'),
(95, 13, '2025-11-21', 'Sales Tax @ 10%', 'TAX-INV-2025-1763750477000', 'Pending', NULL, 4560.00, 0.00, 4560.00, 'paid', '2025-12-21', 0, 0.00, 4560.00, 0.0, '2025-11-21 18:41:17', '2025-11-21 18:41:51'),
(96, 13, '2025-11-21', 'Payment Received', 'INV-2025-1763750477000', 'Cash', NULL, 0.00, 45600.00, -45600.00, 'paid', NULL, 0, 10.00, 0.00, 0.0, '2025-11-21 18:41:51', '2025-11-21 18:41:51'),
(97, 13, '2025-11-21', 'Tax Payment @ 10.00%', 'TAX-INV-2025-1763750477000', 'Cash', NULL, 0.00, 4560.00, -4560.00, 'paid', NULL, 0, 0.00, 4560.00, 0.0, '2025-11-21 18:41:51', '2025-11-21 18:41:51'),
(98, 13, '2025-11-21', 'test2', 'INV-2025-1763751663719', NULL, NULL, 13653.00, 0.00, 13653.00, 'paid', '2025-12-21', 0, 0.00, 0.00, 0.0, '2025-11-21 19:01:03', '2025-11-21 19:01:39'),
(99, 13, '2025-11-21', 'Payment Received for INV-2025-1763751663719 (Invoice)', 'INV-2025-1763751663719', 'Cash', NULL, 0.00, 13653.00, -13653.00, 'paid', NULL, 0, 0.00, 0.00, 0.0, '2025-11-21 19:01:39', '2025-11-21 19:01:39'),
(100, 13, '2025-11-21', 'testmoi', 'INV-2025-1763751869054', NULL, NULL, 500.00, 0.00, 500.00, 'paid', '2025-12-21', 0, 10.00, 0.00, 0.0, '2025-11-21 19:04:29', '2025-11-21 19:06:04'),
(101, 13, '2025-11-21', 'Sales Tax @ 10%', 'TAX-INV-2025-1763751869054', NULL, NULL, 50.00, 0.00, 50.00, 'paid', '2025-12-21', 0, 0.00, 50.00, 0.0, '2025-11-21 19:04:29', '2025-11-21 19:06:04'),
(102, 13, '2025-11-21', 'Payment Received for INV-2025-1763751869054 (Invoice)', 'INV-2025-1763751869054', 'Cash', NULL, 0.00, 500.00, -500.00, 'paid', NULL, 0, 10.00, 0.00, 0.0, '2025-11-21 19:06:04', '2025-11-21 19:06:04'),
(103, 13, '2025-11-21', 'Tax Payment @ 10.00%', 'TAX-INV-2025-1763751869054', 'Cash', NULL, 0.00, 50.00, -50.00, 'paid', NULL, 0, 0.00, 50.00, 0.0, '2025-11-21 19:06:04', '2025-11-21 19:06:04'),
(104, 13, '2025-11-24', 'this is test', 'INV-37', 'Pending', NULL, 10000.00, 0.00, 10000.00, 'paid', '2025-12-24', 0, 18.00, 0.00, 0.0, '2025-11-24 17:44:02', '2025-11-24 18:01:47'),
(105, 13, '2025-11-24', 'Sales Tax @ 18%', 'TAX-INV-37', 'Pending', NULL, 1800.00, 0.00, 1800.00, 'paid', '2025-12-24', 0, 0.00, 1800.00, 0.0, '2025-11-24 17:44:02', '2025-11-24 18:01:47'),
(106, 13, '2025-11-24', 'Payment Received', 'INV-37', 'Cash', NULL, 0.00, 10000.00, -10000.00, 'paid', NULL, 0, 18.00, 0.00, 0.0, '2025-11-24 18:01:48', '2025-11-24 18:01:48'),
(107, 13, '2025-11-24', 'Tax Payment @ 18.00%', 'TAX-INV-37', 'Cash', NULL, 0.00, 1800.00, -1800.00, 'paid', NULL, 0, 0.00, 1800.00, 0.0, '2025-11-24 18:01:48', '2025-11-24 18:01:48'),
(108, 1, '2025-11-26', 'Test Payment Entry', 'TEST-PI25-004', 'Cash', NULL, 250.00, 0.00, 250.00, 'paid', NULL, 0, 0.00, 0.00, 1.0, '2025-11-25 20:27:41', '2025-11-25 20:27:41'),
(109, 13, '2025-11-26', 'PO Invoice - test', 'PI25-TEST-NEW', 'Pending', NULL, 0.00, 500.00, -500.00, 'paid', '2025-12-26', 0, 18.00, 0.00, 0.0, '2025-11-25 20:53:08', '2025-11-25 20:53:08'),
(110, 13, '2025-11-26', 'Sales Tax @ 18%', 'TAX-PI25-TEST-NEW', 'Pending', NULL, 0.00, 90.00, -90.00, 'paid', '2025-12-26', 0, 0.00, 90.00, 0.0, '2025-11-25 20:53:08', '2025-11-25 20:53:08'),
(111, 13, '2025-11-25', 'Payment - PO Invoice PI25-TEST-NEW', 'PI25-TEST-NEW', 'Cash', NULL, 500.00, 0.00, 500.00, 'paid', NULL, 0, 18.00, 0.00, 0.0, '2025-11-25 20:53:08', '2025-11-25 20:53:08'),
(112, 13, '2025-11-25', 'Tax Payment @ 18%', 'TAX-PI25-TEST-NEW', 'Cash', NULL, 90.00, 0.00, 90.00, 'paid', NULL, 0, 0.00, 90.00, 0.0, '2025-11-25 20:53:08', '2025-11-25 20:53:08'),
(113, 13, '2025-11-25', 'Payment - PI25-TEST-NEW', 'PI25-TEST-NEW', 'Cash', NULL, 0.00, 500.00, -500.00, 'paid', NULL, 0, 18.00, 0.00, 0.0, '2025-11-25 20:53:08', '2025-11-25 20:53:08'),
(114, 13, '2025-11-25', 'Tax Payment @ 18%', 'TAX-PI25-TEST-NEW', 'Cash', NULL, 0.00, 90.00, -90.00, 'paid', NULL, 0, 0.00, 90.00, 0.0, '2025-11-25 20:53:08', '2025-11-25 20:53:08'),
(121, 13, '2025-11-26', 'PO Invoice - test', 'PI25-FINAL-TEST-2', 'Pending', NULL, 0.00, 2500.00, -2500.00, 'paid', '2025-12-26', 0, 10.00, 0.00, 0.0, '2025-11-26 10:07:27', '2025-11-26 10:07:27'),
(122, 13, '2025-11-26', 'Sales Tax @ 10%', 'TAX-PI25-FINAL-TEST-2', 'Pending', NULL, 0.00, 250.00, -250.00, 'paid', '2025-12-26', 0, 0.00, 250.00, 0.0, '2025-11-26 10:07:27', '2025-11-26 10:07:27'),
(125, 13, '2025-11-26', 'Payment - PI25-FINAL-TEST-2', 'PI25-FINAL-TEST-2', 'Cash', NULL, 0.00, 2500.00, -2500.00, 'paid', NULL, 0, 10.00, 0.00, 0.0, '2025-11-26 10:07:27', '2025-11-26 10:07:27'),
(126, 13, '2025-11-26', 'Tax Payment @ 10%', 'TAX-PI25-FINAL-TEST-2', 'Cash', NULL, 0.00, 250.00, -250.00, 'paid', NULL, 0, 0.00, 250.00, 0.0, '2025-11-26 10:07:27', '2025-11-26 10:07:27'),
(139, 13, '2025-01-21', 'PO Invoice - test', 'PI25-FINAL-DEBIT-TEST', 'Pending', NULL, 2700.00, 0.00, 2700.00, 'unpaid', '2025-02-20', 0, 10.00, 0.00, 0.0, '2025-11-26 11:07:21', '2025-11-26 11:07:21'),
(140, 13, '2025-01-21', 'Sales Tax @ 10%', 'TAX-PI25-FINAL-DEBIT-TEST', 'Pending', NULL, 300.00, 0.00, 300.00, 'unpaid', '2025-02-20', 0, 0.00, 300.00, 0.0, '2025-11-26 11:07:21', '2025-11-26 11:07:21'),
(141, 13, '2025-11-26', 'Payment - PO Invoice PI25-FINAL-DEBIT-TEST', 'PI25-FINAL-DEBIT-TEST', 'Cash', NULL, 2700.00, 0.00, 2700.00, 'paid', NULL, 0, 10.00, 0.00, 0.0, '2025-11-26 11:07:21', '2025-11-26 11:07:21'),
(142, 13, '2025-11-26', 'Tax Payment @ 10%', 'TAX-PI25-FINAL-DEBIT-TEST', 'Cash', NULL, 300.00, 0.00, 300.00, 'paid', NULL, 0, 0.00, 300.00, 0.0, '2025-11-26 11:07:21', '2025-11-26 11:07:21'),
(143, 13, '2025-11-26', 'Payment - PI25-FINAL-DEBIT-TEST', 'PI25-FINAL-DEBIT-TEST', 'Cash', NULL, 0.00, 2700.00, -2700.00, 'paid', NULL, 0, 10.00, 0.00, 0.0, '2025-11-26 11:07:21', '2025-11-26 11:07:21'),
(144, 13, '2025-11-26', 'Tax Payment @ 10%', 'TAX-PI25-FINAL-DEBIT-TEST', 'Cash', NULL, 0.00, 300.00, -300.00, 'paid', NULL, 0, 0.00, 300.00, 0.0, '2025-11-26 11:07:21', '2025-11-26 11:07:21'),
(145, 13, '2025-01-22', 'PO Invoice - test', 'PI25-PERFECT-TEST', 'Pending', NULL, 4500.00, 0.00, 4500.00, 'paid', '2025-02-21', 0, 10.00, 0.00, 0.0, '2025-11-26 11:10:40', '2025-11-26 11:10:40'),
(146, 13, '2025-01-22', 'Sales Tax @ 10%', 'TAX-PI25-PERFECT-TEST', 'Pending', NULL, 500.00, 0.00, 500.00, 'paid', '2025-02-21', 0, 0.00, 500.00, 0.0, '2025-11-26 11:10:40', '2025-11-26 11:10:40'),
(147, 13, '2025-11-26', 'Payment - PO Invoice PI25-PERFECT-TEST', 'PI25-PERFECT-TEST', 'Cash', NULL, 4500.00, 0.00, 4500.00, 'paid', NULL, 0, 10.00, 0.00, 0.0, '2025-11-26 11:10:40', '2025-11-26 11:10:40'),
(148, 13, '2025-11-26', 'Tax Payment @ 10%', 'TAX-PI25-PERFECT-TEST', 'Cash', NULL, 500.00, 0.00, 500.00, 'paid', NULL, 0, 0.00, 500.00, 0.0, '2025-11-26 11:10:40', '2025-11-26 11:10:40'),
(149, 13, '2025-11-26', 'Payment - PI25-PERFECT-TEST', 'PI25-PERFECT-TEST', 'Cash', NULL, 0.00, 4500.00, -4500.00, 'paid', NULL, 0, 10.00, 0.00, 0.0, '2025-11-26 11:10:40', '2025-11-26 11:10:40'),
(150, 13, '2025-11-26', 'Tax Payment @ 10%', 'TAX-PI25-PERFECT-TEST', 'Cash', NULL, 0.00, 500.00, -500.00, 'paid', NULL, 0, 0.00, 500.00, 0.0, '2025-11-26 11:10:40', '2025-11-26 11:10:40'),
(164, 7, '2025-11-26', 'PO Invoice - Digious Sol', 'PI25-003-1', 'Pending', NULL, 269550.00, 0.00, 269550.00, 'paid', '2025-12-26', 0, 18.00, 0.00, 4.5, '2025-11-26 12:40:21', '2025-11-26 12:40:21'),
(165, 7, '2025-11-26', 'Sales Tax @ 18%', 'TAX-PI25-003-1', 'Pending', NULL, 94800.23, 0.00, 94800.23, 'paid', '2025-12-26', 0, 0.00, 94800.23, 4.5, '2025-11-26 12:40:21', '2025-11-26 12:40:21'),
(166, 7, '2025-11-26', 'Payment - PI25-003-1', 'PI25-003-1', 'Cash', NULL, 0.00, 269550.00, -269550.00, 'paid', NULL, 0, 18.00, 0.00, 4.5, '2025-11-26 12:40:21', '2025-11-26 12:40:21'),
(167, 7, '2025-11-26', 'Tax Payment @ 18%', 'TAX-PI25-003-1', 'Cash', NULL, 0.00, 94800.23, -94800.23, 'paid', NULL, 0, 0.00, 94800.23, 4.5, '2025-11-26 12:40:21', '2025-11-26 12:40:21'),
(168, 17, '2025-11-26', 'PO Invoice - Abdul Moiz', 'PI25-008', 'Pending', NULL, 40.00, 0.00, 40.00, 'paid', '2025-12-26', 0, 18.00, 0.00, 0.0, '2025-11-26 18:38:34', '2025-11-26 18:38:34'),
(169, 17, '2025-11-26', 'Sales Tax @ 18%', 'TAX-PI25-008', 'Pending', NULL, 7.20, 0.00, 7.20, 'paid', '2025-12-26', 0, 0.00, 7.20, 0.0, '2025-11-26 18:38:34', '2025-11-26 18:38:34'),
(170, 17, '2025-11-26', 'Payment - PI25-008', 'PI25-008', 'Cash', NULL, 0.00, 40.00, -40.00, 'paid', NULL, 0, 18.00, 0.00, 0.0, '2025-11-26 18:38:34', '2025-11-26 18:38:34'),
(171, 17, '2025-11-26', 'Tax Payment @ 18%', 'TAX-PI25-008', 'Cash', NULL, 0.00, 7.20, -7.20, 'paid', NULL, 0, 0.00, 7.20, 0.0, '2025-11-26 18:38:34', '2025-11-26 18:38:34');

-- --------------------------------------------------------

--
-- Table structure for table `ledger_entry_fy_mapping`
--

CREATE TABLE `ledger_entry_fy_mapping` (
  `mapping_id` int(11) NOT NULL,
  `entry_id` int(11) NOT NULL,
  `fy_id` int(11) NOT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Table structure for table `ledger_financial_years`
--

CREATE TABLE `ledger_financial_years` (
  `fy_id` int(11) NOT NULL,
  `customer_id` int(11) NOT NULL,
  `fy_name` varchar(100) NOT NULL,
  `start_date` date NOT NULL,
  `end_date` date NOT NULL,
  `opening_debit` decimal(15,2) DEFAULT 0.00,
  `opening_credit` decimal(15,2) DEFAULT 0.00,
  `opening_balance` decimal(15,2) DEFAULT 0.00,
  `closing_debit` decimal(15,2) DEFAULT 0.00,
  `closing_credit` decimal(15,2) DEFAULT 0.00,
  `closing_balance` decimal(15,2) DEFAULT 0.00,
  `status` enum('open','closed','archived') DEFAULT 'open',
  `notes` text DEFAULT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `ledger_financial_years`
--

INSERT INTO `ledger_financial_years` (`fy_id`, `customer_id`, `fy_name`, `start_date`, `end_date`, `opening_debit`, `opening_credit`, `opening_balance`, `closing_debit`, `closing_credit`, `closing_balance`, `status`, `notes`, `created_at`, `updated_at`) VALUES
(1, 3, ' test - 10-11', '2025-09-01', '2025-11-04', 0.00, 0.00, 0.00, 0.00, 0.00, 0.00, 'open', NULL, '2025-11-10 16:03:17', '2025-11-10 16:03:17');

-- --------------------------------------------------------

--
-- Table structure for table `ledger_fy_closing_balance`
--

CREATE TABLE `ledger_fy_closing_balance` (
  `closing_id` int(11) NOT NULL,
  `fy_id` int(11) NOT NULL,
  `customer_id` int(11) NOT NULL,
  `closing_date` date NOT NULL,
  `closing_debit` decimal(15,2) DEFAULT 0.00,
  `closing_credit` decimal(15,2) DEFAULT 0.00,
  `closing_balance` decimal(15,2) DEFAULT 0.00,
  `pdf_file_path` varchar(500) DEFAULT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Table structure for table `ledger_line_items`
--

CREATE TABLE `ledger_line_items` (
  `id` int(11) NOT NULL,
  `entry_id` int(11) NOT NULL,
  `description` varchar(500) DEFAULT NULL,
  `quantity` decimal(10,2) DEFAULT 0.00,
  `rate` decimal(15,2) DEFAULT 0.00,
  `tax_rate` decimal(5,2) DEFAULT 0.00,
  `amount` decimal(15,2) DEFAULT 0.00,
  `total_with_tax` decimal(15,2) DEFAULT 0.00,
  `item_type` varchar(50) DEFAULT 'material',
  `line_sequence` int(11) DEFAULT 1,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `ledger_line_items`
--

INSERT INTO `ledger_line_items` (`id`, `entry_id`, `description`, `quantity`, `rate`, `tax_rate`, `amount`, `total_with_tax`, `item_type`, `line_sequence`, `created_at`, `updated_at`) VALUES
(8, 46, 'CFQWERT', 50.00, 50.00, 50.00, 2500.00, 3750.00, 'material', 1, '2025-11-12 18:23:24', '2025-11-12 18:23:24'),
(9, 46, 'trewq', 90.00, 70.00, 10.00, 6300.00, 6930.00, 'material', 2, '2025-11-12 18:23:24', '2025-11-12 18:23:24');

-- --------------------------------------------------------

--
-- Table structure for table `ledger_single_materials`
--

CREATE TABLE `ledger_single_materials` (
  `id` int(11) NOT NULL,
  `entry_id` int(11) NOT NULL,
  `bill_no` varchar(100) DEFAULT NULL,
  `quantity_mtr` decimal(10,2) DEFAULT 0.00,
  `rate` decimal(15,2) DEFAULT 0.00,
  `tax_rate` decimal(5,2) DEFAULT 0.00,
  `amount` decimal(15,2) DEFAULT 0.00,
  `total_with_tax` decimal(15,2) DEFAULT 0.00,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `ledger_single_materials`
--

INSERT INTO `ledger_single_materials` (`id`, `entry_id`, `bill_no`, `quantity_mtr`, `rate`, `tax_rate`, `amount`, `total_with_tax`, `created_at`, `updated_at`) VALUES
(10, 22, 'SB44', 1.00, 111.00, 11.00, 111.00, 123.21, '2025-11-10 10:07:27', '2025-11-10 10:07:27'),
(14, 31, 'SB-44', 1.00, 1000.00, 10.00, 1000.00, 1100.00, '2025-11-10 11:21:17', '2025-11-10 11:21:17'),
(16, 35, 'INV-J.', 50.00, 10.00, 10.00, 500.00, 550.00, '2025-11-11 18:43:50', '2025-11-11 18:43:50'),
(19, 39, 'qwert', 123.00, 123.00, 10.00, 15129.00, 16641.90, '2025-11-12 15:17:12', '2025-11-12 15:17:12'),
(20, 41, 'qwe123', 1234.00, 1234.00, 10.00, 1522756.00, 1675031.60, '2025-11-12 15:19:59', '2025-11-12 15:19:59'),
(21, 43, 'bbhhh', 123.00, 123.00, 10.00, 15129.00, 16641.90, '2025-11-12 15:26:50', '2025-11-12 15:26:50'),
(22, 47, 'JFg-5037', 450.00, 1500.00, 18.00, 675000.00, 796500.00, '2025-11-12 18:39:02', '2025-11-12 18:39:02'),
(23, 49, 'qwerty', 100.00, 50.00, 10.00, 5000.00, 5500.00, '2025-11-12 20:53:48', '2025-11-12 20:53:48'),
(24, 52, NULL, 1.00, 1000.00, 18.00, 1000.00, 0.00, '2025-11-18 18:30:30', '2025-11-18 18:30:30'),
(25, 54, 'INV-TEST-001', 1000.00, 100.00, 0.00, 100000.00, 100000.00, '2025-11-19 14:32:07', '2025-11-19 14:32:07'),
(26, 56, 'INV-TEST-002', 500.00, 500.00, 0.00, 250000.00, 250000.00, '2025-11-19 14:36:14', '2025-11-19 14:36:14');

-- --------------------------------------------------------

--
-- Table structure for table `payment_receipts`
--

CREATE TABLE `payment_receipts` (
  `id` int(11) NOT NULL,
  `receipt_number` varchar(50) NOT NULL,
  `receipt_date` date NOT NULL,
  `receipt_type` enum('Customer Payment','Supplier Payment','Other Receipt') NOT NULL,
  `party_type` enum('Customer','Supplier','Other') NOT NULL,
  `party_id` int(11) DEFAULT NULL,
  `party_name` varchar(255) NOT NULL,
  `account_id` int(11) DEFAULT NULL,
  `reference_number` varchar(50) DEFAULT NULL COMMENT 'Check/Bank Transfer number',
  `amount_received` decimal(15,2) NOT NULL,
  `payment_method` enum('Cash','Check','Bank Transfer','Credit Card','Other') NOT NULL,
  `bank_account` varchar(100) DEFAULT NULL,
  `description` text DEFAULT NULL,
  `posted_by` int(11) DEFAULT NULL,
  `is_reconciled` tinyint(1) DEFAULT 0,
  `status` enum('Pending','Confirmed','Cancelled') DEFAULT 'Confirmed',
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp()
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
-- Stand-in structure for view `po_complete_summary`
-- (See below for the actual view)
--
CREATE TABLE `po_complete_summary` (
`po_id` int(11)
,`po_number` varchar(50)
,`supplier_name` varchar(255)
,`po_total_amount` decimal(15,2)
,`po_status` enum('Draft','Pending','Approved','Received','Cancelled')
,`amount_invoiced` decimal(37,2)
,`amount_remaining` decimal(38,2)
,`amount_invoice_count` bigint(21)
,`po_total_quantity` decimal(32,2)
,`quantity_invoiced` decimal(37,2)
,`quantity_remaining` decimal(38,2)
,`quantity_invoice_count` bigint(21)
,`invoicing_type` varchar(15)
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
(11, 29, 'PI25-005', 'PO25-10-003', 'efg', 10.00, '2025-10-02', '2025-10-03 15:43:56', 'PO permanently deleted', 'System User', NULL, '2025-10-03 15:43:56'),
(12, 31, 'PI25-005', 'PO25-10-004', 'Muhammad Hunain', 849.99, '2025-10-13', '2025-10-13 18:36:17', 'Manual deletion via system', 'System User', NULL, '2025-10-13 18:36:17'),
(13, 33, 'PI25-006', 'PO25-10-005', 'Muhammad Hunain', 124.95, '2025-10-13', '2025-10-13 20:35:14', 'Manual deletion via system', 'System User', NULL, '2025-10-13 20:35:14'),
(14, 35, 'PI25-006-1', 'PO25-10-005', 'Muhammad Hunain', 60.00, '2025-10-13', '2025-10-14 12:43:12', 'Manual deletion via system', 'System User', NULL, '2025-10-14 12:43:12'),
(15, 34, 'PI25-006', 'PO25-10-005', 'Muhammad Hunain', 150.00, '2025-10-13', '2025-10-14 12:43:16', 'Manual deletion via system', 'System User', NULL, '2025-10-14 12:43:16'),
(16, 32, 'PI25-005', 'PO25-10-004', 'Muhammad Hunain', 849.99, '2025-10-13', '2025-10-14 12:43:19', 'Manual deletion via system', 'System User', NULL, '2025-10-14 12:43:19'),
(17, 36, 'PI25-005', 'PO25-10-007', 'Muhammad Hunain', 1100.00, '2025-10-14', '2025-10-14 14:31:41', 'Manual deletion via system', 'System User', NULL, '2025-10-14 14:31:41'),
(18, 37, 'PI25-005', 'PO25-10-007', 'Muhammad Hunain', 1100.00, '2025-10-14', '2025-10-14 14:40:03', 'Manual deletion via system', 'System User', NULL, '2025-10-14 14:40:03'),
(19, 38, 'PI25-005', 'PO25-10-007', 'Muhammad Hunain', 1100.00, '2025-10-14', '2025-10-14 14:44:57', 'Manual deletion via system', 'System User', NULL, '2025-10-14 14:44:57'),
(20, 39, 'PI25-005', 'PO25-10-007', 'Muhammad Hunain', 123.21, '2025-10-14', '2025-10-14 16:18:57', 'PO permanently deleted - invoices automatically removed', 'System Trigger', NULL, '2025-10-14 16:18:57'),
(21, 27, 'PI25-004', 'PO25-10-001', 'Muhammad Hunain', 50.00, '2025-10-01', '2025-10-14 16:18:57', 'PO permanently deleted - invoices automatically removed', 'System Trigger', NULL, '2025-10-14 16:18:57'),
(22, 28, 'PI25-004-1', 'PO25-10-001', 'Muhammad Hunain', 1000.00, '2025-10-02', '2025-10-14 16:18:57', 'PO permanently deleted - invoices automatically removed', 'System Trigger', NULL, '2025-10-14 16:18:57'),
(24, 20, 'PI25-001', 'PO25-9-002', 'Muhammad ', 19900.00, '2025-09-30', '2025-11-07 16:10:30', 'PO permanently deleted', 'System User', NULL, '2025-11-07 16:10:30'),
(25, 30, 'PI25-001-1', 'PO25-9-002', 'Muhammad ', 50000.00, '2025-10-13', '2025-11-07 16:10:30', 'PO permanently deleted', 'System User', NULL, '2025-11-07 16:10:30'),
(26, 40, 'PI25-004', 'PO25-10-004', 'Muhammad Hunain', 52999.95, '2025-10-21', '2025-11-07 16:10:30', 'PO permanently deleted', 'System User', NULL, '2025-11-07 16:10:30'),
(27, 21, 'PI25-002', 'PO25-9-001', 'Muhammad Hunain', 15000.00, '2025-09-30', '2025-11-07 16:10:30', 'PO permanently deleted', 'System User', NULL, '2025-11-07 16:10:30'),
(28, 22, 'PI25-003', 'PO25-9-003', 'Paysys', 340000.00, '2025-09-30', '2025-11-07 16:10:30', 'PO permanently deleted', 'System User', NULL, '2025-11-07 16:10:30'),
(29, 23, 'PI25-003-1', 'PO25-9-003', 'Paysys', 1000000.00, '2025-09-30', '2025-11-07 16:10:30', 'PO permanently deleted', 'System User', NULL, '2025-11-07 16:10:30'),
(30, 24, 'PI25-003-2', 'PO25-9-003', 'Paysys', 21000000.00, '2025-09-30', '2025-11-07 16:10:30', 'PO permanently deleted', 'System User', NULL, '2025-11-07 16:10:30'),
(31, 41, 'PI25-001', 'PO25-11-001', 'MH', 10.00, '2025-11-07', '2025-11-07 18:04:04', 'Manual deletion via system', 'System User', NULL, '2025-11-07 18:04:04'),
(32, 42, 'PI25-001', 'PO25-11-001', 'MH', 10.00, '2025-11-07', '2025-11-07 20:04:53', 'Manual deletion via system', 'System User', NULL, '2025-11-07 20:04:53'),
(33, 43, 'PI25-001', 'PO25-11-001', 'MH', 110.00, '2025-11-10', '2025-11-12 14:28:19', 'Manual deletion via system', 'System User', NULL, '2025-11-12 14:28:19'),
(34, 48, 'PI25-003', 'PO25-11-003', 'Digious Sol', 592000.00, '2025-10-01', '2025-11-12 19:57:02', 'Manual deletion via system', 'System User', NULL, '2025-11-12 19:57:02'),
(35, 49, 'PI25-003', 'PO25-11-003', 'Digious Sol', 725000.00, '2025-11-12', '2025-11-13 19:00:43', 'Manual deletion via system', 'System User', NULL, '2025-11-13 19:00:43'),
(36, 50, 'PI25-003', 'PO25-11-003', 'Digious Sol', 500000.00, '2025-11-14', '2025-11-14 18:15:33', 'Manual deletion via system', 'System User', NULL, '2025-11-14 18:15:33'),
(37, 52, 'TEST-INV-3', 'PO25-11-003', 'Digious Sol', 417760.00, '2025-11-14', '2025-11-14 18:17:04', 'Manual deletion via system', 'System User', NULL, '2025-11-14 18:17:04'),
(38, 51, 'TEST-INV-002', 'PO25-11-003', 'Digious Sol', 212760.00, '2025-11-14', '2025-11-14 18:17:07', 'Manual deletion via system', 'System User', NULL, '2025-11-14 18:17:07'),
(39, 54, 'PI25-004', 'PO25-11-004', 'test', 340.00, '2025-11-24', '2025-11-24 18:05:29', 'Manual deletion via system', 'System User', NULL, '2025-11-24 18:05:29'),
(40, 56, 'PI25-004-1', 'PO25-11-004', 'test', 177.00, '2025-11-25', '2025-11-25 20:14:03', 'Manual deletion via system', 'System User', NULL, '2025-11-25 20:14:03'),
(41, 55, 'PI25-004', 'PO25-11-004', 'test', 295.00, '2025-11-24', '2025-11-25 20:14:07', 'Manual deletion via system', 'System User', NULL, '2025-11-25 20:14:07'),
(42, 72, 'PI25-008', 'PO25-11-008', 'Abdul Moiz', 40.00, '2025-11-26', '2025-11-26 18:34:59', 'Manual deletion via system', 'System User', NULL, '2025-11-26 18:34:59');

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
  `updated_at` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp(),
  `invoicing_mode` enum('amount','quantity','mixed') NOT NULL DEFAULT 'amount' COMMENT 'Invoicing mode: amount-based, quantity-based, or mixed',
  `total_po_quantity` decimal(15,2) DEFAULT 0.00 COMMENT 'Total quantity from PO (for quantity-based)',
  `invoiced_quantity` decimal(15,2) DEFAULT 0.00 COMMENT 'Quantity being invoiced',
  `quantity_percentage` decimal(5,2) DEFAULT 0.00 COMMENT 'Percentage of PO quantity being invoiced',
  `payment_days` int(11) DEFAULT 30 COMMENT 'Number of days for payment terms (default 30 days)'
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `po_invoices`
--

INSERT INTO `po_invoices` (`id`, `invoice_number`, `invoice_date`, `due_date`, `po_id`, `po_number`, `customer_name`, `customer_email`, `customer_phone`, `customer_address`, `subtotal`, `tax_rate`, `tax_amount`, `total_amount`, `currency`, `status`, `payment_date`, `payment_method`, `payment_reference`, `notes`, `created_at`, `updated_at`, `invoicing_mode`, `total_po_quantity`, `invoiced_quantity`, `quantity_percentage`, `payment_days`) VALUES
(44, 'PI25-001', '2025-11-12', '2025-12-12', '35', 'PO25-11-001', 'MH', '19@gmail.com', '+9234359800521', 'Floor Shan Residency SB-44 Block-K North Nazimabad karachi', 50.00, 0.00, 0.00, 50.00, 'PKR', 'Draft', NULL, NULL, NULL, 'Generated from Purchase Order: PO25-11-001', '2025-11-12 14:39:31', '2025-11-12 14:39:31', 'quantity', 0.00, 50.00, 0.00, 30),
(45, 'PI25-001-1', '2025-11-12', '2025-12-12', '35', 'PO25-11-001', 'MH', '19@gmail.com', '+9234359800521', 'Floor Shan Residency SB-44 Block-K North Nazimabad karachi', 30.00, 0.00, 0.00, 30.00, 'PKR', 'Draft', NULL, NULL, NULL, 'Generated from Purchase Order: PO25-11-001', '2025-11-12 18:24:15', '2025-11-12 18:24:15', 'quantity', 0.00, 30.00, 0.00, 30),
(46, 'PI25-002', '2025-11-12', '2025-12-12', '36', 'PO25-11-002', 'Digious Sol', 'sol@gmail.com', '0987543211', 'North Nazimabad Karachi', 245000.00, 0.00, 0.00, 245000.00, 'PKR', 'Overdue', NULL, NULL, NULL, 'Generated from Purchase Order: PO25-11-002', '2025-11-12 18:32:19', '2025-11-12 18:35:47', 'quantity', 0.00, 350.00, 0.00, 30),
(47, 'PI25-002-1', '2025-11-12', '2025-12-12', '36', 'PO25-11-002', 'Digious Sol', 'sol@gmail.com', '0987543211', 'North Nazimabad Karachi', 350000.00, 0.00, 0.00, 350000.00, 'PKR', 'Paid', '2025-11-12', NULL, NULL, 'Generated from Purchase Order: PO25-11-002', '2025-11-12 18:32:47', '2025-11-12 18:35:28', 'quantity', 0.00, 500.00, 0.00, 30),
(53, 'PI25-003', '2025-11-14', '2025-12-14', '37', 'PO25-11-003', 'Digious Sol', 'sol@gmail.com', '0987543211', 'North Nazimabad Karachi', 500000.00, 18.00, 167760.00, 667760.00, 'PKR', 'Paid', '2025-11-26', NULL, NULL, 'Generated from Purchase Order: PO25-11-003', '2025-11-14 18:18:50', '2025-11-25 19:48:27', 'quantity', 0.00, 100.00, 0.00, 30),
(57, 'PI25-004', '2025-11-25', '2025-12-25', '38', 'PO25-11-004', 'test', 'test456@gmail.com', '456', 'test456', 250.00, 18.00, 45.00, 295.00, 'PKR', 'Paid', '2025-11-26', NULL, NULL, 'Generated from Purchase Order: PO25-11-004', '2025-11-25 20:14:41', '2025-11-25 20:28:46', 'quantity', 0.00, 5.00, 0.00, 30),
(58, 'PI25-TEST-NEW', '2025-11-26', '2025-12-26', '38', 'PO25-11-004', 'test', 'test@test.com', '', '', 500.00, 18.00, 90.00, 590.00, 'PKR', 'Draft', '2025-11-25', NULL, NULL, '', '2025-11-25 20:30:44', '2025-11-26 09:52:29', 'amount', 0.00, 0.00, 0.00, 30),
(59, 'PI25-005', '2025-11-26', '2025-12-26', '39', 'PO25-11-005', 'Final Test', 'FinalTest@gmail.com', '98765456', 'Final Test@!@$', 2500.00, 10.00, 250.00, 2750.00, 'PKR', 'Paid', '2025-11-26', NULL, NULL, 'Generated from Purchase Order: PO25-11-005', '2025-11-26 10:00:33', '2025-11-26 10:01:14', 'quantity', 0.00, 25.00, 0.00, 30),
(60, 'PI25-FINAL-TEST', '2025-11-26', '2025-12-26', '38', 'PO25-11-004', 'test', 'test@test.com', '', '', 2500.00, 10.00, 250.00, 2750.00, 'PKR', 'Draft', NULL, NULL, NULL, '', '2025-11-26 10:05:24', '2025-11-26 10:05:24', 'amount', 0.00, 0.00, 0.00, 30),
(62, 'PI25-FINAL-TEST-2', '2025-11-26', '2025-12-26', '38', 'PO25-11-004', 'test', 'test@test.com', '', '', 2500.00, 10.00, 250.00, 2750.00, 'PKR', 'Paid', NULL, NULL, NULL, '', '2025-11-26 10:05:49', '2025-11-26 10:07:27', 'amount', 0.00, 0.00, 0.00, 30),
(64, 'PI25-005-1', '2025-11-26', '2025-12-26', '39', 'PO25-11-005', 'Final Test', 'FinalTest@gmail.com', '98765456', 'Final Test@!@$', 2500.00, 10.00, 250.00, 2750.00, 'PKR', 'Paid', '2025-11-26', NULL, NULL, 'Generated from Purchase Order: PO25-11-005', '2025-11-26 10:13:00', '2025-11-26 10:32:53', 'quantity', 0.00, 25.00, 0.00, 30),
(65, 'PI25-006', '2025-11-26', '2025-12-26', '40', 'PO25-11-006', 'final', 'final@gmail.com', '786510923', 'Final Test@!@$', 2000.00, 100.00, 2000.00, 4000.00, 'PKR', 'Paid', '2025-11-26', NULL, NULL, 'Generated from Purchase Order: PO25-11-006', '2025-11-26 10:35:58', '2025-11-26 10:36:23', 'quantity', 0.00, 2.00, 0.00, 30),
(66, 'PI25-NEW-DEBIT-TEST', '2025-01-21', '2025-02-20', '38', 'PO-TEST-38', 'Test Supplier', '', '', '', 0.00, 10.00, 100.00, 1000.00, 'PKR', 'Paid', NULL, NULL, NULL, '', '2025-11-26 10:52:18', '2025-11-26 10:53:06', 'amount', 0.00, 0.00, 0.00, 30),
(67, 'PI25-FINAL-DEBIT-TEST', '2025-01-21', '2025-02-20', '38', 'PO-TEST-39', 'test', '', '', '', 0.00, 10.00, 300.00, 3000.00, 'PKR', 'Paid', NULL, NULL, NULL, '', '2025-11-26 11:01:31', '2025-11-26 11:07:21', 'amount', 0.00, 0.00, 0.00, 30),
(68, 'PI25-PERFECT-TEST', '2025-01-22', '2025-02-21', '38', 'PO-FINAL-99', 'test', '', '', '', 0.00, 10.00, 500.00, 5000.00, 'PKR', 'Paid', NULL, NULL, NULL, '', '2025-11-26 11:10:12', '2025-11-26 11:10:40', 'amount', 0.00, 0.00, 0.00, 30),
(69, 'PI25-007', '2025-11-26', '2025-12-26', '41', 'PO25-11-007', 'HUNAIN', 'Hunain122a@gmail.com', '09874567', 'Hunain122aa@gmail.com', 10000.00, 10.00, 1000.00, 11000.00, 'PKR', 'Paid', '2025-11-26', NULL, NULL, 'Generated from Purchase Order: PO25-11-007', '2025-11-26 11:38:29', '2025-11-26 11:39:02', 'quantity', 0.00, 5.00, 0.00, 30),
(70, 'PI25-007-1', '2025-11-26', '2025-12-26', '41', 'PO25-11-007', 'HUNAIN', 'Hunain122a@gmail.com', '09874567', 'Hunain122aa@gmail.com', 4000.00, 10.00, 400.00, 4400.00, 'PKR', 'Paid', '2025-11-26', NULL, NULL, 'Generated from Purchase Order: PO25-11-007', '2025-11-26 11:44:26', '2025-11-26 11:45:14', 'quantity', 0.00, 2.00, 0.00, 30),
(71, 'PI25-003-1', '2025-11-26', '2025-12-26', '37', 'PO25-11-003', 'Digious Sol', 'sol@gmail.com', '0987543211', 'North Nazimabad Karachi', 269550.00, 18.00, 94800.23, 364350.23, 'PKR', 'Paid', '2025-11-26', NULL, NULL, 'Generated from Purchase Order: PO25-11-003', '2025-11-26 12:39:40', '2025-11-26 12:40:21', 'quantity', 0.00, 599.00, 0.00, 30),
(73, 'PI25-008', '2025-11-26', '2025-12-26', '42', 'PO25-11-008', 'Abdul Moiz', 'moiz@gmail.com', '123456', 'block H', 40.00, 18.00, 7.20, 47.20, 'PKR', 'Paid', '2025-11-26', NULL, NULL, 'Generated from Purchase Order: PO25-11-008', '2025-11-26 18:37:53', '2025-11-26 18:38:34', 'quantity', 0.00, 2.00, 0.00, 30);

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
DELIMITER $$
CREATE TRIGGER `trg_sync_payment_days_on_invoice_insert` BEFORE INSERT ON `po_invoices` FOR EACH ROW BEGIN
    DECLARE po_payment_days INT DEFAULT 30;
    
    -- Get payment_days from parent purchase_order
    SELECT payment_days INTO po_payment_days
    FROM arauf_crm.purchase_orders
    WHERE id = NEW.po_id
    LIMIT 1;
    
    -- If no payment_days specified in INSERT or it's default 30, use PO's payment_days
    IF NEW.payment_days IS NULL OR NEW.payment_days = 30 THEN
        SET NEW.payment_days = po_payment_days;
    END IF;
    
    -- Recalculate due_date based on payment_days
    IF NEW.invoice_date IS NOT NULL THEN
        SET NEW.due_date = DATE_ADD(NEW.invoice_date, INTERVAL NEW.payment_days DAY);
    END IF;
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
  `po_item_id` int(11) NOT NULL,
  `item_no` int(11) NOT NULL,
  `description` text NOT NULL,
  `po_quantity` decimal(10,2) NOT NULL,
  `invoiced_quantity` decimal(10,2) NOT NULL,
  `remaining_quantity` decimal(10,2) NOT NULL,
  `unit` varchar(50) DEFAULT NULL,
  `net_weight` decimal(10,2) DEFAULT NULL COMMENT 'Net weight in KG',
  `unit_price` decimal(15,2) NOT NULL,
  `amount` decimal(15,2) NOT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `po_invoice_items`
--

INSERT INTO `po_invoice_items` (`id`, `po_invoice_id`, `po_item_id`, `item_no`, `description`, `po_quantity`, `invoiced_quantity`, `remaining_quantity`, `unit`, `net_weight`, `unit_price`, `amount`, `created_at`, `updated_at`) VALUES
(15, 44, 59, 1, 'aaa', 100.00, 50.00, 50.00, 'pcs', 5.00, 1.00, 50.00, '2025-11-12 14:39:31', '2025-11-12 14:39:31'),
(16, 45, 59, 1, 'aaa', 100.00, 30.00, 20.00, 'pcs', 3.00, 1.00, 30.00, '2025-11-12 18:24:15', '2025-11-12 18:24:15'),
(26, 53, 61, 1, 'Design A', 100.00, 100.00, 0.00, 'pcs', 90.00, 5000.00, 500000.00, '2025-11-14 18:18:50', '2025-11-14 18:18:50'),
(31, 59, 65, 1, 'PO inv test', 50.00, 25.00, 25.00, 'pcs', 5.00, 100.00, 2500.00, '2025-11-26 10:00:33', '2025-11-26 10:00:33'),
(32, 64, 65, 1, 'PO inv test', 50.00, 25.00, 0.00, 'pcs', 5.00, 100.00, 2500.00, '2025-11-26 10:13:00', '2025-11-26 10:13:00'),
(33, 65, 66, 1, 'finl 1', 10.00, 2.00, 8.00, 'pcs', 2.00, 1000.00, 2000.00, '2025-11-26 10:35:58', '2025-11-26 10:35:58'),
(34, 69, 67, 1, 'HUNAIN', 10.00, 5.00, 5.00, 'pcs', 5.00, 2000.00, 10000.00, '2025-11-26 11:38:29', '2025-11-26 11:38:29'),
(35, 70, 67, 1, 'HUNAIN', 10.00, 2.00, 3.00, 'pcs', 2.00, 2000.00, 4000.00, '2025-11-26 11:44:26', '2025-11-26 11:44:26'),
(36, 71, 62, 1, 'Design B', 960.00, 599.00, 361.00, 'pcs', 162.23, 450.00, 269550.00, '2025-11-26 12:39:40', '2025-11-26 12:39:40'),
(38, 73, 70, 1, 'test product', 3.00, 2.00, 1.00, 'pcs', 13.33, 20.00, 40.00, '2025-11-26 18:37:53', '2025-11-26 18:37:53');

--
-- Triggers `po_invoice_items`
--
DELIMITER $$
CREATE TRIGGER `trg_calculate_invoice_quantities_delete` AFTER DELETE ON `po_invoice_items` FOR EACH ROW BEGIN
  -- Update the parent po_invoices record with quantity totals
  UPDATE po_invoices pi
  SET 
    invoiced_quantity = (
      SELECT COALESCE(SUM(pii.invoiced_quantity), 0) 
      FROM po_invoice_items pii 
      WHERE pii.po_invoice_id = pi.id
    ),
    subtotal = (
      SELECT COALESCE(SUM(pii.amount), 0) 
      FROM po_invoice_items pii 
      WHERE pii.po_invoice_id = pi.id
    ),
    total_amount = (
      SELECT COALESCE(SUM(pii.amount), 0) + COALESCE(pi.tax_amount, 0) 
      FROM po_invoice_items pii 
      WHERE pii.po_invoice_id = pi.id
    )
  WHERE pi.id = OLD.po_invoice_id;
END
$$
DELIMITER ;
DELIMITER $$
CREATE TRIGGER `trg_calculate_invoice_quantities_insert` AFTER INSERT ON `po_invoice_items` FOR EACH ROW BEGIN
  -- Update the parent po_invoices record with quantity totals
  UPDATE po_invoices pi
  SET 
    invoiced_quantity = (
      SELECT COALESCE(SUM(pii.invoiced_quantity), 0) 
      FROM po_invoice_items pii 
      WHERE pii.po_invoice_id = pi.id
    ),
    subtotal = (
      SELECT COALESCE(SUM(pii.amount), 0) 
      FROM po_invoice_items pii 
      WHERE pii.po_invoice_id = pi.id
    ),
    total_amount = (
      SELECT COALESCE(SUM(pii.amount), 0) + COALESCE(pi.tax_amount, 0) 
      FROM po_invoice_items pii 
      WHERE pii.po_invoice_id = pi.id
    )
  WHERE pi.id = NEW.po_invoice_id;
END
$$
DELIMITER ;
DELIMITER $$
CREATE TRIGGER `trg_calculate_invoice_quantities_update` AFTER UPDATE ON `po_invoice_items` FOR EACH ROW BEGIN
  -- Update the parent po_invoices record with quantity totals
  UPDATE po_invoices pi
  SET 
    invoiced_quantity = (
      SELECT COALESCE(SUM(pii.invoiced_quantity), 0) 
      FROM po_invoice_items pii 
      WHERE pii.po_invoice_id = pi.id
    ),
    subtotal = (
      SELECT COALESCE(SUM(pii.amount), 0) 
      FROM po_invoice_items pii 
      WHERE pii.po_invoice_id = pi.id
    ),
    total_amount = (
      SELECT COALESCE(SUM(pii.amount), 0) + COALESCE(pi.tax_amount, 0) 
      FROM po_invoice_items pii 
      WHERE pii.po_invoice_id = pi.id
    )
  WHERE pi.id = NEW.po_invoice_id;
END
$$
DELIMITER ;

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
(119, 'PO-20250927-182905', 0.00, 0.00, 0.00, 0, NULL, '2025-09-30 12:11:27', '2025-09-30 12:11:27'),
(120, 'PO-20250927-180053', 0.00, 0.00, 0.00, 0, NULL, '2025-09-30 12:11:31', '2025-09-30 12:11:31'),
(122, 'PO-20250929-215641', 0.00, 0.00, 0.00, 0, NULL, '2025-09-30 12:11:40', '2025-09-30 12:11:40'),
(123, 'PO-20250929-150543', 0.00, 0.00, 0.00, 0, NULL, '2025-09-30 12:11:46', '2025-09-30 12:11:46'),
(272, 'PO25-11-001', 110.00, 80.00, 30.00, 2, '2025-11-12', '2025-11-12 14:28:19', '2025-11-12 18:24:15'),
(282, 'PO25-11-002', 826000.00, 595000.00, 231000.00, 2, '2025-11-12', '2025-11-12 18:31:57', '2025-11-12 18:35:47'),
(320, 'PO25-11-003', 1099760.00, 1032110.23, 67649.77, 2, '2025-11-26', '2025-11-14 18:17:07', '2025-11-26 12:40:21'),
(338, 'PO25-11-004', 590.00, 6385.00, -5795.00, 4, '2025-11-26', '2025-11-25 20:14:07', '2025-11-26 10:07:27'),
(343, 'PO25-11-005', 5500.00, 5500.00, 0.00, 2, '2025-11-26', '2025-11-26 09:57:27', '2025-11-26 10:32:53'),
(352, 'PO25-11-006', 20000.00, 4000.00, 16000.00, 1, '2025-11-26', '2025-11-26 10:35:51', '2025-11-26 10:36:23'),
(355, 'PO-TEST-38', 0.00, 1000.00, -1000.00, 1, '2025-01-21', '2025-11-26 10:52:18', '2025-11-26 10:53:06'),
(356, 'PO-TEST-39', 0.00, 3000.00, -3000.00, 1, '2025-01-21', '2025-11-26 11:01:31', '2025-11-26 11:07:21'),
(357, 'PO-FINAL-99', 0.00, 5000.00, -5000.00, 1, '2025-01-22', '2025-11-26 11:10:12', '2025-11-26 11:10:40'),
(358, 'PO25-11-007', 22000.00, 15400.00, 6600.00, 2, '2025-11-26', '2025-11-26 11:38:17', '2025-11-26 11:45:14'),
(372, 'PO25-11-008', 70.80, 47.20, 23.60, 1, '2025-11-26', '2025-11-26 18:34:59', '2025-11-26 18:38:34');

-- --------------------------------------------------------

--
-- Stand-in structure for view `po_item_quantity_tracking`
-- (See below for the actual view)
--
CREATE TABLE `po_item_quantity_tracking` (
`po_item_id` int(11)
,`po_id` int(11)
,`po_number` varchar(50)
,`item_no` int(11)
,`description` text
,`po_quantity` decimal(10,2)
,`unit` varchar(50)
,`unit_price` decimal(15,2)
,`po_amount` decimal(15,2)
,`total_invoiced_quantity` decimal(32,2)
,`remaining_quantity` decimal(33,2)
,`item_invoicing_percentage` decimal(41,6)
,`item_status` varchar(18)
,`invoice_count` bigint(21)
);

-- --------------------------------------------------------

--
-- Stand-in structure for view `po_quantity_summary`
-- (See below for the actual view)
--
CREATE TABLE `po_quantity_summary` (
`po_id` int(11)
,`po_number` varchar(50)
,`supplier_name` varchar(255)
,`po_status` enum('Draft','Pending','Approved','Received','Cancelled')
,`po_total_quantity` decimal(32,2)
,`total_invoiced_quantity` decimal(37,2)
,`remaining_quantity` decimal(38,2)
,`quantity_invoicing_percentage` decimal(46,6)
,`quantity_invoice_count` bigint(21)
,`quantity_status` varchar(18)
);

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
  `updated_at` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp(),
  `payment_days` int(11) DEFAULT 30 COMMENT 'Number of days for payment terms (default 30 days)'
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `purchase_orders`
--

INSERT INTO `purchase_orders` (`id`, `po_number`, `po_date`, `supplier_name`, `supplier_email`, `supplier_phone`, `supplier_address`, `subtotal`, `tax_rate`, `tax_amount`, `total_amount`, `currency`, `status`, `previous_status`, `notes`, `created_at`, `updated_at`, `payment_days`) VALUES
(35, 'PO25-11-001', '2025-11-07', 'MH', '19@gmail.com', '+9234359800521', 'Floor Shan Residency SB-44 Block-K North Nazimabad karachi', 100.00, 10.00, 10.00, 110.00, 'PKR', 'Approved', NULL, '', '2025-11-07 16:12:59', '2025-11-07 16:16:02', 30),
(36, 'PO25-11-002', '2025-11-10', 'Digious Sol', 'sol@gmail.com', '0987543211', 'North Nazimabad Karachi', 700000.00, 18.00, 126000.00, 826000.00, 'PKR', 'Approved', NULL, 'this is test', '2025-11-12 18:31:49', '2025-11-12 18:34:17', 30),
(37, 'PO25-11-003', '2025-11-12', 'Digious Sol', 'sol@gmail.com', '0987543211', 'North Nazimabad Karachi', 932000.00, 18.00, 167760.00, 1099760.00, 'PKR', 'Approved', NULL, '', '2025-11-12 18:34:04', '2025-11-12 18:34:04', 30),
(38, 'PO25-11-004', '2025-11-23', 'test', '', '', '', NULL, NULL, NULL, 590.00, NULL, NULL, NULL, '', '2025-11-24 17:44:59', '2025-11-25 20:22:06', 30),
(39, 'PO25-11-005', '2025-11-26', 'Final Test', 'FinalTest@gmail.com', '98765456', 'Final Test@!@$', 5000.00, 10.00, 500.00, 5500.00, 'PKR', 'Approved', NULL, '', '2025-11-26 09:54:21', '2025-11-26 09:54:21', 30),
(40, 'PO25-11-006', '2025-11-26', 'final', 'final@gmail.com', '786510923', 'Final Test@!@$', 10000.00, 100.00, 10000.00, 20000.00, 'PKR', 'Approved', NULL, '', '2025-11-26 10:35:46', '2025-11-26 10:35:46', 30),
(41, 'PO25-11-007', '2025-11-26', 'HUNAIN', 'Hunain122a@gmail.com', '09874567', 'Hunain122aa@gmail.com', 20000.00, 10.00, 2000.00, 22000.00, 'PKR', 'Approved', NULL, '', '2025-11-26 11:28:28', '2025-11-26 11:28:28', 30),
(42, 'PO25-11-008', '2025-11-26', 'Abdul Moiz', 'moiz@gmail.com', '123456', 'block H', 60.00, 18.00, 10.80, 70.80, 'PKR', 'Approved', NULL, '', '2025-11-26 18:32:47', '2025-11-26 18:36:16', 30);

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
CREATE TRIGGER `trg_sync_payment_days_on_po_update` AFTER UPDATE ON `purchase_orders` FOR EACH ROW BEGIN
    -- Only update if payment_days has changed
    IF OLD.payment_days != NEW.payment_days THEN
        -- Update all related po_invoices with the new payment_days
        UPDATE arauf_crm.po_invoices
        SET payment_days = NEW.payment_days,
            updated_at = CURRENT_TIMESTAMP
        WHERE po_id = NEW.id;
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
  `net_weight` decimal(10,2) DEFAULT NULL COMMENT 'Net weight in KG',
  `unit_price` decimal(15,2) NOT NULL,
  `amount` decimal(15,2) NOT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `purchase_order_items`
--

INSERT INTO `purchase_order_items` (`id`, `purchase_order_id`, `item_no`, `description`, `quantity`, `unit`, `net_weight`, `unit_price`, `amount`, `created_at`, `updated_at`) VALUES
(59, 35, 1, 'aaa', 100.00, 'pcs', 10.00, 1.00, 100.00, '2025-11-07 16:16:02', '2025-11-07 16:16:02'),
(61, 37, 1, 'Design A', 100.00, 'pcs', 90.00, 5000.00, 500000.00, '2025-11-12 18:34:04', '2025-11-12 18:34:04'),
(62, 37, 2, 'Design B', 960.00, 'pcs', 260.00, 450.00, 432000.00, '2025-11-12 18:34:04', '2025-11-12 18:34:04'),
(63, 36, 1, 'Fiber Printed Man Design ', 1000.00, 'pcs', 500.00, 700.00, 700000.00, '2025-11-12 18:34:17', '2025-11-12 18:34:17'),
(65, 39, 1, 'PO inv test', 50.00, 'pcs', 10.00, 100.00, 5000.00, '2025-11-26 09:54:21', '2025-11-26 09:54:21'),
(66, 40, 1, 'finl 1', 10.00, 'pcs', 10.00, 1000.00, 10000.00, '2025-11-26 10:35:46', '2025-11-26 10:35:46'),
(67, 41, 1, 'HUNAIN', 10.00, 'pcs', 10.00, 2000.00, 20000.00, '2025-11-26 11:28:28', '2025-11-26 11:28:28'),
(70, 42, 1, 'test product', 3.00, 'pcs', 20.00, 20.00, 60.00, '2025-11-26 18:36:16', '2025-11-26 18:36:16');

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
-- Table structure for table `stock`
--

CREATE TABLE `stock` (
  `id` int(11) NOT NULL,
  `item_name` varchar(255) NOT NULL,
  `category` varchar(100) DEFAULT NULL,
  `quantity` decimal(10,2) NOT NULL,
  `unit` varchar(50) DEFAULT 'KG',
  `price_per_unit` decimal(10,2) DEFAULT 0.00,
  `supplier_name` varchar(255) DEFAULT NULL,
  `supplier_email` varchar(255) DEFAULT NULL,
  `supplier_phone` varchar(20) DEFAULT NULL,
  `purchase_date` date DEFAULT NULL,
  `expiry_date` date DEFAULT NULL,
  `location` varchar(255) DEFAULT NULL,
  `description` text DEFAULT NULL,
  `status` enum('Active','Inactive','Low Stock','Discontinued') DEFAULT 'Active',
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `stock`
--

INSERT INTO `stock` (`id`, `item_name`, `category`, `quantity`, `unit`, `price_per_unit`, `supplier_name`, `supplier_email`, `supplier_phone`, `purchase_date`, `expiry_date`, `location`, `description`, `status`, `created_at`, `updated_at`) VALUES
(1, 'Cotton Fiber Roll', 'Raw Material', 10.00, 'KG', 1000.00, 'ABC', 'ABC@gmail.com', '0987654123', '2025-11-26', NULL, 'Karachi', 'ABC', 'Active', '2025-11-26 13:38:44', '2025-11-26 18:24:43'),
(2, 'Printed Paper ', 'Raw Material', 100.00, 'KG', 99.00, 'Hunain', NULL, NULL, '2025-11-26', NULL, 'fast', 'this is test', 'Active', '2025-11-26 17:59:20', '2025-11-26 17:59:20'),
(3, 'Test PRoduct', 'Printed', 20.00, 'KG', 10.00, 'Saleem', NULL, NULL, '2025-11-26', NULL, NULL, NULL, 'Active', '2025-11-26 18:42:17', '2025-11-26 18:42:17');

-- --------------------------------------------------------

--
-- Table structure for table `transaction_journal`
--

CREATE TABLE `transaction_journal` (
  `id` int(11) NOT NULL,
  `journal_number` varchar(50) NOT NULL,
  `journal_date` date NOT NULL,
  `description` text NOT NULL,
  `total_debit` decimal(15,2) DEFAULT 0.00,
  `total_credit` decimal(15,2) DEFAULT 0.00,
  `status` enum('Draft','Posted','Reversed') DEFAULT 'Draft',
  `posted_by` int(11) DEFAULT NULL,
  `posted_date` timestamp NULL DEFAULT NULL,
  `notes` text DEFAULT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Table structure for table `transaction_journal_entries`
--

CREATE TABLE `transaction_journal_entries` (
  `id` int(11) NOT NULL,
  `journal_id` int(11) NOT NULL,
  `account_id` int(11) NOT NULL,
  `line_item_number` int(11) NOT NULL,
  `description` text DEFAULT NULL,
  `debit_amount` decimal(15,2) DEFAULT 0.00,
  `credit_amount` decimal(15,2) DEFAULT 0.00,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

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
(1, 2, NULL, NULL, '', '03435980052', 'A Rauf Textile', 'North ', 'user_2_1759942463180.png', NULL, NULL, 'UTC+5', 'en', 'PKR', 'YYYY-MM-DD', 0, 1, 1, 'light', NULL, '2025-10-01 16:53:22', '2025-10-08 20:46:08', 'user_2_1759494851048.png');

-- --------------------------------------------------------

--
-- Stand-in structure for view `vw_financial_year_summary`
-- (See below for the actual view)
--
CREATE TABLE `vw_financial_year_summary` (
`fy_id` int(11)
,`customer_id` int(11)
,`customer_name` varchar(255)
,`fy_name` varchar(100)
,`start_date` date
,`end_date` date
,`opening_debit` decimal(15,2)
,`opening_credit` decimal(15,2)
,`opening_balance` decimal(15,2)
,`closing_debit` decimal(15,2)
,`closing_credit` decimal(15,2)
,`closing_balance` decimal(15,2)
,`status` enum('open','closed','archived')
,`notes` text
,`entry_count` bigint(21)
,`total_debit` decimal(37,2)
,`total_credit` decimal(37,2)
,`created_at` timestamp
,`updated_at` timestamp
);

-- --------------------------------------------------------

--
-- Stand-in structure for view `vw_ledger_entries_complete`
-- (See below for the actual view)
--
CREATE TABLE `vw_ledger_entries_complete` (
`entry_id` int(11)
,`customer_id` int(11)
,`customer_name` varchar(255)
,`entry_date` date
,`description` varchar(500)
,`bill_no` varchar(100)
,`payment_mode` varchar(50)
,`cheque_no` varchar(100)
,`debit_amount` decimal(15,2)
,`credit_amount` decimal(15,2)
,`balance` decimal(15,2)
,`status` varchar(50)
,`due_date` date
,`has_multiple_items` tinyint(1)
,`sales_tax_rate` decimal(5,2)
,`sales_tax_amount` decimal(15,2)
,`sequence` decimal(10,1)
,`created_at` timestamp
,`updated_at` timestamp
);

-- --------------------------------------------------------

--
-- Structure for view `po_complete_history`
--
DROP TABLE IF EXISTS `po_complete_history`;

CREATE ALGORITHM=UNDEFINED DEFINER=`root`@`localhost` SQL SECURITY DEFINER VIEW `po_complete_history`  AS SELECT `po`.`po_number` AS `po_number`, `po`.`po_date` AS `po_date`, `po`.`supplier_name` AS `supplier_name`, `po`.`total_amount` AS `po_total_amount`, `po`.`status` AS `po_status`, `pi`.`id` AS `invoice_id`, `pi`.`invoice_number` AS `invoice_number`, `pi`.`invoice_date` AS `invoice_date`, `pi`.`due_date` AS `due_date`, `pi`.`total_amount` AS `invoice_amount`, `pi`.`status` AS `invoice_status`, `pi`.`payment_date` AS `payment_date`, `pi`.`payment_method` AS `payment_method`, `pi`.`customer_name` AS `customer_name`, `pi`.`notes` AS `invoice_notes`, `ps`.`total_invoiced_amount` AS `total_invoiced_amount`, `ps`.`remaining_amount` AS `remaining_amount`, `ps`.`invoice_count` AS `invoice_count`, `ps`.`last_invoice_date` AS `last_invoice_date`, CASE WHEN `ps`.`total_invoiced_amount` >= `po`.`total_amount` THEN 'Fully Invoiced' WHEN `ps`.`total_invoiced_amount` > 0 THEN 'Partially Invoiced' ELSE 'Not Invoiced' END AS `invoicing_status`, round(`ps`.`total_invoiced_amount` / `po`.`total_amount` * 100,2) AS `invoicing_percentage`, `pi`.`created_at` AS `invoice_created_at` FROM ((`purchase_orders` `po` left join `po_invoices` `pi` on(`po`.`po_number` = `pi`.`po_number`)) left join `po_invoice_summary` `ps` on(`po`.`po_number` = `ps`.`po_number`)) ORDER BY `po`.`po_date` DESC, `pi`.`invoice_date` DESC ;

-- --------------------------------------------------------

--
-- Structure for view `po_complete_summary`
--
DROP TABLE IF EXISTS `po_complete_summary`;

CREATE ALGORITHM=UNDEFINED DEFINER=`root`@`localhost` SQL SECURITY DEFINER VIEW `po_complete_summary`  AS SELECT `po`.`id` AS `po_id`, `po`.`po_number` AS `po_number`, `po`.`supplier_name` AS `supplier_name`, `po`.`total_amount` AS `po_total_amount`, `po`.`status` AS `po_status`, coalesce(sum(case when `pi`.`invoicing_mode` = 'amount' then `pi`.`total_amount` else 0 end),0) AS `amount_invoiced`, `po`.`total_amount`- coalesce(sum(case when `pi`.`invoicing_mode` = 'amount' then `pi`.`total_amount` else 0 end),0) AS `amount_remaining`, count(case when `pi`.`invoicing_mode` = 'amount' then `pi`.`id` end) AS `amount_invoice_count`, coalesce(sum(`poi`.`quantity`),0) AS `po_total_quantity`, coalesce(sum(case when `pi`.`invoicing_mode` in ('quantity','mixed') then `pi`.`invoiced_quantity` else 0 end),0) AS `quantity_invoiced`, coalesce(sum(`poi`.`quantity`),0) - coalesce(sum(case when `pi`.`invoicing_mode` in ('quantity','mixed') then `pi`.`invoiced_quantity` else 0 end),0) AS `quantity_remaining`, count(case when `pi`.`invoicing_mode` in ('quantity','mixed') then `pi`.`id` end) AS `quantity_invoice_count`, CASE WHEN count(distinct `pi`.`invoicing_mode`) > 1 THEN 'Mixed Invoicing' WHEN count(case when `pi`.`invoicing_mode` = 'amount' then 1 end) > 0 THEN 'Amount Based' WHEN count(case when `pi`.`invoicing_mode` in ('quantity','mixed') then 1 end) > 0 THEN 'Quantity Based' ELSE 'Not Invoiced' END AS `invoicing_type` FROM ((`purchase_orders` `po` left join `purchase_order_items` `poi` on(`po`.`id` = `poi`.`purchase_order_id`)) left join `po_invoices` `pi` on(`po`.`id` = `pi`.`po_id`)) GROUP BY `po`.`id`, `po`.`po_number`, `po`.`supplier_name`, `po`.`total_amount`, `po`.`status` ;

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

-- --------------------------------------------------------

--
-- Structure for view `po_item_quantity_tracking`
--
DROP TABLE IF EXISTS `po_item_quantity_tracking`;

CREATE ALGORITHM=UNDEFINED DEFINER=`root`@`localhost` SQL SECURITY DEFINER VIEW `po_item_quantity_tracking`  AS SELECT `poi`.`id` AS `po_item_id`, `poi`.`purchase_order_id` AS `po_id`, `po`.`po_number` AS `po_number`, `poi`.`item_no` AS `item_no`, `poi`.`description` AS `description`, `poi`.`quantity` AS `po_quantity`, `poi`.`unit` AS `unit`, `poi`.`unit_price` AS `unit_price`, `poi`.`amount` AS `po_amount`, coalesce(sum(`pii`.`invoiced_quantity`),0) AS `total_invoiced_quantity`, `poi`.`quantity`- coalesce(sum(`pii`.`invoiced_quantity`),0) AS `remaining_quantity`, CASE WHEN `poi`.`quantity` > 0 THEN coalesce(sum(`pii`.`invoiced_quantity`),0) / `poi`.`quantity` * 100 ELSE 0 END AS `item_invoicing_percentage`, CASE WHEN coalesce(sum(`pii`.`invoiced_quantity`),0) = 0 THEN 'Not Invoiced' WHEN `poi`.`quantity` - coalesce(sum(`pii`.`invoiced_quantity`),0) <= 0 THEN 'Fully Invoiced' ELSE 'Partially Invoiced' END AS `item_status`, count(`pii`.`id`) AS `invoice_count` FROM ((`purchase_order_items` `poi` left join `purchase_orders` `po` on(`poi`.`purchase_order_id` = `po`.`id`)) left join `po_invoice_items` `pii` on(`poi`.`id` = `pii`.`po_item_id`)) GROUP BY `poi`.`id`, `poi`.`purchase_order_id`, `po`.`po_number`, `poi`.`item_no`, `poi`.`description`, `poi`.`quantity`, `poi`.`unit`, `poi`.`unit_price`, `poi`.`amount` ;

-- --------------------------------------------------------

--
-- Structure for view `po_quantity_summary`
--
DROP TABLE IF EXISTS `po_quantity_summary`;

CREATE ALGORITHM=UNDEFINED DEFINER=`root`@`localhost` SQL SECURITY DEFINER VIEW `po_quantity_summary`  AS SELECT `po`.`id` AS `po_id`, `po`.`po_number` AS `po_number`, `po`.`supplier_name` AS `supplier_name`, `po`.`status` AS `po_status`, coalesce(sum(`poi`.`quantity`),0) AS `po_total_quantity`, coalesce(sum(case when `pi`.`invoicing_mode` in ('quantity','mixed') then `pi`.`invoiced_quantity` else 0 end),0) AS `total_invoiced_quantity`, coalesce(sum(`poi`.`quantity`),0) - coalesce(sum(case when `pi`.`invoicing_mode` in ('quantity','mixed') then `pi`.`invoiced_quantity` else 0 end),0) AS `remaining_quantity`, CASE WHEN coalesce(sum(`poi`.`quantity`),0) > 0 THEN coalesce(sum(case when `pi`.`invoicing_mode` in ('quantity','mixed') then `pi`.`invoiced_quantity` else 0 end),0) / sum(`poi`.`quantity`) * 100 ELSE 0 END AS `quantity_invoicing_percentage`, count(case when `pi`.`invoicing_mode` in ('quantity','mixed') then `pi`.`id` end) AS `quantity_invoice_count`, CASE WHEN coalesce(sum(`poi`.`quantity`),0) = 0 THEN 'No Items' WHEN coalesce(sum(case when `pi`.`invoicing_mode` in ('quantity','mixed') then `pi`.`invoiced_quantity` else 0 end),0) = 0 THEN 'Not Invoiced' WHEN coalesce(sum(`poi`.`quantity`),0) - coalesce(sum(case when `pi`.`invoicing_mode` in ('quantity','mixed') then `pi`.`invoiced_quantity` else 0 end),0) <= 0 THEN 'Fully Invoiced' ELSE 'Partially Invoiced' END AS `quantity_status` FROM ((`purchase_orders` `po` left join `purchase_order_items` `poi` on(`po`.`id` = `poi`.`purchase_order_id`)) left join `po_invoices` `pi` on(`po`.`id` = `pi`.`po_id`)) GROUP BY `po`.`id`, `po`.`po_number`, `po`.`supplier_name`, `po`.`status` ;

-- --------------------------------------------------------

--
-- Structure for view `vw_financial_year_summary`
--
DROP TABLE IF EXISTS `vw_financial_year_summary`;

CREATE ALGORITHM=UNDEFINED DEFINER=`root`@`localhost` SQL SECURITY DEFINER VIEW `vw_financial_year_summary`  AS SELECT `lfy`.`fy_id` AS `fy_id`, `lfy`.`customer_id` AS `customer_id`, `c`.`customer` AS `customer_name`, `lfy`.`fy_name` AS `fy_name`, `lfy`.`start_date` AS `start_date`, `lfy`.`end_date` AS `end_date`, `lfy`.`opening_debit` AS `opening_debit`, `lfy`.`opening_credit` AS `opening_credit`, `lfy`.`opening_balance` AS `opening_balance`, `lfy`.`closing_debit` AS `closing_debit`, `lfy`.`closing_credit` AS `closing_credit`, `lfy`.`closing_balance` AS `closing_balance`, `lfy`.`status` AS `status`, `lfy`.`notes` AS `notes`, (select count(0) from `ledger_entry_fy_mapping` where `ledger_entry_fy_mapping`.`fy_id` = `lfy`.`fy_id`) AS `entry_count`, (select coalesce(sum(`le`.`debit_amount`),0) from (`ledger_entries` `le` join `ledger_entry_fy_mapping` `lfm` on(`le`.`entry_id` = `lfm`.`entry_id`)) where `lfm`.`fy_id` = `lfy`.`fy_id` and `le`.`entry_date` between `lfy`.`start_date` and `lfy`.`end_date`) AS `total_debit`, (select coalesce(sum(`le`.`credit_amount`),0) from (`ledger_entries` `le` join `ledger_entry_fy_mapping` `lfm` on(`le`.`entry_id` = `lfm`.`entry_id`)) where `lfm`.`fy_id` = `lfy`.`fy_id` and `le`.`entry_date` between `lfy`.`start_date` and `lfy`.`end_date`) AS `total_credit`, `lfy`.`created_at` AS `created_at`, `lfy`.`updated_at` AS `updated_at` FROM (`ledger_financial_years` `lfy` left join `customertable` `c` on(`lfy`.`customer_id` = `c`.`customer_id`)) ;

-- --------------------------------------------------------

--
-- Structure for view `vw_ledger_entries_complete`
--
DROP TABLE IF EXISTS `vw_ledger_entries_complete`;

CREATE ALGORITHM=UNDEFINED DEFINER=`root`@`localhost` SQL SECURITY DEFINER VIEW `vw_ledger_entries_complete`  AS SELECT `le`.`entry_id` AS `entry_id`, `le`.`customer_id` AS `customer_id`, `ct`.`customer` AS `customer_name`, `le`.`entry_date` AS `entry_date`, `le`.`description` AS `description`, `le`.`bill_no` AS `bill_no`, `le`.`payment_mode` AS `payment_mode`, `le`.`cheque_no` AS `cheque_no`, `le`.`debit_amount` AS `debit_amount`, `le`.`credit_amount` AS `credit_amount`, `le`.`balance` AS `balance`, `le`.`status` AS `status`, `le`.`due_date` AS `due_date`, `le`.`has_multiple_items` AS `has_multiple_items`, `le`.`sales_tax_rate` AS `sales_tax_rate`, `le`.`sales_tax_amount` AS `sales_tax_amount`, `le`.`sequence` AS `sequence`, `le`.`created_at` AS `created_at`, `le`.`updated_at` AS `updated_at` FROM (`ledger_entries` `le` left join `customertable` `ct` on(`le`.`customer_id` = `ct`.`customer_id`)) ;

--
-- Indexes for dumped tables
--

--
-- Indexes for table `accounts_payable`
--
ALTER TABLE `accounts_payable`
  ADD PRIMARY KEY (`id`),
  ADD KEY `idx_supplier_id` (`supplier_id`),
  ADD KEY `idx_po_id` (`po_id`),
  ADD KEY `idx_due_date` (`due_date`),
  ADD KEY `idx_status` (`status`),
  ADD KEY `idx_aging_status` (`aging_status`);

--
-- Indexes for table `accounts_receivable`
--
ALTER TABLE `accounts_receivable`
  ADD PRIMARY KEY (`id`),
  ADD KEY `idx_customer_id` (`customer_id`),
  ADD KEY `idx_invoice_id` (`invoice_id`),
  ADD KEY `idx_due_date` (`due_date`),
  ADD KEY `idx_status` (`status`),
  ADD KEY `idx_aging_status` (`aging_status`);

--
-- Indexes for table `categories`
--
ALTER TABLE `categories`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `name` (`name`);

--
-- Indexes for table `chart_of_accounts`
--
ALTER TABLE `chart_of_accounts`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `account_code` (`account_code`),
  ADD UNIQUE KEY `unique_account_code` (`account_code`),
  ADD KEY `idx_account_type` (`account_type`),
  ADD KEY `idx_status` (`status`),
  ADD KEY `parent_account_id` (`parent_account_id`);

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
-- Indexes for table `general_ledger`
--
ALTER TABLE `general_ledger`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `unique_voucher` (`voucher_number`,`voucher_type`),
  ADD KEY `idx_transaction_date` (`transaction_date`),
  ADD KEY `idx_account_id` (`account_id`),
  ADD KEY `idx_voucher_type` (`voucher_type`),
  ADD KEY `idx_reference` (`reference_type`,`reference_id`),
  ADD KEY `posted_by` (`posted_by`);

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
-- Indexes for table `ledger_entries`
--
ALTER TABLE `ledger_entries`
  ADD PRIMARY KEY (`entry_id`),
  ADD KEY `idx_customer_id` (`customer_id`),
  ADD KEY `idx_entry_date` (`entry_date`),
  ADD KEY `idx_status` (`status`);

--
-- Indexes for table `ledger_entry_fy_mapping`
--
ALTER TABLE `ledger_entry_fy_mapping`
  ADD PRIMARY KEY (`mapping_id`),
  ADD UNIQUE KEY `unique_entry_fy` (`entry_id`,`fy_id`),
  ADD KEY `idx_fy_id` (`fy_id`);

--
-- Indexes for table `ledger_financial_years`
--
ALTER TABLE `ledger_financial_years`
  ADD PRIMARY KEY (`fy_id`),
  ADD UNIQUE KEY `unique_fy_period` (`customer_id`,`start_date`,`end_date`),
  ADD KEY `idx_customer_fy` (`customer_id`,`start_date`),
  ADD KEY `idx_status` (`status`);

--
-- Indexes for table `ledger_fy_closing_balance`
--
ALTER TABLE `ledger_fy_closing_balance`
  ADD PRIMARY KEY (`closing_id`),
  ADD KEY `fy_id` (`fy_id`),
  ADD KEY `idx_customer_fy` (`customer_id`,`fy_id`);

--
-- Indexes for table `ledger_line_items`
--
ALTER TABLE `ledger_line_items`
  ADD PRIMARY KEY (`id`),
  ADD KEY `idx_entry_id` (`entry_id`);

--
-- Indexes for table `ledger_single_materials`
--
ALTER TABLE `ledger_single_materials`
  ADD PRIMARY KEY (`id`),
  ADD KEY `idx_entry_id` (`entry_id`);

--
-- Indexes for table `payment_receipts`
--
ALTER TABLE `payment_receipts`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `receipt_number` (`receipt_number`),
  ADD UNIQUE KEY `unique_receipt` (`receipt_number`),
  ADD KEY `idx_receipt_date` (`receipt_date`),
  ADD KEY `idx_party_id` (`party_id`),
  ADD KEY `idx_status` (`status`),
  ADD KEY `account_id` (`account_id`),
  ADD KEY `posted_by` (`posted_by`);

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
  ADD KEY `idx_po_invoice_id` (`po_invoice_id`),
  ADD KEY `idx_po_item_id` (`po_item_id`),
  ADD KEY `idx_po_invoice_items_net_weight` (`net_weight`);

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
  ADD KEY `idx_po_items_order_id` (`purchase_order_id`),
  ADD KEY `idx_purchase_order_items_net_weight` (`net_weight`);

--
-- Indexes for table `reporttable`
--
ALTER TABLE `reporttable`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `stock`
--
ALTER TABLE `stock`
  ADD PRIMARY KEY (`id`),
  ADD KEY `idx_category` (`category`),
  ADD KEY `idx_status` (`status`),
  ADD KEY `idx_created_at` (`created_at`);

--
-- Indexes for table `transaction_journal`
--
ALTER TABLE `transaction_journal`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `journal_number` (`journal_number`),
  ADD UNIQUE KEY `unique_journal` (`journal_number`),
  ADD KEY `idx_journal_date` (`journal_date`),
  ADD KEY `idx_status` (`status`),
  ADD KEY `posted_by` (`posted_by`);

--
-- Indexes for table `transaction_journal_entries`
--
ALTER TABLE `transaction_journal_entries`
  ADD PRIMARY KEY (`id`),
  ADD KEY `idx_journal_id` (`journal_id`),
  ADD KEY `idx_account_id` (`account_id`);

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
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=9;

--
-- AUTO_INCREMENT for table `company_settings`
--
ALTER TABLE `company_settings`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `customertable`
--
ALTER TABLE `customertable`
  MODIFY `customer_id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=18;

--
-- AUTO_INCREMENT for table `expenses`
--
ALTER TABLE `expenses`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=9;

--
-- AUTO_INCREMENT for table `invoice`
--
ALTER TABLE `invoice`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=39;

--
-- AUTO_INCREMENT for table `invoice_items`
--
ALTER TABLE `invoice_items`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=63;

--
-- AUTO_INCREMENT for table `invoice_payments`
--
ALTER TABLE `invoice_payments`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `ledger_entries`
--
ALTER TABLE `ledger_entries`
  MODIFY `entry_id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=172;

--
-- AUTO_INCREMENT for table `ledger_entry_fy_mapping`
--
ALTER TABLE `ledger_entry_fy_mapping`
  MODIFY `mapping_id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `ledger_financial_years`
--
ALTER TABLE `ledger_financial_years`
  MODIFY `fy_id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=2;

--
-- AUTO_INCREMENT for table `ledger_fy_closing_balance`
--
ALTER TABLE `ledger_fy_closing_balance`
  MODIFY `closing_id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `ledger_line_items`
--
ALTER TABLE `ledger_line_items`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=10;

--
-- AUTO_INCREMENT for table `ledger_single_materials`
--
ALTER TABLE `ledger_single_materials`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=27;

--
-- AUTO_INCREMENT for table `po_deletion_history`
--
ALTER TABLE `po_deletion_history`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=43;

--
-- AUTO_INCREMENT for table `po_invoices`
--
ALTER TABLE `po_invoices`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=74;

--
-- AUTO_INCREMENT for table `po_invoice_items`
--
ALTER TABLE `po_invoice_items`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=39;

--
-- AUTO_INCREMENT for table `po_invoice_summary`
--
ALTER TABLE `po_invoice_summary`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=377;

--
-- AUTO_INCREMENT for table `purchase_orders`
--
ALTER TABLE `purchase_orders`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=43;

--
-- AUTO_INCREMENT for table `purchase_order_items`
--
ALTER TABLE `purchase_order_items`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=71;

--
-- AUTO_INCREMENT for table `stock`
--
ALTER TABLE `stock`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=4;

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
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=84;

--
-- Constraints for dumped tables
--

--
-- Constraints for table `accounts_payable`
--
ALTER TABLE `accounts_payable`
  ADD CONSTRAINT `accounts_payable_ibfk_1` FOREIGN KEY (`po_id`) REFERENCES `purchase_orders` (`id`) ON DELETE SET NULL;

--
-- Constraints for table `accounts_receivable`
--
ALTER TABLE `accounts_receivable`
  ADD CONSTRAINT `accounts_receivable_ibfk_1` FOREIGN KEY (`customer_id`) REFERENCES `customertable` (`customer_id`),
  ADD CONSTRAINT `accounts_receivable_ibfk_2` FOREIGN KEY (`invoice_id`) REFERENCES `invoice` (`id`) ON DELETE SET NULL;

--
-- Constraints for table `chart_of_accounts`
--
ALTER TABLE `chart_of_accounts`
  ADD CONSTRAINT `chart_of_accounts_ibfk_1` FOREIGN KEY (`parent_account_id`) REFERENCES `chart_of_accounts` (`id`) ON DELETE SET NULL;

--
-- Constraints for table `expenses`
--
ALTER TABLE `expenses`
  ADD CONSTRAINT `fk_expense_category` FOREIGN KEY (`category_id`) REFERENCES `categories` (`id`) ON DELETE SET NULL;

--
-- Constraints for table `general_ledger`
--
ALTER TABLE `general_ledger`
  ADD CONSTRAINT `general_ledger_ibfk_1` FOREIGN KEY (`account_id`) REFERENCES `chart_of_accounts` (`id`),
  ADD CONSTRAINT `general_ledger_ibfk_2` FOREIGN KEY (`posted_by`) REFERENCES `users` (`id`) ON DELETE SET NULL;

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
-- Constraints for table `ledger_entries`
--
ALTER TABLE `ledger_entries`
  ADD CONSTRAINT `fk_ledger_entries_customer` FOREIGN KEY (`customer_id`) REFERENCES `customertable` (`customer_id`) ON DELETE CASCADE;

--
-- Constraints for table `ledger_entry_fy_mapping`
--
ALTER TABLE `ledger_entry_fy_mapping`
  ADD CONSTRAINT `ledger_entry_fy_mapping_ibfk_1` FOREIGN KEY (`entry_id`) REFERENCES `ledger_entries` (`entry_id`) ON DELETE CASCADE,
  ADD CONSTRAINT `ledger_entry_fy_mapping_ibfk_2` FOREIGN KEY (`fy_id`) REFERENCES `ledger_financial_years` (`fy_id`) ON DELETE CASCADE;

--
-- Constraints for table `ledger_financial_years`
--
ALTER TABLE `ledger_financial_years`
  ADD CONSTRAINT `ledger_financial_years_ibfk_1` FOREIGN KEY (`customer_id`) REFERENCES `customertable` (`customer_id`) ON DELETE CASCADE;

--
-- Constraints for table `ledger_fy_closing_balance`
--
ALTER TABLE `ledger_fy_closing_balance`
  ADD CONSTRAINT `ledger_fy_closing_balance_ibfk_1` FOREIGN KEY (`fy_id`) REFERENCES `ledger_financial_years` (`fy_id`) ON DELETE CASCADE,
  ADD CONSTRAINT `ledger_fy_closing_balance_ibfk_2` FOREIGN KEY (`customer_id`) REFERENCES `customertable` (`customer_id`) ON DELETE CASCADE;

--
-- Constraints for table `ledger_line_items`
--
ALTER TABLE `ledger_line_items`
  ADD CONSTRAINT `fk_ledger_line_items_entry` FOREIGN KEY (`entry_id`) REFERENCES `ledger_entries` (`entry_id`) ON DELETE CASCADE;

--
-- Constraints for table `ledger_single_materials`
--
ALTER TABLE `ledger_single_materials`
  ADD CONSTRAINT `fk_ledger_single_materials_entry` FOREIGN KEY (`entry_id`) REFERENCES `ledger_entries` (`entry_id`) ON DELETE CASCADE;

--
-- Constraints for table `payment_receipts`
--
ALTER TABLE `payment_receipts`
  ADD CONSTRAINT `payment_receipts_ibfk_1` FOREIGN KEY (`account_id`) REFERENCES `chart_of_accounts` (`id`) ON DELETE SET NULL,
  ADD CONSTRAINT `payment_receipts_ibfk_2` FOREIGN KEY (`posted_by`) REFERENCES `users` (`id`) ON DELETE SET NULL;

--
-- Constraints for table `po_invoice_items`
--
ALTER TABLE `po_invoice_items`
  ADD CONSTRAINT `po_invoice_items_ibfk_1` FOREIGN KEY (`po_invoice_id`) REFERENCES `po_invoices` (`id`) ON DELETE CASCADE,
  ADD CONSTRAINT `po_invoice_items_ibfk_2` FOREIGN KEY (`po_item_id`) REFERENCES `purchase_order_items` (`id`) ON DELETE CASCADE;

--
-- Constraints for table `purchase_order_items`
--
ALTER TABLE `purchase_order_items`
  ADD CONSTRAINT `purchase_order_items_ibfk_1` FOREIGN KEY (`purchase_order_id`) REFERENCES `purchase_orders` (`id`) ON DELETE CASCADE;

--
-- Constraints for table `transaction_journal`
--
ALTER TABLE `transaction_journal`
  ADD CONSTRAINT `transaction_journal_ibfk_1` FOREIGN KEY (`posted_by`) REFERENCES `users` (`id`) ON DELETE SET NULL;

--
-- Constraints for table `transaction_journal_entries`
--
ALTER TABLE `transaction_journal_entries`
  ADD CONSTRAINT `transaction_journal_entries_ibfk_1` FOREIGN KEY (`journal_id`) REFERENCES `transaction_journal` (`id`) ON DELETE CASCADE,
  ADD CONSTRAINT `transaction_journal_entries_ibfk_2` FOREIGN KEY (`account_id`) REFERENCES `chart_of_accounts` (`id`);

--
-- Constraints for table `user_sessions`
--
ALTER TABLE `user_sessions`
  ADD CONSTRAINT `user_sessions_ibfk_1` FOREIGN KEY (`user_id`) REFERENCES `user_settings` (`user_id`) ON DELETE CASCADE;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;