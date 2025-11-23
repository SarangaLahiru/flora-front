-- Flora E-Commerce Sample Data (Seeder)
-- Insert sample data for testing and development

USE flora_ecommerce;

-- Insert Roles
INSERT INTO roles (id, name) VALUES
(1, 'ROLE_GUEST'),
(2, 'ROLE_USER'),
(3, 'ROLE_ADMIN');

-- Insert Sample Users
-- Password for all users: password123 (bcrypt encrypted)
-- BCrypt hash generated with strength 10
INSERT INTO users (username, email, password, first_name, last_name, phone, address, city, state, zip_code, country, active) VALUES
('admin', 'admin@flora.com', '$2a$10$cEt8f/0xyazloKB0KR8Ni.AySPUHaxpTThP6Vdn8uJbgZTmrRMyoq', 'Admin', 'User', '+1234567890', '123 Admin St', 'New York', 'NY', '10001', 'USA', TRUE),
('john_doe', 'john@example.com', '$2a$10$N9qo8uLOickgx2ZMRZoMyeIjZAgcfl7p92ldGxad68LJZdL17lhWy', 'John', 'Doe', '+1234567891', '456 User Ave', 'Los Angeles', 'CA', '90001', 'USA', TRUE),
('jane_smith', 'jane@example.com', '$2a$10$N9qo8uLOickgx2ZMRZoMyeIjZAgcfl7p92ldGxad68LJZdL17lhWy', 'Jane', 'Smith', '+1234567892', '789 Customer Blvd', 'Chicago', 'IL', '60601', 'USA', TRUE);

-- Assign Roles to Users
INSERT INTO user_roles (user_id, role_id) VALUES
(1, 3), -- admin has ROLE_ADMIN
(2, 2), -- john_doe has ROLE_USER
(3, 2); -- jane_smith has ROLE_USER

-- Insert Categories
INSERT INTO categories (name, description, active) VALUES
('Roses', 'Beautiful roses in various colors for all occasions', TRUE),
('Bouquets', 'Handcrafted flower bouquets for special moments', TRUE),
('Orchids', 'Elegant exotic orchids for home and office', TRUE),
('Wedding Flowers', 'Premium wedding arrangements and bridal bouquets', TRUE),
('Seasonal Flowers', 'Fresh seasonal flowers and arrangements', TRUE),
('Plants & Succulents', 'Indoor plants and low-maintenance succulents', TRUE),
('Gift Baskets', 'Flower gift baskets with chocolates and treats', TRUE),
('Sympathy Flowers', 'Respectful sympathy and funeral arrangements', TRUE);

-- Insert Sample Products
INSERT INTO products (name, description, price, stock_quantity, category_id, sku, active, featured, discount, image_url) VALUES
-- Roses
('Red Roses Dozen', 'Classic dozen red roses, perfect for romance', 59.99, 50, 1, 'ROSE-001', TRUE, TRUE, 10.00, 'https://images.unsplash.com/photo-1518895949257-7621c3c786d7?w=800&q=80'),
('Pink Roses Bouquet', 'Delicate pink roses with baby breath', 49.99, 45, 1, 'ROSE-002', TRUE, TRUE, 0.00, 'https://images.unsplash.com/photo-1561181286-d3fee7d55364?w=800&q=80'),
('White Roses Arrangement', 'Elegant white roses in a glass vase', 69.99, 30, 1, 'ROSE-003', TRUE, FALSE, 15.00, 'https://images.unsplash.com/photo-1591886960571-74d43a9d4166?w=800&q=80'),
('Yellow Roses Bundle', 'Cheerful yellow roses for friendship', 44.99, 40, 1, 'ROSE-004', TRUE, FALSE, 0.00, 'https://images.unsplash.com/photo-1563241527-3004b7be0ffd?w=800&q=80'),
('Mixed Roses Bouquet', 'Beautiful mix of colorful roses', 54.99, 35, 1, 'ROSE-005', TRUE, TRUE, 5.00, 'https://images.unsplash.com/photo-1490750967868-88aa4486c946?w=800&q=80'),

