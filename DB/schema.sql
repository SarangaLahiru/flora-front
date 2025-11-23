-- Flora E-Commerce Database Schema
-- Production-Ready Schema with All Updates
-- MySQL Database Initialization Script

CREATE DATABASE IF NOT EXISTS flora_ecommerce;
USE flora_ecommerce;

-- Drop existing tables (for clean setup)
DROP TABLE IF EXISTS order_item_customizations;
DROP TABLE IF EXISTS customization_options;
DROP TABLE IF EXISTS seasonal_pricing;
DROP TABLE IF EXISTS deliveries;
DROP TABLE IF EXISTS event_items;
DROP TABLE IF EXISTS events;
DROP TABLE IF EXISTS order_items;
DROP TABLE IF EXISTS orders;
DROP TABLE IF EXISTS cart_items;
DROP TABLE IF EXISTS carts;
DROP TABLE IF EXISTS wishlists;
DROP TABLE IF EXISTS products;
DROP TABLE IF EXISTS categories;
DROP TABLE IF EXISTS customer_preferences;
DROP TABLE IF EXISTS sales_reports;
DROP TABLE IF EXISTS user_roles;
DROP TABLE IF EXISTS users;
DROP TABLE IF EXISTS roles;

-- Roles Table
CREATE TABLE roles (
    id BIGINT PRIMARY KEY AUTO_INCREMENT,
    name VARCHAR(20) NOT NULL UNIQUE
);

-- Users Table
CREATE TABLE users (
    id BIGINT PRIMARY KEY AUTO_INCREMENT,
    username VARCHAR(50) NOT NULL UNIQUE,
    email VARCHAR(100) NOT NULL UNIQUE,
    password VARCHAR(255),
    first_name VARCHAR(100),
    last_name VARCHAR(100),
    phone VARCHAR(20),
    address TEXT,
    city VARCHAR(50),
    state VARCHAR(50),
    zip_code VARCHAR(20),
    country VARCHAR(50),
    avatar_url VARCHAR(500),
    provider VARCHAR(50) DEFAULT 'local',
    provider_id VARCHAR(255),
    active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    INDEX idx_provider (provider, provider_id)
);

-- User Roles Mapping Table
CREATE TABLE user_roles (
    user_id BIGINT NOT NULL,
    role_id BIGINT NOT NULL,
    PRIMARY KEY (user_id, role_id),
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    FOREIGN KEY (role_id) REFERENCES roles(id) ON DELETE CASCADE
);

