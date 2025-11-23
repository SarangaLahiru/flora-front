import { useState, useEffect, useRef } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  LuShoppingBag,
  LuHeart,
  LuUser,
  LuSearch,
  LuLogOut,
  LuPackage,
  LuMenu,
  LuX,
  LuFlower2
} from 'react-icons/lu';
import { MdAdminPanelSettings, MdEvent } from 'react-icons/md';
import { productService } from '../services/productService';
import { useAuth } from '../context/AuthContext';
import { useCart } from '../context/CartContext';
import { useWishlist } from '../context/WishlistContext';
import CartDrawer from './CartDrawer';
import WishlistDrawer from './WishlistDrawer';

// Generate consistent color from string
const getInitialsColor = (str) => {
  const colors = [
    'from-pink-500 to-rose-500',
    'from-purple-500 to-indigo-500',
    'from-blue-500 to-cyan-500',
    'from-emerald-500 to-teal-500',
    'from-amber-500 to-orange-500',
    'from-red-500 to-pink-500',
    'from-violet-500 to-purple-500',
    'from-fuchsia-500 to-pink-500',
    'from-cyan-500 to-blue-500',
    'from-lime-500 to-green-500',
  ];
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    hash = str.charCodeAt(i) + ((hash << 5) - hash);
  }
  return colors[Math.abs(hash) % colors.length];
};