-- Bouquets
('Spring Garden Bouquet', 'Fresh seasonal flowers in vibrant colors', 79.99, 25, 2, 'BQT-001', TRUE, TRUE, 0.00, 'https://images.unsplash.com/photo-1561181286-d3fee7d55364?w=800&q=80'),
('Tropical Paradise', 'Exotic tropical flowers arrangement', 89.99, 20, 2, 'BQT-002', TRUE, TRUE, 10.00, 'https://images.unsplash.com/photo-1508610048659-a06b669e3321?w=800&q=80'),
('Wildflower Medley', 'Rustic wildflower bouquet with lavender', 64.99, 30, 2, 'BQT-003', TRUE, FALSE, 0.00, 'https://images.unsplash.com/photo-1563514227147-6d2ff665a6a0?w=800&q=80'),
('Sunflower Delight', 'Bright sunflowers with greenery', 69.99, 28, 2, 'BQT-004', TRUE, TRUE, 0.00, 'https://images.unsplash.com/photo-1597848212624-e530bb5d0f37?w=800&q=80'),
('Pastel Dreams', 'Soft pastel flowers perfect for any occasion', 74.99, 32, 2, 'BQT-005', TRUE, FALSE, 0.00, 'https://images.unsplash.com/photo-1487070183336-b863922373d4?w=800&q=80'),

-- Orchids
('Purple Phalaenopsis Orchid', 'Single stem purple orchid in decorative pot', 45.99, 25, 3, 'ORCH-001', TRUE, TRUE, 0.00, 'https://images.unsplash.com/photo-1583121274602-3e2820c69888?w=800&q=80'),
('White Orchid Plant', 'Elegant white orchid, long-lasting beauty', 52.99, 20, 3, 'ORCH-002', TRUE, FALSE, 0.00, 'https://images.unsplash.com/photo-1594582722360-ca4f3e7d1e3e?w=800&q=80'),
('Mini Orchid Collection', 'Set of 3 mini orchids in ceramic pots', 89.99, 15, 3, 'ORCH-003', TRUE, FALSE, 12.00, 'https://images.unsplash.com/photo-1615715616181-6b41c7ecc3db?w=800&q=80'),
('Pink Orchid Elegance', 'Beautiful pink orchid for home decor', 48.99, 22, 3, 'ORCH-004', TRUE, FALSE, 0.00, 'https://images.unsplash.com/photo-1551884831-bbf3cdc6469e?w=800&q=80'),

-- Wedding Flowers
('Bridal Bouquet Classic', 'Traditional white and cream bridal bouquet', 149.99, 10, 4, 'WED-001', TRUE, TRUE, 0.00, 'https://images.unsplash.com/photo-1519225421980-715cb0215aed?w=800&q=80'),
('Bridesmaid Bouquet', 'Matching bridesmaid bouquet set', 79.99, 15, 4, 'WED-002', TRUE, FALSE, 0.00, 'https://images.unsplash.com/photo-1535254973040-607b474cb50d?w=800&q=80'),
('Wedding Centerpiece', 'Elegant table centerpiece for reception', 119.99, 20, 4, 'WED-003', TRUE, FALSE, 0.00, 'https://images.unsplash.com/photo-1478146896981-b80fe463b330?w=800&q=80'),
('Boutonniere Set', 'Groom and groomsmen boutonnieres, set of 6', 59.99, 25, 4, 'WED-004', TRUE, FALSE, 0.00, 'https://images.unsplash.com/photo-1522673607200-164d1b6ce486?w=800&q=80'),
('Wedding Arch Flowers', 'Stunning floral arrangement for ceremony arch', 299.99, 5, 4, 'WED-005', TRUE, TRUE, 15.00, 'https://images.unsplash.com/photo-1464366400600-7168b8af9bc3?w=800&q=80'),

