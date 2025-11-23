# Flora E-Commerce - Backend

> **Spring Boot 3.2 | Java 17 | MySQL 8 | JWT Authentication | Google OAuth 2.0**

Modern, secure backend API for Flora E-Commerce flower shop application with comprehensive event management, admin dashboard, and OAuth integration.

---

## 🚀 Features

### Core Features
- ✅ **JWT Authentication** - Secure token-based authentication
- ✅ **Google OAuth 2.0** - Social login integration (optional)
- ✅ **Role-Based Access Control** - ADMIN, USER, GUEST roles
- ✅ **Event Management** - Wedding, birthday, corporate event bookings with approval workflow
- ✅ **E-Commerce** - Products, categories, cart, orders, wishlist
- ✅ **Admin Dashboard** - Complete management interface
- ✅ **Base64 Image Support** - LONGTEXT columns for image storage

### Security
- ✅ BCrypt password encryption
- ✅ JWT token validation
- ✅ CORS configuration
- ✅ SQL injection prevention (JPA)
- ✅ Role-based endpoint protection

---

## 🛠️ Technology Stack

- **Framework**: Spring Boot 3.2.x
- **Language**: Java 17+
- **Security**: Spring Security 6 + JWT
- **ORM**: Spring Data JPA + Hibernate
- **Database**: MySQL 8.0
- **Build Tool**: Maven
- **OAuth**: Spring OAuth2 Client
- **Validation**: Bean Validation

---

## 📋 Prerequisites

- **JDK 17** or higher
- **Maven 3.6+**
- **MySQL 8.0+**
- **Google Cloud Console** account (for OAuth - optional)

---

## ⚙️ Setup & Installation

### 1. Database Setup

```bash
# Create database and schema
mysql -u root -p < ../DB/schema.sql

# Load sample data (optional for development)
mysql -u root -p < ../DB/seeder.sql
```

### 2. Configure Application

Edit `src/main/resources/application.properties`:

**Required Changes:**
```properties
# Database credentials
spring.datasource.username=root
spring.datasource.password=your_mysql_password

# JWT Secret (change in production)
jwt.secret=your_secure_64_character_secret_here
```

**Optional - Google OAuth:**
```properties
# Get from https://console.cloud.google.com
spring.security.oauth2.client.registration.google.client-id=your_client_id
spring.security.oauth2.client.registration.google.client-secret=your_client_secret
```

### 3. Build & Run

```bash
# Install dependencies and run
mvn clean install
mvn spring-boot:run
```

**Backend will start on:** `http://localhost:8080`

---

## 📡 API Endpoints

### Authentication
```
POST   /api/auth/register          - Register new user
POST   /api/auth/login             - Login (returns JWT)
GET    /api/auth/google            - Initiate Google OAuth
GET    /api/auth/google/callback   - OAuth callback
POST   /api/auth/logout            - Logout
```

### Products
```
GET    /api/products               - Get all products
GET    /api/products/{id}          - Get product by ID
GET    /api/products/featured      - Get featured products
GET    /api/products/search        - Search products
POST   /api/products               - Create product (ADMIN)
PUT    /api/products/{id}          - Update product (ADMIN)
DELETE /api/products/{id}          - Delete product (ADMIN)
```

### Categories
```
GET    /api/categories             - Get all categories
GET    /api/categories/with-counts - Get with product counts (ADMIN)
POST   /api/categories             - Create category (ADMIN)
PUT    /api/categories/{id}        - Update category (ADMIN)
DELETE /api/categories/{id}        - Delete category (ADMIN)
```

### Cart & Wishlist
```
GET    /api/cart                   - Get user cart
POST   /api/cart/add               - Add to cart
PUT    /api/cart/items/{id}        - Update quantity
DELETE /api/cart/items/{id}        - Remove from cart
DELETE /api/cart/clear              - Clear cart

GET    /api/wishlist               - Get wishlist
POST   /api/wishlist/add/{id}      - Add to wishlist
DELETE /api/wishlist/remove/{id}   - Remove from wishlist
```

### Orders
```
GET    /api/orders                 - Get user orders
GET    /api/orders/{id}            - Get order by ID
POST   /api/orders                 - Create order
GET    /api/orders/admin/all       - Get all orders (ADMIN)
PUT    /api/orders/{id}/status     - Update status (ADMIN)
```

