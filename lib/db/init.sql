-- Create database
CREATE DATABASE IF NOT EXISTS healthcare_db;
USE healthcare_db;

-- Create clinics table
CREATE TABLE IF NOT EXISTS clinics (
  id VARCHAR(36) PRIMARY KEY DEFAULT (UUID()),
  name VARCHAR(255) NOT NULL,
  email VARCHAR(255) UNIQUE NOT NULL,
  phone VARCHAR(20),
  address TEXT,
  subscription_plan ENUM('basic', 'professional', 'enterprise') DEFAULT 'basic',
  is_active BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- Create users table
CREATE TABLE IF NOT EXISTS users (
  id VARCHAR(36) PRIMARY KEY DEFAULT (UUID()),
  clinic_id VARCHAR(36) NOT NULL,
  email VARCHAR(255) UNIQUE NOT NULL,
  password_hash VARCHAR(255) NOT NULL,
  first_name VARCHAR(100) NOT NULL,
  last_name VARCHAR(100) NOT NULL,
  role ENUM('admin', 'doctor', 'nurse', 'lab_tech', 'patient', 'receptionist', 'pharmacist') NOT NULL,
  phone VARCHAR(20),
  license_number VARCHAR(100),
  specialization VARCHAR(100),
  is_active BOOLEAN DEFAULT TRUE,
  email_verified BOOLEAN DEFAULT FALSE,
  last_login TIMESTAMP NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  
  FOREIGN KEY (clinic_id) REFERENCES clinics(id) ON DELETE CASCADE,
  INDEX idx_clinic_email (clinic_id, email),
  INDEX idx_role (role),
  INDEX idx_active (is_active)
);

-- Create refresh tokens table
CREATE TABLE IF NOT EXISTS refresh_tokens (
  id VARCHAR(36) PRIMARY KEY DEFAULT (UUID()),
  user_id VARCHAR(36) NOT NULL,
  token_hash VARCHAR(255) NOT NULL,
  expires_at TIMESTAMP NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
  INDEX idx_user_id (user_id),
  INDEX idx_expires (expires_at)
);

-- Create user sessions table
CREATE TABLE IF NOT EXISTS user_sessions (
  id VARCHAR(36) PRIMARY KEY DEFAULT (UUID()),
  user_id VARCHAR(36) NOT NULL,
  ip_address VARCHAR(45),
  user_agent TEXT,
  login_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  logout_at TIMESTAMP NULL,
  
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
  INDEX idx_user_id (user_id)
);

-- Insert sample clinic
INSERT INTO clinics (id, name, email, phone, address) VALUES 
('clinic-1', 'General Hospital', 'admin@generalhospital.com', '+1-555-0100', '123 Health St, Medical City, MC 12345'),
('clinic-2', 'City Medical Center', 'info@citymedical.com', '+1-555-0200', '456 Care Ave, Health Town, HT 67890'),
('clinic-3', 'Downtown Clinic', 'contact@downtownclinic.com', '+1-555-0300', '789 Wellness Blvd, Clinic City, CC 54321');

-- Insert sample admin user (password: Admin123!)
INSERT INTO users (
  id, clinic_id, email, password_hash, first_name, last_name, role, 
  license_number, is_active, email_verified
) VALUES (
  'admin-1', 
  'clinic-1', 
  'admin@generalhospital.com', 
  '$2a$12$LQv3c1yqBWVHxkd0LHAkCOYz6TtxMQJqhN8/LewfBr4Z6.qVUdePK',  -- Admin123!
  'System', 
  'Administrator', 
  'admin', 
  'ADM001', 
  TRUE, 
  TRUE
);

-- Insert sample doctor (password: Doctor123!)
INSERT INTO users (
  id, clinic_id, email, password_hash, first_name, last_name, role, 
  phone, license_number, specialization, is_active, email_verified
) VALUES (
  'doctor-1', 
  'clinic-1', 
  'dr.smith@generalhospital.com', 
  '$2a$12$LQv3c1yqBWVHxkd0LHAkCOYz6TtxMQJqhN8/LewfBr4Z6.qVUdePK',  -- Doctor123!
  'John', 
  'Smith', 
  'doctor', 
  '+1-555-0101',
  'MD12345', 
  'Cardiology', 
  TRUE, 
  TRUE
);

-- Insert sample nurse (password: Nurse123!)
INSERT INTO users (
  id, clinic_id, email, password_hash, first_name, last_name, role, 
  phone, license_number, is_active, email_verified
) VALUES (
  'nurse-1', 
  'clinic-1', 
  'nurse.johnson@generalhospital.com', 
  '$2a$12$LQv3c1yqBWVHxkd0LHAkCOYz6TtxMQJqhN8/LewfBr4Z6.qVUdePK',  -- Nurse123!
  'Sarah', 
  'Johnson', 
  'nurse', 
  '+1-555-0102',
  'RN67890', 
  TRUE, 
  TRUE
);

-- Insert sample patient (password: Patient123!)
INSERT INTO users (
  id, clinic_id, email, password_hash, first_name, last_name, role, 
  phone, is_active, email_verified
) VALUES (
  'patient-1', 
  'clinic-1', 
  'patient@example.com', 
  '$2a$12$LQv3c1yqBWVHxkd0LHAkCOYz6TtxMQJqhN8/LewfBr4Z6.qVUdePK',  -- Patient123!
  'Michael', 
  'Wilson', 
  'patient', 
  '+1-555-0103',
  TRUE, 
  TRUE
);