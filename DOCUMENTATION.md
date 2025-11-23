# Flora E-Commerce - Technical Documentation

> **Version:** 1.0.0  
> **Last Updated:** November 2024  
> **Tech Stack:** Spring Boot 3.x + React 18 + MySQL 8

---

## Table of Contents

1. [Project Overview](#project-overview)
2. [Architecture](#architecture)
3. [Technology Stack](#technology-stack)
4. [Database Schema](#database-schema)
5. [Backend API](#backend-api)
6. [Frontend Structure](#frontend-structure)
7. [Authentication & Authorization](#authentication--authorization)
8. [Setup & Installation](#setup--installation)
9. [Environment Configuration](#environment-configuration)
10. [Deployment](#deployment)
11. [Features](#features)

---

## Project Overview

Flora E-Commerce is a full-stack flower shop application with comprehensive event management, user authentication (including Google OAuth), admin dashboard, and e-commerce functionality.

### Key Features
- **E-Commerce**: Product catalog, cart, checkout, order management
- **Event Management**: Wedding, birthday, corporate event bookings with admin approval workflow
- **Authentication**: Local registration + Google OAuth 2.0
- **Admin Dashboard**: Product, category, user, order, and event management
- **Responsive UI**: Modern React with Tailwind CSS

---

## Architecture

### System Architecture
```
┌─────────────┐      ┌──────────────┐      ┌──────────────┐
│   React     │─────▶│  Spring Boot │─────▶│    MySQL     │
│  Frontend   │      │   Backend    │      │   Database   │
│ (Port 5173) │◀─────│  (Port 8080) │◀─────│  (Port 3306) │
└─────────────┘      └──────────────┘      └──────────────┘
       │                     │
       │                     │
       ▼                     ▼
  Tailwind CSS         Spring Security
  React Router         JWT + OAuth2
  Axios                JPA/Hibernate
```

### Layer Architecture

**Backend (Spring Boot)**
```
Controller Layer → Service Layer → Repository Layer → Database
     ↓                  ↓                ↓
   DTOs            Business Logic    JPA Entities
```

**Frontend (React)**
```
Pages → Components → Services → API
  ↓         ↓           ↓
Context   Hooks      Axios
```

---

## Technology Stack

### Backend
- **Framework**: Spring Boot 3.2.x
- **Language**: Java 17+
- **Security**: Spring Security 6 + JWT
- **ORM**: Spring Data JPA + Hibernate
- **Database**: MySQL 8.0
- **Build Tool**: Maven
- **OAuth**: Spring OAuth2 Client

### Frontend
- **Framework**: React 18
- **Build Tool**: Vite
- **Styling**: Tailwind CSS
- **Routing**: React Router v6
- **HTTP Client**: Axios
- **State Management**: Context API
- **Icons**: React Icons
- **Notifications**: React Toastify

---

## Database Schema

### Core Tables

#### Users & Authentication
- `users` - User accounts (local + OAuth)
- `roles` - User roles (GUEST, USER, ADMIN)
- `user_roles` - User-role mapping

#### E-Commerce
- `categories` - Product categories
- `products` - Product catalog (LONGTEXT for base64 images)
- `carts` - Shopping carts
- `cart_items` - Cart line items
- `orders` - Customer orders
- `order_items` - Order line items
- `wishlists` - User wishlists

#### Events
- `events` - Event bookings (status: PENDING, APPROVED, REJECTED, CONFIRMED, etc.)
- `event_items` - Event product items
- `deliveries` - Delivery tracking

#### Additional
- `customization_options` - Product customization
- `seasonal_pricing` - Seasonal price adjustments
- `customer_preferences` - User preferences
- `sales_reports` - Aggregated sales data

### Key Schema Features
- **LONGTEXT** for `image_url` columns (supports base64 images)
- **VARCHAR(50)** for event `status` (supports all status values)
- **Approval workflow** fields: `rejection_reason`, `admin_notes`, `approved_by`, `approved_at`
- **Comprehensive indexes** for performance
- **Foreign key constraints** with proper cascade rules

---

## Backend API

### Authentication Endpoints
```
POST   /api/auth/register          - Register new user
POST   /api/auth/login             - Login (returns JWT)
GET    /api/auth/google            - Initiate Google OAuth
GET    /api/auth/google/callback   - OAuth callback
POST   /api/auth/logout            - Logout
```

### Product Endpoints
```
GET    /api/products               - Get all products
GET    /api/products/{id}          - Get product by ID
POST   /api/products               - Create product (ADMIN)
PUT    /api/products/{id}          - Update product (ADMIN)
DELETE /api/products/{id}          - Delete product (ADMIN)
```

### Category Endpoints
```
GET    /api/categories             - Get all categories
GET    /api/categories/with-counts - Get categories with product counts (ADMIN)
POST   /api/categories             - Create category (ADMIN)
PUT    /api/categories/{id}        - Update category (ADMIN)
DELETE /api/categories/{id}        - Delete category (ADMIN)
```

### Order Endpoints
```
GET    /api/orders                 - Get user orders
GET    /api/orders/{id}            - Get order by ID
POST   /api/orders                 - Create order
GET    /api/orders/admin/all       - Get all orders (ADMIN)
PUT    /api/orders/{id}/status     - Update order status (ADMIN)
```

### Event Endpoints
```
GET    /api/events                 - Get user events
GET    /api/events/{id}            - Get event by ID
POST   /api/events                 - Create event
DELETE /api/events/{id}            - Cancel event
GET    /api/events/admin/all       - Get all events (ADMIN)
GET    /api/events/pending         - Get pending events (ADMIN)
GET    /api/events/status/{status} - Get events by status (ADMIN)
POST   /api/events/{id}/approve    - Approve event (ADMIN)
POST   /api/events/{id}/reject     - Reject event (ADMIN)
```

### User Management Endpoints
```
GET    /api/users/with-counts      - Get users with order counts (ADMIN)
PUT    /api/users/{id}/toggle      - Toggle user status (ADMIN)
DELETE /api/users/{id}             - Delete user (ADMIN)
```

---

## Frontend Structure

### Directory Structure
```
frontend/src/
├── components/          # Reusable components
│   ├── Navbar.jsx
│   ├── Footer.jsx
│   ├── PrivateRoute.jsx
│   └── AdminRoute.jsx
├── pages/              # Page components
│   ├── Home.jsx
│   ├── Products.jsx
│   ├── Cart.jsx
│   ├── Checkout.jsx
│   ├── Orders.jsx
│   ├── Events.jsx
│   ├── EventBooking.jsx
│   ├── admin/
│   │   ├── AdminDashboard.jsx
│   │   ├── AdminProducts.jsx
│   │   ├── AdminCategories.jsx
│   │   ├── AdminUsers.jsx
│   │   ├── AdminOrders.jsx
│   │   └── AdminEvents.jsx
│   └── user/
│       └── MyEvents.jsx
├── context/            # React Context
│   ├── AuthContext.jsx
│   ├── CartContext.jsx
│   └── WishlistContext.jsx
├── services/           # API services
│   ├── authService.js
│   ├── productService.js
│   ├── categoryService.js
│   ├── orderService.js
│   ├── eventService.js
│   └── userService.js
├── App.jsx            # Main app component
└── index.css          # Tailwind CSS
```

### Key Components

**Admin Dashboard**
- Sidebar navigation
- Stats cards
- Data tables with CRUD operations
- Modal-based forms
- Professional, consistent UI

**Event Management**
- User: View own events, see status, rejection reasons
- Admin: View all events, approve/reject with notes, filter by status

**Authentication**
- JWT token storage in localStorage
- Automatic token refresh
- Protected routes
- Google OAuth integration

---

## Authentication & Authorization

### JWT Authentication
- Token generated on login
- Stored in localStorage
- Sent in `Authorization: Bearer <token>` header
- Expires after 24 hours (configurable)

### Google OAuth 2.0
1. User clicks "Sign in with Google"
2. Redirected to Google consent screen
3. Google redirects to `/api/auth/google/callback`
4. Backend creates/updates user, generates JWT
5. Frontend receives token and user data

### Role-Based Access Control
- **GUEST**: Public access
- **USER**: Authenticated user (orders, events, cart)
- **ADMIN**: Full system access

### Security Features
- Password encryption with BCrypt
- CORS configuration
- CSRF protection
- SQL injection prevention (JPA)
- XSS protection (React)

---

## Setup & Installation

### Prerequisites
- Java 17 or higher
- Node.js 18 or higher
- MySQL 8.0 or higher
- Maven 3.6+

### Database Setup
```bash
# 1. Create database and schema
mysql -u root -p < DB/schema.sql

# 2. Load sample data (optional for development)
mysql -u root -p < DB/seeder.sql
```

### Backend Setup
```bash
cd backend

# 1. Copy environment template
cp .env.example .env

# 2. Edit .env with your configuration
# (See Environment Configuration section)

# 3. Install dependencies and run
./mvnw clean install
./mvnw spring-boot:run
```

Backend will run on `http://localhost:8080`

### Frontend Setup
```bash
cd frontend

# 1. Install dependencies
npm install

# 2. Run development server
npm run dev
```

Frontend will run on `http://localhost:5173`

---

## Environment Configuration

### Backend (.env)
```properties
# Application
SPRING_APPLICATION_NAME=flora-ecommerce
SERVER_PORT=8080

# Database
DB_HOST=localhost
DB_PORT=3306
DB_NAME=flora_ecommerce
DB_USERNAME=root
DB_PASSWORD=your_password

# JPA
JPA_HIBERNATE_DDL_AUTO=update
JPA_SHOW_SQL=true

# JWT
JWT_SECRET=your_secure_64_character_secret_here
JWT_EXPIRATION=86400000

# Google OAuth
GOOGLE_CLIENT_ID=your_google_client_id
GOOGLE_CLIENT_SECRET=your_google_client_secret
OAUTH2_SUCCESS_REDIRECT=http://localhost:5173/auth/google/success
OAUTH2_FAILURE_REDIRECT=http://localhost:5173/login?error=oauth_failed

# CORS
CORS_ALLOWED_ORIGINS=http://localhost:5173,http://localhost:3000

# File Upload
MAX_FILE_SIZE=10MB
MAX_REQUEST_SIZE=10MB

# Logging
LOGGING_LEVEL=DEBUG
```

### Google OAuth Setup
1. Go to [Google Cloud Console](https://console.cloud.google.com)
2. Create a new project
3. Enable Google+ API
4. Create OAuth 2.0 credentials
5. Add authorized redirect URI: `http://localhost:8080/api/auth/google/callback`
6. Copy Client ID and Secret to `.env`

---

## Deployment

### Production Checklist

**Database**
- ✅ Run `schema.sql` on production database
- ✅ Skip `seeder.sql` (sample data only)
- ✅ Create admin user manually or via API

**Backend**
- ✅ Set `JPA_HIBERNATE_DDL_AUTO=validate`
- ✅ Set `JPA_SHOW_SQL=false`
- ✅ Set `LOGGING_LEVEL=INFO` or `WARN`
- ✅ Use strong JWT_SECRET (64+ characters)
- ✅ Configure production database credentials
- ✅ Update CORS origins for production domain
- ✅ Use HTTPS for OAuth redirects
- ✅ Build: `./mvnw clean package`
- ✅ Run: `java -jar target/flora-ecommerce.jar`

**Frontend**
- ✅ Update API base URL for production
- ✅ Build: `npm run build`
- ✅ Deploy `dist` folder to hosting service
- ✅ Configure environment variables

**Security**
- ✅ Use HTTPS
- ✅ Secure database connection
- ✅ Rotate JWT secret regularly
- ✅ Enable rate limiting
- ✅ Configure firewall rules

---

## Features

### User Features
- ✅ User registration and login
- ✅ Google OAuth authentication
- ✅ Browse products by category
- ✅ Add to cart and wishlist
- ✅ Checkout and order placement
- ✅ View order history
- ✅ Book events (weddings, birthdays, etc.)
- ✅ View event status and rejection reasons
- ✅ Cancel pending events

### Admin Features
- ✅ Dashboard with statistics
- ✅ Product management (CRUD)
- ✅ Category management (CRUD)
- ✅ User management (view, toggle status, delete)
- ✅ Order management (view all, update status)
- ✅ Event management (approve, reject with reason)
- ✅ Filter events by status
- ✅ View customer details

### Event Management Workflow
1. User creates event → Status: **PENDING**
2. Admin reviews event
3. Admin approves → Status: **APPROVED**
   - OR Admin rejects → Status: **REJECTED** (with reason)
4. User confirms → Status: **CONFIRMED**
5. Event day → Status: **IN_PROGRESS**
6. After event → Status: **COMPLETED**

### Technical Features
- ✅ JWT-based authentication
- ✅ Role-based access control
- ✅ Base64 image support (LONGTEXT)
- ✅ Responsive design
- ✅ Real-time notifications
- ✅ Professional admin UI
- ✅ Environment-based configuration
- ✅ Comprehensive error handling

---

## Default Credentials

**Admin Account:**
- Username: `admin`
- Email: `admin@flora.com`
- Password: `password123`

**Test User:**
- Username: `john_doe`
- Email: `john@example.com`
- Password: `password123`

> ⚠️ **Change these credentials in production!**

---

## Support & Contact

For technical support or questions, please refer to the codebase or contact the development team.

---

**© 2024 Flora E-Commerce. All rights reserved.**
