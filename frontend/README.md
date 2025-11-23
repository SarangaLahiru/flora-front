# Flora E-Commerce - Frontend

> **React 18 | Vite | Tailwind CSS | React Router | Axios**

Modern, responsive frontend for Flora E-Commerce flower shop application with beautiful UI, admin dashboard, and seamless user experience.

---

## 🚀 Features

### User Features
- ✅ **Product Catalog** - Browse flowers by category
- ✅ **Shopping Cart** - Add, update, remove items
- ✅ **Wishlist** - Save favorite products
- ✅ **Checkout** - Multi-step checkout process
- ✅ **Order Tracking** - View order history and status
- ✅ **Event Booking** - Book events (weddings, birthdays, etc.)
- ✅ **Authentication** - Login, register, Google OAuth

### Admin Features
- ✅ **Dashboard** - Statistics and analytics
- ✅ **Product Management** - CRUD with image upload
- ✅ **Category Management** - Manage product categories
- ✅ **User Management** - View, toggle status, delete users
- ✅ **Order Management** - View all orders, update status
- ✅ **Event Management** - Approve/reject events with notes

### UI/UX
- ✅ **Responsive Design** - Mobile, tablet, desktop
- ✅ **Modern UI** - Tailwind CSS with custom components
- ✅ **Smooth Animations** - Framer Motion
- ✅ **Toast Notifications** - User feedback
- ✅ **Professional Admin Interface** - Consistent design

---

## 🛠️ Technology Stack

- **Framework**: React 18
- **Build Tool**: Vite
- **Styling**: Tailwind CSS
- **Routing**: React Router v6
- **HTTP Client**: Axios
- **State Management**: Context API
- **Icons**: React Icons
- **Notifications**: React Toastify
- **OAuth**: @react-oauth/google
- **Animations**: Framer Motion
- **Charts**: Recharts

---

## 📋 Prerequisites

- **Node.js 18+**
- **npm or yarn**
- Backend API running on `http://localhost:8080`

---

## ⚙️ Setup & Installation

### 1. Install Dependencies

```bash
npm install
```

### 2. Configure API Endpoint

The API base URL is configured in `src/services/*.js` files:

```javascript
const API_URL = 'http://localhost:8080/api';
```

For production, update this to your production backend URL.

### 3. Run Development Server

```bash
npm run dev
```

**Frontend will start on:** `http://localhost:5173`

---

## 📁 Project Structure

```
frontend/src/
├── components/          # Reusable components
│   ├── Navbar.jsx
│   ├── Footer.jsx
│   ├── Loading.jsx
│   ├── PrivateRoute.jsx
│   └── AdminRoute.jsx
│
├── pages/              # Page components
│   ├── Home.jsx
│   ├── Products.jsx
│   ├── ProductDetail.jsx
│   ├── Cart.jsx
│   ├── Checkout.jsx
│   ├── Orders.jsx
│   ├── OrderSuccess.jsx
│   ├── Events.jsx
│   ├── EventBooking.jsx
│   ├── Login.jsx
│   ├── Register.jsx
│   ├── DeliveryTracking.jsx
│   │
│   ├── admin/          # Admin pages
│   │   ├── AdminDashboard.jsx
│   │   ├── AdminProducts.jsx
│   │   ├── AdminCategories.jsx
│   │   ├── AdminUsers.jsx
│   │   ├── AdminOrders.jsx
│   │   └── AdminEvents.jsx
│   │
│   └── user/           # User-specific pages
│       └── MyEvents.jsx
│
├── context/            # React Context
│   ├── AuthContext.jsx
│   ├── CartContext.jsx
│   └── WishlistContext.jsx
│
├── services/           # API services
│   ├── authService.js
│   ├── productService.js
│   ├── categoryService.js
│   ├── cartService.js
│   ├── orderService.js
│   ├── eventService.js
│   ├── userService.js
│   └── wishlistService.js
│
├── App.jsx            # Main app component
├── index.css          # Tailwind CSS
└── main.jsx           # Entry point
```

---

## 🎨 Key Components

### Authentication
- **AuthContext** - Manages user authentication state
- **PrivateRoute** - Protects authenticated routes
- **AdminRoute** - Protects admin-only routes
- **Login/Register** - User authentication pages
- **Google OAuth** - Social login integration

### Shopping Experience
- **Products** - Product catalog with filters
- **ProductDetail** - Detailed product view
- **Cart** - Shopping cart management
- **Checkout** - Multi-step checkout process
- **Orders** - Order history and tracking

### Event Management
- **Events** - User's event bookings
- **EventBooking** - Create new event booking
- **AdminEvents** - Admin event approval interface

