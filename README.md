# Flora E-Commerce Application

A complete, modern, full-stack e-commerce application built with Spring Boot and React.

## 🚀 Features

### Backend (Spring Boot)
- **JWT Authentication**: Secure token-based authentication
- **Google OAuth 2.0**: One-click sign-in with Google 🆕
- **Role-Based Access Control**: Admin, User, and Guest roles
- **RESTful APIs**: Complete CRUD operations
- **MySQL Database**: Reliable data persistence
- **Spring Security**: Comprehensive security implementation
- **Input Validation**: Bean Validation for data integrity

### Frontend (React + Vite)
- **Modern UI/UX**: Professional design with Tailwind CSS
- **Google Sign-In**: Seamless authentication with Google accounts 🆕
- **Responsive Design**: Works on all devices
- **Shopping Cart**: Full-featured cart management
- **Product Catalog**: Browse, search, and filter
- **Order Management**: Complete checkout and order history
- **Admin Panel**: Management dashboard

### Authentication Features 🆕
- Traditional email/password authentication
- Google Sign-In/Sign-Up with one click
- Automatic user creation from Google profile
- Avatar sync from Google profile picture
- Smart account linking (Google + existing email)
- Password-less authentication for OAuth users

## 📁 Project Structure

```
flora/
├── backend/                 # Spring Boot backend
│   ├── src/
│   │   └── main/
│   │       ├── java/com/flora/
│   │       │   ├── config/           # Configuration classes
│   │       │   ├── controller/       # REST controllers
│   │       │   ├── dto/              # Data transfer objects
│   │       │   ├── model/            # Entity models
│   │       │   ├── repository/       # JPA repositories
│   │       │   ├── security/         # Security & JWT
│   │       │   └── service/          # Business logic
│   │       └── resources/
│   │           └── application.properties
│   ├── pom.xml
│   └── README.md
│
├── frontend/                # React frontend
│   ├── src/
│   │   ├── components/      # Reusable components
│   │   ├── context/         # React context
│   │   ├── pages/           # Page components
│   │   ├── services/        # API services
│   │   ├── App.jsx
│   │   └── main.jsx
│   ├── package.json
│   ├── vite.config.js
│   ├── tailwind.config.js
│   └── README.md
│
└── DB/                      # Database scripts
    ├── 01_schema.sql        # Database schema
    ├── 02_sample_data.sql   # Sample data
    └── README.md
```

## 🛠️ Technologies

### Backend
- Java 17
- Spring Boot 3.2.0
- Spring Security
- Spring Data JPA
- MySQL 8.0
- JWT (JSON Web Tokens)
- Lombok
- Maven

### Frontend
- React 18.2
- Vite 5.0
- Tailwind CSS 3.3
- React Router DOM 6.20
- Axios
- React Icons
- React Toastify

## 📋 Prerequisites

- JDK 17 or higher
- Node.js 16 or higher
- MySQL 8.0 or higher
- Maven 3.6+

## 🚀 Getting Started

### 1. Database Setup

```bash
# Create database
mysql -u root -p
CREATE DATABASE flora_ecommerce;
exit

# Run schema script
cd DB
mysql -u root -p flora_ecommerce < 01_schema.sql

# Insert sample data (optional)
mysql -u root -p flora_ecommerce < 02_sample_data.sql
```

### 2. Backend Setup

```bash
cd backend

# Update application.properties with your MySQL credentials
# src/main/resources/application.properties

# Build and run
mvn clean install
mvn spring-boot:run
```

Backend will start on `http://localhost:8080`

### 3. Frontend Setup

```bash
cd frontend

# Install dependencies
npm install

# Run development server
npm run dev
```

Frontend will start on `http://localhost:5173`

## 🔑 Default Credentials

### Admin User
- Username: `admin`
- Password: `password123`

### Test Users
- Username: `john_doe` / Password: `password123`
- Username: `jane_smith` / Password: `password123`

## 📚 API Documentation

### Authentication Endpoints
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - Login user

### Product Endpoints
- `GET /api/products` - Get all products
- `GET /api/products/{id}` - Get product by ID
- `GET /api/products/featured` - Get featured products
- `GET /api/products/search?keyword=` - Search products
- `POST /api/products` - Create product (Admin)
- `PUT /api/products/{id}` - Update product (Admin)
- `DELETE /api/products/{id}` - Delete product (Admin)

### Cart Endpoints
- `GET /api/cart` - Get user's cart
- `POST /api/cart/add` - Add item to cart
- `PUT /api/cart/items/{itemId}` - Update cart item
- `DELETE /api/cart/items/{itemId}` - Remove from cart

### Order Endpoints
- `POST /api/orders` - Create order
- `GET /api/orders` - Get user's orders
- `GET /api/orders/{id}` - Get order by ID
- `GET /api/orders/all` - Get all orders (Admin)
- `PUT /api/orders/{id}/status` - Update order status (Admin)

## 🎯 Features Breakdown

### User Features
✅ User registration and authentication  
✅ Browse products by categories  
✅ Search and filter products  
✅ Add products to cart  
✅ Update cart quantities  
✅ Checkout process  
✅ Order history  
✅ User profile management  

### Admin Features
✅ Product management (CRUD)  
✅ Category management (CRUD)  
✅ Order management  
✅ User management  
✅ Inventory tracking  
✅ Order status updates  

### Technical Features
✅ JWT-based authentication  
✅ Google OAuth 2.0 integration 🆕  
✅ Role-based access control  
✅ Responsive design  
✅ Input validation  
✅ Error handling  
✅ Toast notifications  
✅ Loading states  
✅ Protected routes  

## 🔒 Security

- Passwords encrypted with BCrypt
- Google OAuth 2.0 for secure sign-in 🆕
- JWT tokens for stateless authentication
- Token verification with Google servers 🆕
- CORS configuration
- Protected API endpoints
- Role-based access control
- SQL injection prevention (JPA)
- Email verification through Google 🆕

## 🔐 Google OAuth Setup

To enable Google Sign-In/Sign-Up:

1. **Quick Setup**: See `GOOGLE_OAUTH_QUICK_SETUP.md` for 5-minute setup
2. **Detailed Guide**: See `GOOGLE_OAUTH_SETUP_GUIDE.md` for complete instructions
3. **Flow Diagram**: See `GOOGLE_OAUTH_FLOW_DIAGRAM.md` to understand the process

**Key Files:**
- Backend: `backend/src/main/resources/application.properties` (Add Google credentials)
- Frontend: `frontend/src/main.jsx` (Add Google Client ID)
- Database: `DB/03_google_oauth_migration.sql` (Run migration script)

**Documentation:**
- 📘 [Complete Setup Guide](GOOGLE_OAUTH_SETUP_GUIDE.md)
- ⚡ [Quick Setup (5 min)](GOOGLE_OAUTH_QUICK_SETUP.md)
- 📊 [Authentication Flow](GOOGLE_OAUTH_FLOW_DIAGRAM.md)
- 📋 [Implementation Summary](GOOGLE_OAUTH_IMPLEMENTATION_SUMMARY.md)

## 📱 Screenshots

*(Add screenshots of your application here)*

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## 📄 License

This project is licensed under the MIT License.

## 👨‍💻 Author

Flora E-Commerce Team

## 🙏 Acknowledgments

- Spring Boot Documentation
- React Documentation
- Tailwind CSS
- Vite
- All open-source contributors

## 📞 Support

For support, email support@flora.com or open an issue in the repository.

---

**Happy Shopping! 🛍️**
