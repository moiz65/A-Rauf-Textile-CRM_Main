-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Host: 127.0.0.1
-- Generation Time: Sep 19, 2025 at 08:10 PM
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
(5, 'Admin Admin', 'ABC Corporation', '2025-09-18', '+92123456789', 'Street 1', 'Admin@gmail.com', '2025-09-10 18:58:04', '2025-09-10 20:06:42');

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
  `updated_at` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `expenses`
--

INSERT INTO `expenses` (`id`, `title`, `date`, `vendor`, `amount`, `category`, `paymentMethod`, `status`, `description`, `created_at`, `updated_at`) VALUES
(2, 'Machine Maintenance', '2025-03-15', 'TechServ Inc.', 75000.00, 'Equipment', 'Cash', 'Pending', 'Monthly maintenance service', '2025-09-08 18:33:58', '2025-09-08 18:33:58'),
(4, 'Utility Bills', '2025-05-05', 'K-Electric', 45000.00, 'Utilities', 'Bank Transfer', 'Paid', 'Monthly electricity bill', '2025-09-08 18:33:58', '2025-09-08 18:33:58'),
(5, 'Employee Salaries', '2025-06-10', 'Payroll', 250000.00, 'Payroll', 'Bank Transfer', 'Pending', 'Monthly staff salaries', '2025-09-08 18:33:58', '2025-09-08 18:33:58'),
(6, 'Transportation', '2025-07-15', 'City Logistics', 18000.00, 'Logistics', 'Cash', 'Paid', 'Fabric delivery charges', '2025-09-08 18:33:58', '2025-09-08 18:33:58'),
(8, 'Driver Expense', '2025-09-19', 'A Rauf Textile', 15000.00, 'Payroll', 'Online Payment', 'Paid', '', '2025-09-08 19:11:32', '2025-09-08 19:13:25'),
(9, 'Salaries', '2025-09-25', 'A Rauf Textile', 1522520.00, 'Payroll', 'Bank Transfer', 'Pending', 'Hello Testing', '2025-09-08 19:11:43', '2025-09-08 19:12:13');

-- --------------------------------------------------------

--
-- Table structure for table `invoice`
--

CREATE TABLE `invoice` (
  `id` int(11) NOT NULL,
  `customer_id` int(11) DEFAULT NULL,
  `customer_name` varchar(255) NOT NULL,
  `customer_email` varchar(255) NOT NULL,
  `p_number` varchar(255) NOT NULL,
  `a_p_number` varchar(255) NOT NULL,
  `address` varchar(255) NOT NULL,
  `st_reg_no` varchar(255) NOT NULL,
  `ntn_number` varchar(255) NOT NULL,
  `item_name` varchar(255) NOT NULL,
  `quantity` int(255) NOT NULL,
  `rate` int(255) NOT NULL,
  `currency` varchar(255) NOT NULL,
  `salesTax` int(255) NOT NULL,
  `item_amount` int(255) NOT NULL,
  `tax_amount` int(255) NOT NULL,
  `total_amount` int(255) NOT NULL,
  `bill_date` date NOT NULL,
  `payment_deadline` date NOT NULL,
  `Note` varchar(255) NOT NULL,
  `status` varchar(50) DEFAULT 'Pending'
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `invoice`
--

INSERT INTO `invoice` (`id`, `customer_id`, `customer_name`, `customer_email`, `p_number`, `a_p_number`, `address`, `st_reg_no`, `ntn_number`, `item_name`, `quantity`, `rate`, `currency`, `salesTax`, `item_amount`, `tax_amount`, `total_amount`, `bill_date`, `payment_deadline`, `Note`, `status`) VALUES
(21, NULL, 'John Doe', 'johndoe@gmail.com', '5458634756', '', '324', '', '', 'cfgdfg', 545, 4545, 'PKR', 454, 2477025, 11245694, 13722719, '2025-09-05', '2025-09-25', '', 'Pending'),
(22, NULL, 'James Robert', 'johndoe@gmail.com', '5458634756', '', 'street 1', '', '', 'Bedsheet', 454, 245, 'PKR', 45, 111230, 50054, 161284, '2025-09-08', '2025-09-14', '', 'Overdue'),
(25, NULL, 'Shameel Arif', 'Shameel@gmail.com', '5458634756', '5458634756', 'Block D', '1541284514558648', '15848956458725456', 'Towels', 253, 14, 'PKR', 13, 3542, 460, 4002, '2025-09-09', '2025-09-24', 'Hello Testing for Invoice', ''),
(26, NULL, 'John Doe', 'johndoe@gmail.com', '5458634756', '5458634756', '324', '1541284514558', '1584895645872', 'Bedsheet', 2, 213, 'PKR', 12, 426, 51, 477, '2025-09-18', '2025-12-11', 'this is test invoice', 'Pending');

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
('15', '2025-09-08', 'Abdul Moiz', 250000.00, 'Pending');

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

--
-- Indexes for dumped tables
--

--
-- Indexes for table `customertable`
--
ALTER TABLE `customertable`
  ADD PRIMARY KEY (`customer_id`);

--
-- Indexes for table `expenses`
--
ALTER TABLE `expenses`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `invoice`
--
ALTER TABLE `invoice`
  ADD PRIMARY KEY (`id`),
  ADD KEY `fk_invoice_customer` (`customer_id`);

--
-- Indexes for table `reporttable`
--
ALTER TABLE `reporttable`
  ADD PRIMARY KEY (`id`);

--
-- AUTO_INCREMENT for dumped tables
--

--
-- AUTO_INCREMENT for table `customertable`
--
ALTER TABLE `customertable`
  MODIFY `customer_id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=6;

--
-- AUTO_INCREMENT for table `expenses`
--
ALTER TABLE `expenses`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=11;

--
-- AUTO_INCREMENT for table `invoice`
--
ALTER TABLE `invoice`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=27;

--
-- Constraints for dumped tables
--

--
-- Constraints for table `invoice`
--
ALTER TABLE `invoice`
  ADD CONSTRAINT `fk_invoice_customer` FOREIGN KEY (`customer_id`) REFERENCES `customertable` (`customer_id`) ON DELETE SET NULL;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