-- Categories Table
CREATE TABLE categories (
    id BIGINT PRIMARY KEY AUTO_INCREMENT,
    name VARCHAR(100) NOT NULL UNIQUE,
    description TEXT,
    image_url LONGTEXT,
    active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- Products Table
CREATE TABLE products (
    id BIGINT PRIMARY KEY AUTO_INCREMENT,
    name VARCHAR(255) NOT NULL,
    description TEXT,
    price DECIMAL(10, 2) NOT NULL,
    stock_quantity INT NOT NULL DEFAULT 0,
    image_url LONGTEXT,
    category_id BIGINT,
    sku VARCHAR(100),
    active BOOLEAN DEFAULT TRUE,
    featured BOOLEAN DEFAULT FALSE,
    discount DECIMAL(10, 2) DEFAULT 0.00,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (category_id) REFERENCES categories(id) ON DELETE SET NULL
);

-- Wishlists Table
CREATE TABLE wishlists (
    id BIGINT PRIMARY KEY AUTO_INCREMENT,
    user_id BIGINT NOT NULL,
    product_id BIGINT NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    FOREIGN KEY (product_id) REFERENCES products(id) ON DELETE CASCADE,
    UNIQUE KEY unique_user_product (user_id, product_id)
);

-- Carts Table
CREATE TABLE carts (
    id BIGINT PRIMARY KEY AUTO_INCREMENT,
    user_id BIGINT NOT NULL UNIQUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

-- Cart Items Table
CREATE TABLE cart_items (
    id BIGINT PRIMARY KEY AUTO_INCREMENT,
    cart_id BIGINT NOT NULL,
    product_id BIGINT NOT NULL,
    quantity INT NOT NULL DEFAULT 1,
    FOREIGN KEY (cart_id) REFERENCES carts(id) ON DELETE CASCADE,
    FOREIGN KEY (product_id) REFERENCES products(id) ON DELETE CASCADE
);

-- Orders Table
CREATE TABLE orders (
    id BIGINT PRIMARY KEY AUTO_INCREMENT,
    order_number VARCHAR(100) NOT NULL UNIQUE,
    user_id BIGINT NOT NULL,
    total_amount DECIMAL(10, 2) NOT NULL,
    status VARCHAR(20) NOT NULL DEFAULT 'PENDING',
    shipping_address VARCHAR(500) NOT NULL,
    shipping_city VARCHAR(100),
    shipping_state VARCHAR(100),
    shipping_zip_code VARCHAR(20),
    shipping_country VARCHAR(100),
    customer_phone VARCHAR(20),
    customer_email VARCHAR(100),
    payment_method VARCHAR(50),
    notes TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

-- Order Items Table
CREATE TABLE order_items (
    id BIGINT PRIMARY KEY AUTO_INCREMENT,
    order_id BIGINT NOT NULL,
    product_id BIGINT NOT NULL,
    quantity INT NOT NULL,
    price DECIMAL(10, 2) NOT NULL,
    subtotal DECIMAL(10, 2) NOT NULL,
    FOREIGN KEY (order_id) REFERENCES orders(id) ON DELETE CASCADE,
    FOREIGN KEY (product_id) REFERENCES products(id)
);

-- Events Table (for weddings, birthdays, funerals, etc.)
CREATE TABLE events (
    id BIGINT PRIMARY KEY AUTO_INCREMENT,
    event_number VARCHAR(100) NOT NULL UNIQUE,
    user_id BIGINT NOT NULL,
    event_type VARCHAR(50) NOT NULL,
    event_date DATE NOT NULL,
    event_time TIME,
    venue_name VARCHAR(255),
    venue_address TEXT,
    venue_city VARCHAR(100),
    venue_state VARCHAR(100),
    venue_zip_code VARCHAR(20),
    guest_count INT,
    budget DECIMAL(10, 2),
    special_instructions TEXT,
    status VARCHAR(50) NOT NULL DEFAULT 'PENDING',
    total_amount DECIMAL(10, 2),
    contact_person VARCHAR(100),
    contact_phone VARCHAR(20),
    contact_email VARCHAR(100),
    rejection_reason TEXT,
    admin_notes TEXT,
    approved_by BIGINT,
    approved_at TIMESTAMP NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    FOREIGN KEY (approved_by) REFERENCES users(id) ON DELETE SET NULL
);

-- Event Items Table (products/arrangements for events)
CREATE TABLE event_items (
    id BIGINT PRIMARY KEY AUTO_INCREMENT,
    event_id BIGINT NOT NULL,
    product_id BIGINT NOT NULL,
    quantity INT NOT NULL,
    price DECIMAL(10, 2) NOT NULL,
    customization_notes TEXT,
    placement_location VARCHAR(255),
    FOREIGN KEY (event_id) REFERENCES events(id) ON DELETE CASCADE,
    FOREIGN KEY (product_id) REFERENCES products(id)
);

-- Deliveries Table
CREATE TABLE deliveries (
    id BIGINT PRIMARY KEY AUTO_INCREMENT,
    tracking_number VARCHAR(100) NOT NULL UNIQUE,
    order_id BIGINT,
    event_id BIGINT,
    delivery_type VARCHAR(20) NOT NULL DEFAULT 'STANDARD',
    scheduled_date DATE NOT NULL,
    scheduled_time_slot VARCHAR(50),
    actual_delivery_time TIMESTAMP,
    status VARCHAR(20) NOT NULL DEFAULT 'PENDING',
    driver_name VARCHAR(100),
    driver_phone VARCHAR(20),
    vehicle_number VARCHAR(50),
    delivery_address TEXT NOT NULL,
    delivery_city VARCHAR(100),
    delivery_state VARCHAR(100),
    delivery_zip_code VARCHAR(20),
    recipient_name VARCHAR(100),
    recipient_phone VARCHAR(20),
    delivery_notes TEXT,
    signature_url VARCHAR(500),
    photo_proof_url VARCHAR(500),
    gps_latitude DECIMAL(10, 8),
    gps_longitude DECIMAL(11, 8),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (order_id) REFERENCES orders(id) ON DELETE SET NULL,
    FOREIGN KEY (event_id) REFERENCES events(id) ON DELETE SET NULL
);

-- Seasonal Pricing Table
CREATE TABLE seasonal_pricing (
    id BIGINT PRIMARY KEY AUTO_INCREMENT,
    product_id BIGINT NOT NULL,
    season_name VARCHAR(50) NOT NULL,
    start_date DATE NOT NULL,
    end_date DATE NOT NULL,
    price_adjustment DECIMAL(10, 2) NOT NULL,
    adjustment_type VARCHAR(20) NOT NULL DEFAULT 'PERCENTAGE',
    active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (product_id) REFERENCES products(id) ON DELETE CASCADE
);

-- Product Customization Options Table
CREATE TABLE customization_options (
    id BIGINT PRIMARY KEY AUTO_INCREMENT,
    name VARCHAR(100) NOT NULL,
    description TEXT,
    option_type VARCHAR(50) NOT NULL,
    additional_price DECIMAL(10, 2) DEFAULT 0.00,
    active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Order Customizations Table
CREATE TABLE order_item_customizations (
    id BIGINT PRIMARY KEY AUTO_INCREMENT,
    order_item_id BIGINT NOT NULL,
    customization_option_id BIGINT NOT NULL,
    custom_value TEXT,
    additional_cost DECIMAL(10, 2) DEFAULT 0.00,
    FOREIGN KEY (order_item_id) REFERENCES order_items(id) ON DELETE CASCADE,
    FOREIGN KEY (customization_option_id) REFERENCES customization_options(id)
);

-- Sales Reports Table (for caching report data)
CREATE TABLE sales_reports (
    id BIGINT PRIMARY KEY AUTO_INCREMENT,
    report_date DATE NOT NULL,
    total_sales DECIMAL(10, 2) NOT NULL,
    total_orders INT NOT NULL,
    total_events INT NOT NULL,
    total_deliveries INT NOT NULL,
    average_order_value DECIMAL(10, 2),
    top_selling_product_id BIGINT,
    generated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (top_selling_product_id) REFERENCES products(id) ON DELETE SET NULL
);

-- Customer Preferences Table
CREATE TABLE customer_preferences (
    id BIGINT PRIMARY KEY AUTO_INCREMENT,
    user_id BIGINT NOT NULL,
    favorite_flowers TEXT,
    allergies TEXT,
    preferred_colors TEXT,
    occasion_reminders TEXT,
    delivery_instructions TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

-- Create indexes for better performance
CREATE INDEX idx_users_email ON users(email);
CREATE INDEX idx_users_username ON users(username);
CREATE INDEX idx_products_category ON products(category_id);
CREATE INDEX idx_products_active ON products(active);
CREATE INDEX idx_orders_user ON orders(user_id);
CREATE INDEX idx_orders_status ON orders(status);
CREATE INDEX idx_orders_number ON orders(order_number);
CREATE INDEX idx_events_user ON events(user_id);
CREATE INDEX idx_events_status ON events(status);
CREATE INDEX idx_events_date ON events(event_date);
CREATE INDEX idx_events_number ON events(event_number);
CREATE INDEX idx_deliveries_order ON deliveries(order_id);
CREATE INDEX idx_deliveries_event ON deliveries(event_id);
CREATE INDEX idx_deliveries_status ON deliveries(status);
CREATE INDEX idx_deliveries_tracking ON deliveries(tracking_number);
CREATE INDEX idx_deliveries_date ON deliveries(scheduled_date);
CREATE INDEX idx_seasonal_pricing_product ON seasonal_pricing(product_id);
CREATE INDEX idx_seasonal_pricing_dates ON seasonal_pricing(start_date, end_date);
