-- Stock Management Table
CREATE TABLE IF NOT EXISTS stock (
  id INT AUTO_INCREMENT PRIMARY KEY,
  item_name VARCHAR(255) NOT NULL,
  category VARCHAR(100),
  quantity DECIMAL(10, 2) NOT NULL,
  unit VARCHAR(50) DEFAULT 'KG',
  price_per_unit DECIMAL(10, 2) DEFAULT 0,
  supplier_name VARCHAR(255),
  supplier_email VARCHAR(255),
  supplier_phone VARCHAR(20),
  purchase_date DATE,
  expiry_date DATE,
  location VARCHAR(255),
  description TEXT,
  status ENUM('Active', 'Inactive', 'Low Stock', 'Discontinued') DEFAULT 'Active',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  INDEX idx_category (category),
  INDEX idx_status (status),
  INDEX idx_created_at (created_at)
);