### Events
```
GET    /api/events                 - Get user events
GET    /api/events/{id}            - Get event by ID
POST   /api/events                 - Create event
DELETE /api/events/{id}            - Cancel event
GET    /api/events/admin/all       - Get all events (ADMIN)
GET    /api/events/pending         - Get pending events (ADMIN)
POST   /api/events/{id}/approve    - Approve event (ADMIN)
POST   /api/events/{id}/reject     - Reject event (ADMIN)
```

### Users (Admin)
```
GET    /api/users/with-counts      - Get users with order counts
PUT    /api/users/{id}/toggle      - Toggle user status
DELETE /api/users/{id}             - Delete user
```

---

## 🔐 Authentication Flow

### JWT Authentication
1. User registers or logs in
2. Backend generates JWT token
3. Frontend stores token in localStorage
4. Token sent in `Authorization: Bearer <token>` header
5. Backend validates token on each request

### Google OAuth Flow
1. User clicks "Sign in with Google"
2. Redirected to Google consent screen
3. Google redirects to `/api/auth/google/callback`
4. Backend creates/updates user, generates JWT
5. Frontend receives token and user data

---

## 🗄️ Database Schema

### Key Tables
- `users` - User accounts (local + OAuth)
- `roles` - User roles
- `user_roles` - User-role mapping
- `products` - Product catalog (LONGTEXT for images)
- `categories` - Product categories
- `orders` - Customer orders
- `order_items` - Order line items
- `events` - Event bookings (with approval workflow)
- `event_items` - Event products
- `carts` - Shopping carts
- `wishlists` - User wishlists

### Event Status Flow
```
PENDING → APPROVED/REJECTED → CONFIRMED → IN_PROGRESS → COMPLETED
```

---

## 👤 Default Credentials

**Admin Account:**
- Username: `admin`
- Email: `admin@flora.com`
- Password: `password123`

**Test User:**
- Username: `john_doe`
- Email: `john@example.com`
- Password: `password123`

> ⚠️ **Change these in production!**

---

## 🚀 Production Deployment

### Configuration Changes in application.properties
```properties
# Database - Use production credentials
spring.datasource.password=strong_production_password

# JPA - Don't auto-update schema
spring.jpa.hibernate.ddl-auto=validate
spring.jpa.show-sql=false

# JWT - Use strong secret
jwt.secret=your_very_long_and_secure_production_secret_key_here

# CORS - Set production origins
cors.allowed-origins=https://yourdomain.com

# Logging - Reduce verbosity
logging.level.com.flora=INFO
logging.level.org.springframework.security=WARN
```

### Build for Production
```bash
mvn clean package
java -jar target/flora-ecommerce.jar
```

### Security Checklist
- ✅ Use strong JWT secret (64+ characters)
- ✅ Set `ddl-auto=validate` (not update)
- ✅ Disable SQL logging
- ✅ Use HTTPS
- ✅ Configure proper CORS origins
- ✅ Secure database credentials
- ✅ Enable rate limiting
- ✅ Change default admin password

---

## 📁 Project Structure

```
backend/
├── src/main/java/com/flora/
│   ├── config/          # Security, CORS, JWT config
│   ├── controller/      # REST controllers
│   ├── dto/             # Data Transfer Objects
│   ├── model/           # JPA entities
│   ├── repository/      # JPA repositories
│   ├── service/         # Business logic
│   └── security/        # JWT utilities, OAuth handlers
├── src/main/resources/
│   └── application.properties  # All configuration here
└── pom.xml
```

---

## 🧪 Testing

### Run Tests
```bash
mvn test
```

### Test with Sample Data
1. Run `DB/seeder.sql` to load sample data
2. Use default credentials to login
3. Test API endpoints with Postman/curl

---

## 🔧 Troubleshooting

### Database Connection Issues
- Verify MySQL is running
- Check credentials in `application.properties`
- Ensure database exists

### JWT Token Issues
- Check `jwt.secret` is set
- Verify token expiration time
- Clear localStorage and re-login

### OAuth Issues
- Verify Google credentials in `application.properties`
- Check redirect URI in Google Console
- Ensure callback URL is correct

---

## 📚 Additional Resources

- [Main Documentation](../DOCUMENTATION.md)
- [Database Schema](../DB/README.md)
- [Spring Boot Docs](https://spring.io/projects/spring-boot)
- [Spring Security Docs](https://spring.io/projects/spring-security)

---

## 📄 License

MIT License - See LICENSE file for details

---

**Built with ❤️ using Spring Boot**