-- Seasonal Flowers
('Tulip Bouquet', 'Fresh spring tulips in mixed colors', 54.99, 40, 5, 'SEAS-001', TRUE, TRUE, 0.00, 'https://images.unsplash.com/photo-1520763185298-1b434c919102?w=800&q=80'),
('Peony Arrangement', 'Lush pink peonies in full bloom', 84.99, 18, 5, 'SEAS-002', TRUE, TRUE, 0.00, 'https://images.unsplash.com/photo-1591886960571-74d43a9d4166?w=800&q=80'),
('Lily Bouquet', 'Fragrant stargazer lilies', 69.99, 30, 5, 'SEAS-003', TRUE, FALSE, 0.00, 'https://images.unsplash.com/photo-1566146991569-696da38bb775?w=800&q=80'),
('Chrysanthemum Mix', 'Colorful fall mums arrangement', 49.99, 35, 5, 'SEAS-004', TRUE, FALSE, 0.00, 'https://images.unsplash.com/photo-1490750967868-88aa4486c946?w=800&q=80'),
('Hydrangea Beauty', 'Large blue hydrangea arrangement', 79.99, 22, 5, 'SEAS-005', TRUE, FALSE, 10.00, 'https://images.unsplash.com/photo-1595255842500-0c3d96c87e65?w=800&q=80'),

-- Plants & Succulents
('Succulent Garden', 'Assorted succulents in wooden box', 39.99, 50, 6, 'PLANT-001', TRUE, TRUE, 0.00, 'https://images.unsplash.com/photo-1459156212016-c812468e2115?w=800&q=80'),
('Peace Lily Plant', 'Low-maintenance peace lily for indoor', 34.99, 45, 6, 'PLANT-002', TRUE, FALSE, 0.00, 'https://images.unsplash.com/photo-1593482892290-f54927ae1bb6?w=800&q=80'),
('Pothos Hanging Plant', 'Easy-care trailing pothos plant', 29.99, 60, 6, 'PLANT-003', TRUE, FALSE, 0.00, 'https://images.unsplash.com/photo-1614594975525-e45190c55d0b?w=800&q=80'),
('Fiddle Leaf Fig', 'Trendy fiddle leaf fig in ceramic pot', 89.99, 15, 6, 'PLANT-004', TRUE, FALSE, 0.00, 'https://images.unsplash.com/photo-1614594895304-fe7116ac3b58?w=800&q=80'),
('Cactus Collection', 'Set of 3 mini cacti in terra cotta pots', 24.99, 70, 6, 'PLANT-005', TRUE, TRUE, 0.00, 'https://images.unsplash.com/photo-1509937528035-ad76254b0356?w=800&q=80'),

-- Gift Baskets
('Flower & Chocolate Gift', 'Roses with premium chocolates', 94.99, 20, 7, 'GIFT-001', TRUE, TRUE, 0.00, 'https://images.unsplash.com/photo-1606800052052-a08af7148866?w=800&q=80'),
('Spa & Flower Basket', 'Flowers with spa essentials', 119.99, 15, 7, 'GIFT-002', TRUE, FALSE, 0.00, 'https://images.unsplash.com/photo-1608571423902-eed4a5ad8108?w=800&q=80'),
('New Baby Flower Gift', 'Pastel flowers with baby items', 99.99, 18, 7, 'GIFT-003', TRUE, FALSE, 0.00, 'https://images.unsplash.com/photo-1487070183336-b863922373d4?w=800&q=80'),
('Get Well Soon Basket', 'Cheerful flowers with comfort items', 89.99, 22, 7, 'GIFT-004', TRUE, FALSE, 0.00, 'https://images.unsplash.com/photo-1597848212624-e530bb5d0f37?w=800&q=80'),

-- Sympathy Flowers
('White Lily Sympathy', 'Peaceful white lilies arrangement', 89.99, 25, 8, 'SYMP-001', TRUE, FALSE, 0.00, 'https://images.unsplash.com/photo-1566146991569-696da38bb775?w=800&q=80'),
('Funeral Standing Spray', 'Dignified standing funeral spray', 179.99, 10, 8, 'SYMP-002', TRUE, FALSE, 0.00, 'https://images.unsplash.com/photo-1591886960571-74d43a9d4166?w=800&q=80'),
('Sympathy Wreath', 'Traditional sympathy wreath', 149.99, 12, 8, 'SYMP-003', TRUE, FALSE, 0.00, 'https://images.unsplash.com/photo-1478146896981-b80fe463b330?w=800&q=80'),
('Peaceful White Roses', 'White roses for memorial services', 94.99, 20, 8, 'SYMP-004', TRUE, FALSE, 0.00, 'https://images.unsplash.com/photo-1591886960571-74d43a9d4166?w=800&q=80');

-- Note: Default credentials
-- Username: admin
-- Password: password123
