import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { AuthProvider } from './context/AuthContext';
import { CartProvider } from './context/CartContext';
import { WishlistProvider } from './context/WishlistContext';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import Home from './pages/Home';
import Products from './pages/Products';
import ProductDetail from './pages/ProductDetail';
import Cart from './pages/Cart';
import Checkout from './pages/Checkout';
import Orders from './pages/Orders';
import Login from './pages/Login';
import Register from './pages/Register';
import Events from './pages/Events';
import EventBooking from './pages/EventBooking';
import DeliveryTracking from './pages/DeliveryTracking';
import OrderSuccess from './pages/OrderSuccess';
import AdminDashboard from './pages/admin/AdminDashboard';
import PrivateRoute from './components/PrivateRoute';
import AdminRoute from './components/AdminRoute';

function AppContent() {
  const location = useLocation();
  const isAdminRoute = location.pathname.startsWith('/admin');

  return (
    <div className="flex flex-col min-h-screen">
      {!isAdminRoute && <Navbar />}
      <main className={isAdminRoute ? '' : 'flex-grow'}>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/products" element={<Products />} />
          <Route path="/products/:id" element={<ProductDetail />} />
          <Route path="/cart" element={<Cart />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/track-delivery" element={<DeliveryTracking />} />

          <Route path="/checkout" element={
            <PrivateRoute>
              <Checkout />
            </PrivateRoute>
          } />

          <Route path="/orders" element={
            <PrivateRoute>
              <Orders />
            </PrivateRoute>
          } />

          <Route path="/order-success/:orderNumber" element={
            <PrivateRoute>
              <OrderSuccess />
            </PrivateRoute>
          } />

          <Route path="/events" element={
            <PrivateRoute>
              <Events />
            </PrivateRoute>
          } />

          <Route path="/event-booking" element={
            <PrivateRoute>
              <EventBooking />
            </PrivateRoute>
          } />

          <Route path="/admin/*" element={
            <AdminRoute>
              <AdminDashboard />
            </AdminRoute>
          } />
        </Routes>
      </main>
      {!isAdminRoute && <Footer />}
      <ToastContainer
        position="top-right"
        autoClose={3000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="light"
      />
    </div>
  );
}

function App() {
  return (
    <Router
      future={{
        v7_startTransition: true,
        v7_relativeSplatPath: true
      }}
    >
      <AuthProvider>
        <CartProvider>
          <WishlistProvider>
            <AppContent />
          </WishlistProvider>
        </CartProvider>
      </AuthProvider>
    </Router>
  );
}

export default App;