const Navbar = () => {
  const { user, logout, isAuthenticated, hasRole } = useAuth();
  const { getCartItemsCount } = useCart();
  const { wishlistCount } = useWishlist();
  const [showUserMenu, setShowUserMenu] = useState(false);
  const [showCartDrawer, setShowCartDrawer] = useState(false);
  const [showWishlistDrawer, setShowWishlistDrawer] = useState(false);
  const [showMobileMenu, setShowMobileMenu] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [searchLoading, setSearchLoading] = useState(false);
  const [showSearchDropdown, setShowSearchDropdown] = useState(false);
  const userMenuRef = useRef(null);
  const searchRef = useRef(null);
  const dropdownRef = useRef(null);
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (userMenuRef.current && !userMenuRef.current.contains(event.target)) {
        setShowUserMenu(false);
      }
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target) &&
        searchRef.current &&
        !searchRef.current.contains(event.target)
      ) {
        setShowSearchDropdown(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  useEffect(() => {
    if (!searchTerm.trim()) {
      setSearchResults([]);
      setSearchLoading(false);
      return;
    }

    const handler = setTimeout(async () => {
      try {
        setSearchLoading(true);
        const data = await productService.searchProducts(searchTerm.trim());
        setSearchResults(data.slice(0, 5));
        setShowSearchDropdown(true);
      } catch (error) {
        console.error('Error searching products:', error);
      } finally {
        setSearchLoading(false);
      }
    }, 350);

    return () => clearTimeout(handler);
  }, [searchTerm]);

  const getUserDisplayName = () => {
    if (user?.firstName && user?.lastName) {
      return `${user.firstName} ${user.lastName}`;
    }
    return user?.username || 'User';
  };

  const getUserEmail = () => {
    return user?.email || '';
  };

  const getInitials = () => {
    if (user?.firstName && user?.lastName) {
      return (user.firstName.charAt(0) + user.lastName.charAt(0)).toUpperCase();
    }
    if (user?.username) {
      return user.username.substring(0, 2).toUpperCase();
    }
    return 'U';
  };

  const handleLogout = () => {
    logout();
    setShowUserMenu(false);
    navigate('/');
  };

  return (
    <>
      <nav className="bg-white shadow-sm sticky top-0 z-50 border-b border-charcoal-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center h-16 gap-4">
            {/* Logo */}
            <Link to="/" className="flex items-center space-x-2">
              <div className="w-11 h-11 bg-primary-500 rounded-xl flex items-center justify-center shadow-md">
                <LuFlower2 className="text-white text-2xl" />
              </div>
              <span className="text-2xl font-bold text-primary-600">
                Flora
              </span>
            </Link>

            {/* Search */}
            <div className="hidden lg:flex flex-1 justify-center px-4">
              <div className="w-full max-w-xl relative" ref={searchRef}>
                <div className="relative">
                  <LuSearch className="absolute left-4 top-1/2 -translate-y-1/2 text-charcoal-400" />
                  <input
                    type="text"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    onFocus={() => searchTerm.trim() && setShowSearchDropdown(true)}
                    placeholder="Search bouquets, orchids, subscriptions..."
                    className="w-full pl-12 pr-4 py-3 rounded-full border border-charcoal-100 focus:ring-2 focus:ring-primary-300 focus:border-primary-400 bg-white text-sm text-charcoal-800 transition-all"
                  />
                  {searchTerm && (
                    <button
                      type="button"
                      className="absolute right-4 top-1/2 -translate-y-1/2 text-xs text-charcoal-400 hover:text-charcoal-600"
                      onClick={() => {
                        setSearchTerm('');
                        setSearchResults([]);
                        setShowSearchDropdown(false);
                      }}
                    >
                      Clear
                    </button>
                  )}
                </div>
                {searchTerm && showSearchDropdown && (
                  <div
                    ref={dropdownRef}
                    className="absolute left-0 right-0 mt-2 bg-white border border-charcoal-100 rounded-2xl shadow-2xl z-50 max-h-80 overflow-y-auto"
                  >
                    {searchLoading ? (
                      <div className="p-6 text-center text-charcoal-500">Searching blooms…</div>
                    ) : searchResults.length > 0 ? (
                      <div className="divide-y divide-charcoal-100">
                        {searchResults.map((product) => (
                          <Link
                            key={product.id}
                            to={`/products/${product.id}`}
                            onClick={() => {
                              setShowSearchDropdown(false);
                              setSearchTerm('');
                            }}
                            className="flex items-center gap-3 px-4 py-3 hover:bg-charcoal-50 transition-colors"
                          >
                            <div className="w-12 h-12 rounded-xl bg-charcoal-100 overflow-hidden flex-shrink-0">
                              {product.imageUrl ? (
                                <img
                                  src={product.imageUrl}
                                  alt={product.name}
                                  className="w-full h-full object-cover"
                                />
                              ) : (
                                <div className="w-full h-full flex items-center justify-center text-charcoal-400">
                                  <LuShoppingBag />
                                </div>
                              )}
                            </div>
                            <div className="min-w-0">
                              <p className="font-semibold text-charcoal-900 truncate">{product.name}</p>
                              <p className="text-sm text-charcoal-500 truncate">{product.description}</p>
                            </div>
                            <span className="font-semibold text-primary-600">
                              ${product.price?.toFixed(2)}
                            </span>
                          </Link>
                        ))}
                      </div>
                    ) : (
                      <div className="p-6 text-center">
                        <p className="text-charcoal-900 font-semibold mb-1">No blooms found</p>
                        <p className="text-sm text-charcoal-500">Try another keyword</p>
                      </div>
                    )}
                  </div>
                )}
              </div>
            </div>

            {/* Right Side Icons */}
            <div className="flex items-center space-x-2">
              {/* Cart Button */}
              <button
                onClick={() => setShowCartDrawer(true)}
                className="relative p-2.5 text-charcoal-600 hover:bg-gradient-to-br hover:from-primary-50 hover:to-blush-50 rounded-xl transition-all group"
                title="Shopping Cart"
              >
                <LuShoppingBag className="text-2xl group-hover:text-primary-600 transition-colors" />
                {isAuthenticated() && getCartItemsCount() > 0 && (
                  <motion.span
                    key={getCartItemsCount()}
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    exit={{ scale: 0 }}
                    transition={{ type: 'spring', stiffness: 500, damping: 25 }}
                    className="absolute -top-1 -right-1 bg-primary-500 text-white text-xs font-bold rounded-full w-5 h-5 flex items-center justify-center shadow-md"
                  >
                    {getCartItemsCount()}
                  </motion.span>
                )}
              </button>

              {/* Wishlist Button */}
              <button
                onClick={() => setShowWishlistDrawer(true)}
                className="relative p-2.5 text-charcoal-600 hover:bg-gradient-to-br hover:from-primary-50 hover:to-blush-50 rounded-xl transition-all group"
                title="Wishlist"
              >
                <LuHeart className="text-2xl group-hover:text-primary-600 transition-colors" />
                {wishlistCount > 0 && (
                  <motion.span
                    key={wishlistCount}
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    exit={{ scale: 0 }}
                    transition={{ type: 'spring', stiffness: 500, damping: 25 }}
                    className="absolute -top-1 -right-1 bg-primary-500 text-white text-xs font-bold rounded-full w-5 h-5 flex items-center justify-center shadow-md"
                  >
                    {wishlistCount}
                  </motion.span>
                )}
              </button>

              {/* User Menu / Auth Buttons */}
              {isAuthenticated() ? (
                <div className="relative" ref={userMenuRef}>
                  <button
                    onClick={() => setShowUserMenu(!showUserMenu)}
                    className="flex items-center space-x-2 p-1.5 hover:bg-charcoal-50 rounded-xl transition-all group"
                  >
                    {user?.avatarUrl ? (
                      <img
                        src={user.avatarUrl}
                        alt={getUserDisplayName()}
                        className="w-9 h-9 rounded-full border-2 border-charcoal-200 group-hover:border-iris-300 transition-colors object-cover"
                      />
                    ) : (
                      <div className={`w-9 h-9 rounded-full bg-gradient-to-br ${getInitialsColor(user?.username || 'user')} flex items-center justify-center text-white font-bold shadow-soft group-hover:scale-105 transition-transform text-sm`}>
                        {getInitials()}
                      </div>
                    )}
                    <span className="hidden md:block font-medium text-charcoal-900">{user?.username}</span>
                  </button>

                  {showUserMenu && (
                    <div className="absolute right-0 mt-2 w-72 bg-white rounded-2xl shadow-xl border border-charcoal-100 py-2 z-50 overflow-hidden">
                      {/* User Info Section */}
                      <div className="px-4 py-3 border-b border-charcoal-100 bg-gradient-to-r from-blush-50 to-iris-50">
                        <p className="font-semibold text-charcoal-900 text-sm">{getUserDisplayName()}</p>
                        <p className="text-xs text-charcoal-600 mt-0.5 truncate">{getUserEmail()}</p>
                      </div>

                      {/* Menu Items */}
                      <div className="py-1">
                        <Link
                          to="/orders"
                          className="flex items-center px-4 py-2.5 text-charcoal-700 hover:bg-charcoal-50 transition-colors"
                          onClick={() => setShowUserMenu(false)}
                        >
                          <LuPackage className="mr-3 text-charcoal-400" size={18} />
                          My Orders
                        </Link>
                        <Link
                          to="/events"
                          className="flex items-center px-4 py-2.5 text-charcoal-700 hover:bg-charcoal-50 transition-colors"
                          onClick={() => setShowUserMenu(false)}
                        >
                          <MdEvent className="mr-3 text-charcoal-400" size={18} />
                          My Events
                        </Link>
                        {hasRole('ROLE_ADMIN') && (
                          <Link
                            to="/admin"
                            className="flex items-center px-4 py-2.5 text-charcoal-700 hover:bg-charcoal-50 transition-colors"
                            onClick={() => setShowUserMenu(false)}
                          >
                            <MdAdminPanelSettings className="mr-3 text-charcoal-400" size={18} />
                            Admin Panel
                          </Link>
                        )}
                        <button
                          onClick={handleLogout}
                          className="flex items-center w-full px-4 py-2.5 text-red-600 hover:bg-red-50 transition-colors mt-1"
                        >
                          <LuLogOut className="mr-3" size={18} />
                          Logout
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              ) : (
                <div className="flex items-center space-x-2">
                  <Link
                    to="/login"
                    className="btn-outline text-sm px-4 py-2 text-primary-600 border-primary-200"
                  >
                    Login
                  </Link>
                  <Link to="/register" className="btn-primary text-sm px-4 py-2 bg-primary-500">
                    Register
                  </Link>
                </div>
              )}

              {/* Mobile Menu Button */}
              <button
                onClick={() => setShowMobileMenu(!showMobileMenu)}
                className="md:hidden p-2 text-charcoal-700 hover:bg-charcoal-50 rounded-xl transition-colors"
              >
                {showMobileMenu ? <LuX size={24} /> : <LuMenu size={24} />}
              </button>
            </div>
          </div>

          {/* Desktop nav links */}
          <div className="hidden md:flex items-center justify-center gap-1 pb-3">
            <Link 
              to="/" 
              className={`px-6 py-2.5 rounded-xl font-semibold transition-all ${
                location.pathname === '/' 
                  ? 'text-primary-600 bg-primary-50' 
                  : 'text-charcoal-700 hover:text-primary-600 hover:bg-primary-50/50'
              }`}
            >
              Home
            </Link>
            <Link 
              to="/products" 
              className={`px-6 py-2.5 rounded-xl font-semibold transition-all ${
                location.pathname.startsWith('/products') 
                  ? 'text-primary-600 bg-primary-50' 
                  : 'text-charcoal-700 hover:text-primary-600 hover:bg-primary-50/50'
              }`}
            >
              Products
            </Link>
            <Link
              to="/track-delivery"
              className={`px-6 py-2.5 rounded-xl font-semibold transition-all ${
                location.pathname === '/track-delivery' 
                  ? 'text-primary-600 bg-primary-50' 
                  : 'text-charcoal-700 hover:text-primary-600 hover:bg-primary-50/50'
              }`}
            >
              Track Delivery
            </Link>
            <Link
              to="/events"
              className={`px-6 py-2.5 rounded-xl font-semibold transition-all ${
                location.pathname.startsWith('/events') 
                  ? 'text-primary-600 bg-primary-50' 
                  : 'text-charcoal-700 hover:text-primary-600 hover:bg-primary-50/50'
              }`}
            >
              Events
            </Link>
          </div>

          {/* Mobile Menu */}
          {showMobileMenu && (
            <div className="md:hidden py-4 border-t border-charcoal-100">
              <Link
                to="/"
                className="block px-4 py-2 text-charcoal-700 hover:bg-charcoal-50 rounded-lg transition-colors"
                onClick={() => setShowMobileMenu(false)}
              >
                Home
              </Link>
              <Link
                to="/products"
                className="block px-4 py-2 text-charcoal-700 hover:bg-charcoal-50 rounded-lg transition-colors"
                onClick={() => setShowMobileMenu(false)}
              >
                Products
              </Link>
              <Link
                to="/track-delivery"
                className="block px-4 py-2 text-charcoal-700 hover:bg-charcoal-50 rounded-lg transition-colors"
                onClick={() => setShowMobileMenu(false)}
              >
                Track Delivery
              </Link>
              <div className="px-4 py-2">
                <div className="relative">
                  <LuSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-charcoal-400" />
                  <input
                    type="text"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    placeholder="Search..."
                    className="w-full pl-10 pr-3 py-2 rounded-lg border border-charcoal-200 text-sm"
                  />
                </div>
              </div>
            </div>
          )}
        </div>
      </nav>

      {/* Drawers */}
      <CartDrawer isOpen={showCartDrawer} onClose={() => setShowCartDrawer(false)} />
      <WishlistDrawer isOpen={showWishlistDrawer} onClose={() => setShowWishlistDrawer(false)} />
    </>
  );
};

export default Navbar;