### Admin Dashboard
- **AdminDashboard** - Statistics and overview
- **AdminProducts** - Product CRUD with image upload
- **AdminCategories** - Category management
- **AdminUsers** - User management
- **AdminOrders** - Order management
- **AdminEvents** - Event approval workflow

---

## 🔐 Authentication

### JWT Token Management
```javascript
// Stored in localStorage
localStorage.setItem('token', token);
localStorage.setItem('user', JSON.stringify(user));

// Sent in API requests
headers: {
  'Authorization': `Bearer ${token}`
}
```

### Protected Routes
```jsx
// User routes
<PrivateRoute>
  <Orders />
</PrivateRoute>

// Admin routes
<AdminRoute>
  <AdminDashboard />
</AdminRoute>
```

---

## 🎯 Available Scripts

### Development
```bash
npm run dev          # Start development server
npm run build        # Build for production
npm run preview      # Preview production build
npm run lint         # Run ESLint
```

### Production Build
```bash
npm run build
```

Output will be in `dist/` folder.

---

## 🌐 API Integration

### Service Layer Pattern
All API calls are centralized in service files:

```javascript
// Example: productService.js
import axios from 'axios';

const API_URL = 'http://localhost:8080/api';

export const productService = {
  getAllProducts: async () => {
    const response = await axios.get(`${API_URL}/products`);
    return response.data;
  },
  
  getProductById: async (id) => {
    const response = await axios.get(`${API_URL}/products/${id}`);
    return response.data;
  }
};
```

### Axios Interceptors
```javascript
// Add token to all requests
axios.interceptors.request.use(config => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});
```

---

## 🎨 Styling

### Tailwind CSS
Custom configuration in `tailwind.config.js`:

```javascript
module.exports = {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      colors: {
        primary: '#ec4899',  // Pink
        secondary: '#8b5cf6' // Purple
      }
    }
  }
}
```

### Custom CSS Classes
Defined in `index.css`:
- `.btn-primary` - Primary button style
- `.btn-secondary` - Secondary button style
- `.card` - Card container style
- `.input-field` - Form input style

---

## 📱 Responsive Design

### Breakpoints
- **Mobile**: < 640px
- **Tablet**: 640px - 1024px
- **Desktop**: > 1024px

### Example
```jsx
<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
  {/* Responsive grid */}
</div>
```

---

## 🚀 Production Deployment

### Build for Production
```bash
npm run build
```

### Environment Variables
Update API URLs for production:

```javascript
// Before build, update in service files
const API_URL = process.env.VITE_API_URL || 'https://api.yourproduction.com/api';
```

### Deployment Options
- **Vercel**: `vercel deploy`
- **Netlify**: `netlify deploy`
- **AWS S3**: Upload `dist/` folder
- **Nginx**: Serve `dist/` folder

### Production Checklist
- ✅ Update API base URL
- ✅ Build optimized bundle
- ✅ Configure CORS on backend
- ✅ Set up HTTPS
- ✅ Configure environment variables
- ✅ Test all features

---

## 🧪 Testing

### Manual Testing
1. Start backend server
2. Start frontend: `npm run dev`
3. Test user flows:
   - Registration/Login
   - Browse products
   - Add to cart
   - Checkout
   - View orders
   - Book events

### Admin Testing
1. Login with admin credentials
2. Test admin features:
   - Product management
   - Category management
   - User management
   - Order management
   - Event approval

---

## 🔧 Troubleshooting

### CORS Issues
- Ensure backend CORS is configured
- Check `CORS_ALLOWED_ORIGINS` in backend `.env`

### API Connection Issues
- Verify backend is running on port 8080
- Check API_URL in service files
- Inspect network tab in browser DevTools

### Build Issues
```bash
# Clear cache and reinstall
rm -rf node_modules package-lock.json
npm install
npm run build
```

---

## 📚 Additional Resources

- [Main Documentation](../DOCUMENTATION.md)
- [Backend README](../backend/README.md)
- [React Documentation](https://react.dev)
- [Vite Documentation](https://vitejs.dev)
- [Tailwind CSS](https://tailwindcss.com)

---

## 🎯 Key Features Showcase

### User Interface
- Modern, clean design
- Smooth animations
- Intuitive navigation
- Mobile-responsive

### Admin Dashboard
- Professional table layouts
- Modal-based forms
- Real-time statistics
- Consistent UI/UX

### Shopping Experience
- Easy product browsing
- Quick add to cart
- Streamlined checkout
- Order tracking

### Event Management
- Simple booking process
- Status tracking
- Rejection reason display
- Admin approval workflow

---

## 📄 License

MIT License - See LICENSE file for details

---

**Built with ❤️ using React + Vite + Tailwind CSS**
