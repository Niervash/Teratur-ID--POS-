-- ============================================
-- TERATUR.ID Database Schema
-- Compatible: PostgreSQL / MySQL
-- ============================================

-- 1. ENUM TYPES (PostgreSQL only, for MySQL use VARCHAR + CHECK)
CREATE TYPE user_role AS ENUM ('manager', 'cashier');
CREATE TYPE material_category AS ENUM ('bahan_baku', 'tenaga_kerja', 'overhead', 'operasional', 'administrasi');
CREATE TYPE ingredient_category AS ENUM ('raw', 'packaging', 'other');
CREATE TYPE transaction_type AS ENUM ('income', 'expense');
CREATE TYPE wage_type AS ENUM ('daily', 'monthly');
CREATE TYPE payment_method AS ENUM ('cash', 'card', 'transfer');

-- ============================================
-- 2. USERS TABLE
-- ============================================
CREATE TABLE users (
    id SERIAL PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    email VARCHAR(150) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    role user_role NOT NULL DEFAULT 'cashier',
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Index for login queries
CREATE INDEX idx_users_email ON users(email);

-- ============================================
-- 3. BUSINESS SETTINGS TABLE
-- ============================================
CREATE TABLE business_settings (
    id SERIAL PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    type VARCHAR(50) NOT NULL,
    address TEXT,
    phone VARCHAR(20),
    founding_date DATE,
    initial_capital DECIMAL(15, 2) DEFAULT 0,
    capital_source VARCHAR(100),
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Insert default
INSERT INTO business_settings (name, type, address, phone, founding_date, initial_capital, capital_source)
VALUES ('TERATUR.ID Coffee', 'Kuliner', 'Jl. Sudirman No. 123, Jakarta', '021-1234567', '2024-01-01', 50000000, 'Investasi Pribadi');

-- ============================================
-- 4. RAW MATERIALS TABLE (Bahan Baku & Biaya)
-- ============================================
CREATE TABLE raw_materials (
    id SERIAL PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    price_per_unit DECIMAL(15, 2) NOT NULL,
    unit VARCHAR(20) NOT NULL,
    category material_category NOT NULL,
    description TEXT,
    stock_current DECIMAL(15, 2) DEFAULT 0,
    min_stock DECIMAL(15, 2) DEFAULT 0,
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_raw_materials_category ON raw_materials(category);

-- ============================================
-- 5. PRODUCTS TABLE
-- ============================================
CREATE TABLE products (
    id SERIAL PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    category VARCHAR(50) NOT NULL,
    emoji VARCHAR(10) DEFAULT '📦',
    selling_price DECIMAL(15, 2) NOT NULL,
    hpp DECIMAL(15, 2) DEFAULT 0,
    margin DECIMAL(5, 2) DEFAULT 0,
    labor_cost DECIMAL(15, 2) DEFAULT 0,
    overhead_cost DECIMAL(15, 2) DEFAULT 0,
    stock_initial INT DEFAULT 0,
    stock_current INT DEFAULT 0,
    unit VARCHAR(20) DEFAULT 'Pcs',
    description TEXT,
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_products_category ON products(category);

-- ============================================
-- 6. PRODUCT INGREDIENTS TABLE (Resep Produk)
-- ============================================
CREATE TABLE product_ingredients (
    id SERIAL PRIMARY KEY,
    product_id INT NOT NULL REFERENCES products(id) ON DELETE CASCADE,
    material_id INT REFERENCES raw_materials(id) ON DELETE SET NULL,
    ingredient_name VARCHAR(100) NOT NULL,
    amount DECIMAL(10, 2) NOT NULL,
    unit VARCHAR(20) NOT NULL,
    price_per_unit DECIMAL(15, 2) NOT NULL,
    total_cost DECIMAL(15, 2) NOT NULL,
    category ingredient_category DEFAULT 'raw',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_product_ingredients_product ON product_ingredients(product_id);

-- ============================================
-- 7. EMPLOYEES TABLE
-- ============================================
CREATE TABLE employees (
    id SERIAL PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    position VARCHAR(50) NOT NULL,
    daily_wage DECIMAL(15, 2) DEFAULT 0,
    monthly_wage DECIMAL(15, 2) DEFAULT 0,
    wage_type wage_type DEFAULT 'daily',
    is_production_labor BOOLEAN DEFAULT FALSE,
    department VARCHAR(50),
    phone VARCHAR(20),
    join_date DATE,
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_employees_production ON employees(is_production_labor);

-- ============================================
-- 8. BTKL ALLOCATIONS TABLE
-- ============================================
CREATE TABLE btkl_allocations (
    id SERIAL PRIMARY KEY,
    product_id INT NOT NULL REFERENCES products(id) ON DELETE CASCADE,
    employee_id INT REFERENCES employees(id) ON DELETE SET NULL,
    percentage DECIMAL(5, 2) NOT NULL CHECK (percentage >= 0 AND percentage <= 100),
    allocated_cost DECIMAL(15, 2) DEFAULT 0,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(product_id)
);

-- ============================================
-- 9. SALES TABLE (Riwayat Penjualan - Header)
-- ============================================
CREATE TABLE sales (
    id SERIAL PRIMARY KEY,
    invoice_number VARCHAR(50) UNIQUE NOT NULL,
    sale_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    cashier_id INT REFERENCES users(id),
    cashier_name VARCHAR(100),
    payment_method payment_method DEFAULT 'cash',
    subtotal DECIMAL(15, 2) NOT NULL DEFAULT 0,
    total_hpp DECIMAL(15, 2) NOT NULL DEFAULT 0,
    profit DECIMAL(15, 2) NOT NULL DEFAULT 0,
    notes TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_sales_date ON sales(sale_date);
CREATE INDEX idx_sales_invoice ON sales(invoice_number);
CREATE INDEX idx_sales_cashier ON sales(cashier_id);

-- ============================================
-- 10. SALE ITEMS TABLE (Detail Item per Penjualan)
-- ============================================
CREATE TABLE sale_items (
    id SERIAL PRIMARY KEY,
    sale_id INT NOT NULL REFERENCES sales(id) ON DELETE CASCADE,
    product_id INT REFERENCES products(id) ON DELETE SET NULL,
    product_name VARCHAR(100) NOT NULL,
    quantity INT NOT NULL,
    unit_price DECIMAL(15, 2) NOT NULL,
    hpp_per_unit DECIMAL(15, 2) DEFAULT 0,
    total_price DECIMAL(15, 2) NOT NULL,
    total_hpp DECIMAL(15, 2) DEFAULT 0,
    profit DECIMAL(15, 2) DEFAULT 0,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_sale_items_sale ON sale_items(sale_id);
CREATE INDEX idx_sale_items_product ON sale_items(product_id);

-- ============================================
-- 11. TRANSACTIONS TABLE (Umum: Income & Expense)
-- ============================================
CREATE TABLE transactions (
    id SERIAL PRIMARY KEY,
    transaction_date DATE NOT NULL,
    type transaction_type NOT NULL,
    category VARCHAR(50) NOT NULL,
    description TEXT,
    quantity DECIMAL(10, 2) DEFAULT 1,
    unit_price DECIMAL(15, 2) NOT NULL,
    total DECIMAL(15, 2) NOT NULL,
    product_id INT REFERENCES products(id) ON DELETE SET NULL,
    material_id INT REFERENCES raw_materials(id) ON DELETE SET NULL,
    sale_id INT REFERENCES sales(id) ON DELETE SET NULL,
    is_hpp BOOLEAN DEFAULT FALSE,
    created_by INT REFERENCES users(id),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_transactions_date ON transactions(transaction_date);
CREATE INDEX idx_transactions_type ON transactions(type);
CREATE INDEX idx_transactions_category ON transactions(category);

-- ============================================
-- 12. DAILY SUMMARIES TABLE (Cache Harian untuk Dashboard)
-- ============================================
CREATE TABLE daily_summaries (
    id SERIAL PRIMARY KEY,
    summary_date DATE UNIQUE NOT NULL,
    total_revenue DECIMAL(15, 2) DEFAULT 0,
    total_hpp DECIMAL(15, 2) DEFAULT 0,
    total_expense DECIMAL(15, 2) DEFAULT 0,
    gross_profit DECIMAL(15, 2) DEFAULT 0,
    net_profit DECIMAL(15, 2) DEFAULT 0,
    total_transactions INT DEFAULT 0,
    top_product_id INT REFERENCES products(id),
    top_product_name VARCHAR(100),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_daily_summaries_date ON daily_summaries(summary_date);

-- ============================================
-- 13. VIEWS (Query Helper)
-- ============================================

-- View: Ringkasan Penjualan per Produk
CREATE VIEW v_product_sales_summary AS
SELECT 
    p.id AS product_id,
    p.name AS product_name,
    p.category,
    p.selling_price,
    p.hpp,
    p.margin,
    COALESCE(SUM(si.quantity), 0) AS total_sold,
    COALESCE(SUM(si.total_price), 0) AS total_revenue,
    COALESCE(SUM(si.total_hpp), 0) AS total_cost,
    COALESCE(SUM(si.profit), 0) AS total_profit
FROM products p
LEFT JOIN sale_items si ON p.id = si.product_id
GROUP BY p.id, p.name, p.category, p.selling_price, p.hpp, p.margin;

-- View: Riwayat Penjualan Lengkap (untuk halaman Sales History)
CREATE VIEW v_sales_history AS
SELECT 
    s.id,
    s.invoice_number,
    s.sale_date,
    s.cashier_name,
    s.payment_method,
    s.subtotal,
    s.total_hpp,
    s.profit,
    s.notes,
    COUNT(si.id) AS item_count,
    STRING_AGG(CONCAT(si.product_name, ' x', si.quantity), ', ') AS items_summary
FROM sales s
LEFT JOIN sale_items si ON s.id = si.sale_id
GROUP BY s.id, s.invoice_number, s.sale_date, s.cashier_name, 
         s.payment_method, s.subtotal, s.total_hpp, s.profit, s.notes
ORDER BY s.sale_date DESC;

-- View: KPI Dashboard
CREATE VIEW v_kpi_summary AS
SELECT
    COALESCE(SUM(CASE WHEN t.type = 'income' THEN t.total ELSE 0 END), 0) AS total_revenue,
    COALESCE(SUM(CASE WHEN t.type = 'expense' AND t.is_hpp = TRUE THEN t.total ELSE 0 END), 0) AS total_hpp,
    COALESCE(SUM(CASE WHEN t.type = 'expense' AND t.is_hpp = FALSE THEN t.total ELSE 0 END), 0) AS total_expense_operational,
    COUNT(CASE WHEN t.type = 'income' THEN 1 END) AS total_sales_transactions
FROM transactions t;

-- ============================================
-- 14. TRIGGER: Auto-update updated_at
-- ============================================
CREATE OR REPLACE FUNCTION update_timestamp()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = CURRENT_TIMESTAMP;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trg_users_updated BEFORE UPDATE ON users FOR EACH ROW EXECUTE FUNCTION update_timestamp();
CREATE TRIGGER trg_products_updated BEFORE UPDATE ON products FOR EACH ROW EXECUTE FUNCTION update_timestamp();
CREATE TRIGGER trg_raw_materials_updated BEFORE UPDATE ON raw_materials FOR EACH ROW EXECUTE FUNCTION update_timestamp();
CREATE TRIGGER trg_employees_updated BEFORE UPDATE ON employees FOR EACH ROW EXECUTE FUNCTION update_timestamp();
CREATE TRIGGER trg_daily_summaries_updated BEFORE UPDATE ON daily_summaries FOR EACH ROW EXECUTE FUNCTION update_timestamp();

-- ============================================
-- 15. TRIGGER: Auto-update stock setelah penjualan
-- ============================================
CREATE OR REPLACE FUNCTION update_stock_after_sale()
RETURNS TRIGGER AS $$
BEGIN
    UPDATE products 
    SET stock_current = stock_current - NEW.quantity
    WHERE id = NEW.product_id;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trg_update_stock_after_sale
AFTER INSERT ON sale_items
FOR EACH ROW EXECUTE FUNCTION update_stock_after_sale();

-- ============================================
-- 16. SEED DATA (Demo)
-- ============================================
INSERT INTO users (name, email, password_hash, role) VALUES
('Demo Manager', 'manager@demo.com', '$2b$12$HASH_PLACEHOLDER', 'manager'),
('Demo Cashier', 'cashier@demo.com', '$2b$12$HASH_PLACEHOLDER', 'cashier');

INSERT INTO raw_materials (name, price_per_unit, unit, category, description, stock_current) VALUES
('Biji Kopi Arabica', 150000, 'Kg', 'bahan_baku', 'Kopi arabica grade A', 25),
('Susu UHT', 18000, 'Liter', 'bahan_baku', 'Susu UHT full cream', 50),
('Gula Aren', 20000, 'Kg', 'bahan_baku', 'Gula aren murni', 15),
('Matcha Powder', 500000, 'Kg', 'bahan_baku', 'Matcha premium Jepang', 5),
('Teh Celup', 500, 'Pcs', 'bahan_baku', 'Teh celup premium', 200),
('Gula Pasir', 15000, 'Kg', 'bahan_baku', 'Gula pasir putih', 30),
('Tepung Terigu', 15000, 'Kg', 'bahan_baku', 'Tepung protein tinggi', 20),
('Butter', 120000, 'Kg', 'bahan_baku', 'Butter import', 10),
('Telur', 2500, 'Pcs', 'bahan_baku', 'Telur ayam segar', 100),
('Creamer', 100000, 'Kg', 'bahan_baku', 'Non-dairy creamer', 10);

INSERT INTO products (name, category, emoji, selling_price, hpp, margin, labor_cost, overhead_cost, stock_initial, stock_current, unit, description) VALUES
('Kopi Susu Gula Aren', 'Coffee', '☕', 25000, 6700, 73.2, 1000, 500, 100, 85, 'Cup', 'Kopi susu dengan gula aren asli'),
('Matcha Latte', 'Non-Coffee', '🍵', 28000, 8200, 70.7, 1000, 500, 80, 65, 'Cup', 'Matcha premium dengan susu segar'),
('Es Teh Manis', 'Tea', '🧋', 12000, 2800, 76.7, 500, 300, 200, 180, 'Cup', 'Teh manis segar dengan es'),
('Croissant', 'Pastry', '🥐', 35000, 12000, 65.7, 3000, 1500, 50, 42, 'Pcs', 'Croissant butter premium');

INSERT INTO employees (name, position, daily_wage, monthly_wage, wage_type, is_production_labor, department, phone, join_date) VALUES
('Ahmad Barista', 'Barista Senior', 150000, 3900000, 'daily', TRUE, 'Produksi', '081234567890', '2024-01-15'),
('Siti Kasir', 'Kasir', 120000, 3120000, 'daily', FALSE, 'Operasional', '081234567891', '2024-02-01'),
('Budi Helper', 'Helper Dapur', 100000, 2600000, 'daily', TRUE, 'Produksi', '081234567892', '2024-03-01');
