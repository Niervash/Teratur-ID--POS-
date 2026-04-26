-- TERATUR.ID - Smart Business Management System
-- Updated Database Schema (April 2026)

-- 1. Users & RBAC
CREATE TABLE users (
    id UUID PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    email VARCHAR(255) UNIQUE NOT NULL,
    password_hash TEXT NOT NULL,
    role ENUM('superadmin', 'manager', 'cashier') NOT NULL,
    business_id UUID REFERENCES business_profile(id),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 2. Business Profile
CREATE TABLE business_profile (
    id UUID PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    type VARCHAR(100), -- E.g. Coffee Shop, Resto
    address TEXT,
    phone VARCHAR(20),
    email VARCHAR(255),
    tax_rate DECIMAL(5,2) DEFAULT 10.00, -- PB1
    subscription_status VARCHAR(50),
    trial_ends_at TIMESTAMP
);

-- 3. Inventory & Products
CREATE TABLE ingredients (
    id UUID PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    unit VARCHAR(20), -- gr, ml, pcs
    stock DECIMAL(12,2) DEFAULT 0,
    min_stock DECIMAL(12,2) DEFAULT 0,
    avg_cost DECIMAL(12,2), -- HPP per unit
    category VARCHAR(100),
    business_id UUID REFERENCES business_profile(id)
);

CREATE TABLE products (
    id UUID PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    category VARCHAR(100),
    selling_price DECIMAL(12,2) NOT NULL,
    hpp DECIMAL(12,2),
    emoji VARCHAR(10),
    labor_cost DECIMAL(12,2) DEFAULT 0,
    overhead_cost DECIMAL(12,2) DEFAULT 0,
    unit VARCHAR(20),
    is_active BOOLEAN DEFAULT TRUE,
    business_id UUID REFERENCES business_profile(id)
);

CREATE TABLE product_recipes (
    product_id UUID REFERENCES products(id),
    ingredient_id UUID REFERENCES ingredients(id),
    quantity DECIMAL(12,2) NOT NULL,
    PRIMARY KEY (product_id, ingredient_id)
);

-- 4. CRM & Membership
CREATE TABLE members (
    id UUID PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    phone VARCHAR(20) UNIQUE,
    email VARCHAR(255),
    points INT DEFAULT 0,
    level ENUM('Bronze', 'Silver', 'Gold') DEFAULT 'Bronze',
    join_date DATE DEFAULT CURRENT_DATE,
    business_id UUID REFERENCES business_profile(id)
);

-- 5. POS & Transactions
CREATE TABLE transactions (
    id UUID PRIMARY KEY,
    trx_code VARCHAR(50) UNIQUE, -- E.g. TRX-12345678
    cashier_id UUID REFERENCES users(id),
    member_id UUID REFERENCES members(id),
    shift_id UUID REFERENCES shifts(id),
    subtotal DECIMAL(12,2) NOT NULL,
    discount DECIMAL(12,2) DEFAULT 0,
    tax DECIMAL(12,2) DEFAULT 0,
    total DECIMAL(12,2) NOT NULL,
    payment_method ENUM('cash', 'qris', 'transfer') NOT NULL,
    received_amount DECIMAL(12,2),
    change_amount DECIMAL(12,2),
    order_type ENUM('dine-in', 'take-away', 'delivery') NOT NULL,
    table_number VARCHAR(10),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE transaction_items (
    id UUID PRIMARY KEY,
    transaction_id UUID REFERENCES transactions(id),
    product_id UUID REFERENCES products(id),
    quantity INT NOT NULL,
    unit_price DECIMAL(12,2) NOT NULL,
    total_price DECIMAL(12,2) NOT NULL
);

-- 6. Cash & Shift Management (NEW)
CREATE TABLE shift_definitions (
    id UUID PRIMARY KEY,
    name VARCHAR(100) NOT NULL, -- Shift Pagi, Siang, Malam
    start_time TIME NOT NULL,
    end_time TIME NOT NULL,
    business_id UUID REFERENCES business_profile(id)
);

CREATE TABLE shifts (
    id UUID PRIMARY KEY,
    cashier_id UUID REFERENCES users(id),
    start_time TIMESTAMP NOT NULL,
    end_time TIMESTAMP,
    initial_cash DECIMAL(12,2) NOT NULL,
    final_cash DECIMAL(12,2), -- Physical cash count
    expected_cash DECIMAL(12,2), -- System calculation
    status ENUM('open', 'closed') DEFAULT 'open',
    business_id UUID REFERENCES business_profile(id)
);

-- 7. Employee Scheduling (NEW)
CREATE TABLE employee_schedules (
    id UUID PRIMARY KEY,
    employee_id UUID REFERENCES users(id),
    shift_def_id UUID REFERENCES shift_definitions(id),
    work_date DATE NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 8. Audit Trail (NEW)
CREATE TABLE audit_logs (
    id BIGSERIAL PRIMARY KEY,
    user_id UUID, -- Can be NULL for Guest
    user_name VARCHAR(255),
    action VARCHAR(255) NOT NULL, -- Login, Checkout, Void, etc
    target VARCHAR(255), -- ID of the object changed
    type ENUM('create', 'update', 'delete', 'access') NOT NULL,
    ip_address VARCHAR(45),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 9. Expenses
CREATE TABLE expenses (
    id UUID PRIMARY KEY,
    category VARCHAR(100),
    amount DECIMAL(12,2) NOT NULL,
    description TEXT,
    date DATE DEFAULT CURRENT_DATE,
    user_id UUID REFERENCES users(id),
    business_id UUID REFERENCES business_profile(id)
);
