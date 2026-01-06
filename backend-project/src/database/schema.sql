CREATE DATABASE IF NOT EXISTS epms_db;
USE epms_db;

CREATE TABLE IF NOT EXISTS users (
    id INT AUTO_INCREMENT PRIMARY KEY,
    username VARCHAR(50) NOT NULL UNIQUE,
    password VARCHAR(255) NOT NULL,
    role ENUM('admin', 'user') NOT NULL DEFAULT 'user'
);

CREATE TABLE IF NOT EXISTS departments (
    departmentCode VARCHAR(10) PRIMARY KEY,
    departmentName VARCHAR(100) NOT NULL,
    grossSalary DECIMAL(10,2) NOT NULL,
    totalDeduction DECIMAL(10,2) NOT NULL
);

CREATE TABLE IF NOT EXISTS employees (
    employeeNumber VARCHAR(20) PRIMARY KEY,
    firstName VARCHAR(50) NOT NULL,
    lastName VARCHAR(50) NOT NULL,
    position VARCHAR(100) NOT NULL,
    address VARCHAR(200) NOT NULL,
    telephone VARCHAR(20) NOT NULL,
    gender ENUM('M', 'F') NOT NULL,
    hireDate DATE NOT NULL,
    departmentCode VARCHAR(10) NOT NULL,
    FOREIGN KEY (departmentCode) REFERENCES departments(departmentCode)
);

CREATE TABLE IF NOT EXISTS salaries (
    employeeNumber VARCHAR(20),
    grossSalary DECIMAL(10,2) NOT NULL,
    totalDeduction DECIMAL(10,2) NOT NULL,
    netSalary DECIMAL(10,2) NOT NULL,
    month VARCHAR(7) NOT NULL, -- Format: YYYY-MM
    PRIMARY KEY (employeeNumber, month),
    FOREIGN KEY (employeeNumber) REFERENCES employees(employeeNumber)
);

-- Insert sample department data
INSERT INTO departments (departmentCode, departmentName, grossSalary, totalDeduction) VALUES
('CW', 'Carwash', 300000, 20000),
('ST', 'Stock', 300000, 5000),
('MC', 'Mechanic', 450000, 40000),
('ADMIS', 'Administration Staff', 600000, 70000);

-- Insert sample employee data
INSERT INTO employees (employeeNumber, firstName, lastName, position, address, telephone, gender, hireDate, departmentCode) VALUES
('EMP001', 'John', 'Doe', 'Car Washer', '123 Main St, Rubavu', '+250780123456', 'M', '2023-01-15', 'CW'),
('EMP002', 'Jane', 'Smith', 'Stock Manager', '456 Park Ave, Rubavu', '+250780234567', 'F', '2023-02-01', 'ST'),
('EMP003', 'Robert', 'Johnson', 'Senior Mechanic', '789 Lake Rd, Rubavu', '+250780345678', 'M', '2023-01-10', 'MC'),
('EMP004', 'Mary', 'Williams', 'Admin Assistant', '321 Hill St, Rubavu', '+250780456789', 'F', '2023-03-01', 'ADMIS'),
('EMP005', 'James', 'Brown', 'Car Washer', '654 Beach Rd, Rubavu', '+250780567890', 'M', '2023-02-15', 'CW'),
('EMP006', 'Sarah', 'Davis', 'Stock Clerk', '987 Forest Ave, Rubavu', '+250780678901', 'F', '2023-03-15', 'ST'),
('EMP007', 'Michael', 'Miller', 'Junior Mechanic', '147 River St, Rubavu', '+250780789012', 'M', '2023-02-20', 'MC'),
('EMP008', 'Patricia', 'Wilson', 'Admin Manager', '258 Mountain Ave, Rubavu', '+250780890123', 'F', '2023-01-20', 'ADMIS');

-- Insert sample salary data for the current month
INSERT INTO salaries (employeeNumber, grossSalary, totalDeduction, netSalary, month) VALUES
('EMP001', 300000, 20000, 280000, '2024-05'),
('EMP002', 300000, 5000, 295000, '2024-05'),
('EMP003', 450000, 40000, 410000, '2024-05'),
('EMP004', 600000, 70000, 530000, '2024-05'),
('EMP005', 300000, 20000, 280000, '2024-05'),
('EMP006', 300000, 5000, 295000, '2024-05'),
('EMP007', 450000, 40000, 410000, '2024-05'),
('EMP008', 600000, 70000, 530000, '2024-05');

-- NOTE: Admin user seeding moved to script to ensure correct bcrypt hashing.
-- Run the script at `src/scripts/createAdmin.ts` after database setup to create the admin user.