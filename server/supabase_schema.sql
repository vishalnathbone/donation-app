-- ========================================================
-- Supabase Schema for Donation & Expense Management System
-- ========================================================

-- Enable UUID extension if needed
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- 1. USERS TABLE
CREATE TABLE IF NOT EXISTS users (
  id VARCHAR(100) PRIMARY KEY,
  year INT NOT NULL DEFAULT 2026,
  name VARCHAR(255) NOT NULL,
  email VARCHAR(255) NOT NULL UNIQUE,
  password_hash TEXT NOT NULL,
  role VARCHAR(50) NOT NULL DEFAULT 'COLLECTOR',
  status VARCHAR(50) NOT NULL DEFAULT 'ACTIVE',
  mobile VARCHAR(20),
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 2. DONATION TYPES TABLE
CREATE TABLE IF NOT EXISTS donation_types (
  id VARCHAR(100) PRIMARY KEY,
  year INT NOT NULL DEFAULT 2026,
  name VARCHAR(255) NOT NULL,
  description TEXT,
  status VARCHAR(50) NOT NULL DEFAULT 'APPROVED',
  created_by VARCHAR(100) NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  approved_by VARCHAR(100),
  approved_at TIMESTAMPTZ,
  rejection_reason TEXT
);

-- 3. DONATIONS TABLE
CREATE TABLE IF NOT EXISTS donations (
  id VARCHAR(100) PRIMARY KEY,
  year INT NOT NULL DEFAULT 2026,
  donor_name VARCHAR(255) NOT NULL,
  mobile_number VARCHAR(20),
  email VARCHAR(255),
  address TEXT,
  donation_type_id VARCHAR(100) NOT NULL,
  donation_type_name VARCHAR(255) NOT NULL,
  amount NUMERIC(12, 2) NOT NULL,
  payment_mode VARCHAR(50) NOT NULL DEFAULT 'CASH',
  transaction_ref VARCHAR(255),
  donation_date VARCHAR(50) NOT NULL,
  notes TEXT,
  status VARCHAR(50) NOT NULL DEFAULT 'APPROVED',
  created_by VARCHAR(100) NOT NULL,
  created_by_name VARCHAR(255) NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  confirmed_by VARCHAR(100),
  confirmed_by_name VARCHAR(255),
  confirmed_at TIMESTAMPTZ,
  rejection_reason TEXT,
  receipt_no VARCHAR(100)
);

-- 4. EXPENSES TABLE
CREATE TABLE IF NOT EXISTS expenses (
  id VARCHAR(100) PRIMARY KEY,
  year INT NOT NULL DEFAULT 2026,
  date VARCHAR(50) NOT NULL,
  category VARCHAR(100) NOT NULL,
  description TEXT NOT NULL,
  amount NUMERIC(12, 2) NOT NULL,
  payment_mode VARCHAR(50) NOT NULL DEFAULT 'CASH',
  reference VARCHAR(255),
  attachment TEXT,
  notes TEXT,
  status VARCHAR(50) NOT NULL DEFAULT 'PENDING',
  created_by VARCHAR(100) NOT NULL,
  created_by_name VARCHAR(255) NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  confirmed_by VARCHAR(100),
  confirmed_by_name VARCHAR(255),
  confirmed_at TIMESTAMPTZ,
  rejection_reason TEXT
);

-- 5. RECEIPTS TABLE
CREATE TABLE IF NOT EXISTS receipts (
  receipt_no VARCHAR(100) PRIMARY KEY,
  donation_id VARCHAR(100) NOT NULL,
  year INT NOT NULL DEFAULT 2026,
  generated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  file_name VARCHAR(255) NOT NULL,
  generated_by VARCHAR(100) NOT NULL
);

-- 6. AUDIT LOGS TABLE
CREATE TABLE IF NOT EXISTS audit_logs (
  id VARCHAR(100) PRIMARY KEY,
  year INT NOT NULL DEFAULT 2026,
  action VARCHAR(100) NOT NULL,
  entity_type VARCHAR(100) NOT NULL,
  entity_id VARCHAR(100) NOT NULL,
  performed_by VARCHAR(100) NOT NULL,
  performed_by_name VARCHAR(255),
  timestamp TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  old_value JSONB,
  new_value JSONB
);

-- 7. SETTINGS TABLE
CREATE TABLE IF NOT EXISTS settings (
  year INT PRIMARY KEY,
  org_name VARCHAR(255) NOT NULL,
  org_address TEXT NOT NULL,
  org_mobile VARCHAR(50) NOT NULL,
  org_email VARCHAR(255) NOT NULL,
  receipt_prefix VARCHAR(20) NOT NULL DEFAULT 'REC',
  donation_prefix VARCHAR(20) NOT NULL DEFAULT 'DON',
  expense_prefix VARCHAR(20) NOT NULL DEFAULT 'EXP'
);

-- INDEXES FOR PERFORMANCE & YEAR-BASED FILTERING
CREATE INDEX IF NOT EXISTS idx_users_year ON users(year);
CREATE INDEX IF NOT EXISTS idx_users_email ON users(email);
CREATE INDEX IF NOT EXISTS idx_donation_types_year ON donation_types(year);
CREATE INDEX IF NOT EXISTS idx_donations_year ON donations(year);
CREATE INDEX IF NOT EXISTS idx_donations_status ON donations(status);
CREATE INDEX IF NOT EXISTS idx_donations_created_by ON donations(created_by);
CREATE INDEX IF NOT EXISTS idx_expenses_year ON expenses(year);
CREATE INDEX IF NOT EXISTS idx_expenses_status ON expenses(status);
CREATE INDEX IF NOT EXISTS idx_receipts_year ON receipts(year);
CREATE INDEX IF NOT EXISTS idx_receipts_donation_id ON receipts(donation_id);
CREATE INDEX IF NOT EXISTS idx_audit_logs_year ON audit_logs(year);

-- DISABLE RLS FOR INTERNAL API BACKEND (OR ENABLE WITH ALL ALLOWED FOR SERVICE ROLE / ANON API KEY)
ALTER TABLE users DISABLE ROW LEVEL SECURITY;
ALTER TABLE donation_types DISABLE ROW LEVEL SECURITY;
ALTER TABLE donations DISABLE ROW LEVEL SECURITY;
ALTER TABLE expenses DISABLE ROW LEVEL SECURITY;
ALTER TABLE receipts DISABLE ROW LEVEL SECURITY;
ALTER TABLE audit_logs DISABLE ROW LEVEL SECURITY;
ALTER TABLE settings DISABLE ROW LEVEL SECURITY;

-- DEFAULT SEED DATA FOR ADMIN USER (password: admin123 -> bcrypt hash $2a$10$wTf7m09R3.m0zN1a/j5P4e7gD3k2w1m0zN1a/j5P4e7gD3k2w1m0z)
-- Seed Admin user if not exists
INSERT INTO users (id, year, name, email, password_hash, role, status, mobile)
VALUES (
  'USR-ADMIN-001',
  2026,
  'System Administrator',
  'admin@example.com',
  '$2a$10$r.7gZ1Bq4G2m1S9P1Y.4ue1Q/4P5A.9R0u1/4P5A.9R0u1/4P5A.9', -- standard test hash for admin123
  'ADMIN',
  'ACTIVE',
  '+91 98765 43210'
) ON CONFLICT (id) DO NOTHING;

-- Seed Default Settings
INSERT INTO settings (year, org_name, org_address, org_mobile, org_email, receipt_prefix, donation_prefix, expense_prefix)
VALUES (
  2026,
  'Shree Krishna Seva Trust',
  '108 Divine Complex, Temple Road, Mumbai, Maharashtra - 400001',
  '+91 98765 43210',
  'info@krishnaseva.org',
  'REC',
  'DON',
  'EXP'
) ON CONFLICT (year) DO NOTHING;
