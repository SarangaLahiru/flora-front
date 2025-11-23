import { useWishlist } from '../context/WishlistContext';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import { Link } from 'react-router-dom';
import { LuX, LuHeart, LuShoppingBag, LuLogIn } from 'react-icons/lu';
import { toast } from 'react-toastify';
import { motion, AnimatePresence } from 'framer-motion';

const WishlistDrawer = ({ isOpen, onClose }) => {
  const { wishlist, removeFromWishlist, loading } = useWishlist();
  const { addToCart } = useCart();
  const { isAuthenticated } = useAuth();
  const navigate = useNavigate();

  const handleAddToCart = async (product) => {
    if (!isAuthenticated()) {
      toast.error('Please login to add items to cart');
      onClose();
      navigate('/login');
      return;
    }
    
    try {
      await addToCart(product.id, 1);
      await removeFromWishlist(product.id);
      toast.success('Added to cart and removed from wishlist!');
    } catch (error) {
      console.error('Error adding to cart:', error);
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="fixed inset-0 bg-charcoal-900/50 backdrop-blur-sm z-40"
            onClick={onClose}
          />
          
          {/* Drawer */}
          <motion.div
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'spring', damping: 30, stiffness: 300 }}
            className="fixed right-0 top-0 h-full w-full max-w-md bg-white shadow-2xl z-50 flex flex-col"
          >
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-charcoal-100">
          <div className="flex items-center gap-3">
            <div className="w-11 h-11 bg-primary-500 rounded-xl flex items-center justify-center shadow-md">
              <LuHeart className="text-xl text-white" />
            </div>
            <h2 className="text-2xl font-bold text-charcoal-900">Wishlist</h2>
            {wishlist.length > 0 && (
              <span className="px-2.5 py-1 bg-blush-100 text-blush-700 text-xs font-bold rounded-full">
                {wishlist.length}
              </span>
            )}
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-charcoal-50 rounded-lg transition-colors"
          >
            <LuX className="text-xl text-charcoal-600" />
          </button>
        </div>

        {/* Wishlist Items */}
        <div className="flex-1 overflow-y-auto p-6">
          {!isAuthenticated() ? (
            <div className="flex flex-col items-center justify-center h-full text-center">
              <div className="w-24 h-24 bg-gradient-to-br from-blush-100 to-primary-100 rounded-full flex items-center justify-center mb-4">
                <LuLogIn className="text-4xl text-blush-600" />
              </div>
              <h3 className="text-xl font-semibold text-charcoal-900 mb-2">Login Required</h3>
              <p className="text-charcoal-500 mb-6 max-w-sm">
                Please login to save your favorite flowers and create your wishlist!
              </p>
              <div className="flex gap-3">
                <Link
                  to="/login"
                  onClick={onClose}
                  className="btn-primary"
                >
                  Login
                </Link>
                <Link
                  to="/register"
                  onClick={onClose}
                  className="btn-outline"
                >
                  Register
                </Link>
              </div>
            </div>
          ) : loading ? (
            <div className="flex items-center justify-center h-full">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-iris-600"></div>
            </div>
          ) : wishlist.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-full text-center">
              <div className="w-24 h-24 bg-charcoal-50 rounded-full flex items-center justify-center mb-4">
                <LuHeart className="text-4xl text-charcoal-300" />
              </div>
              <h3 className="text-xl font-semibold text-charcoal-900 mb-2">Your wishlist is empty</h3>
              <p className="text-charcoal-500 mb-6">Save your favorite flowers here!</p>
              <Link
                to="/products"
                onClick={onClose}
                className="btn-primary"
              >
                Browse Products
              </Link>
            </div>
          ) : (
            <motion.div layout className="space-y-4">
              <AnimatePresence mode="popLayout">
              {wishlist.map((product, index) => (
                <motion.div
                  key={product.id}
                  layout
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20, height: 0 }}
                  transition={{ 
                    opacity: { duration: 0.2 },
                    x: { duration: 0.2 },
                    height: { duration: 0.2 },
                    layout: { duration: 0.3 }
                  }}
                  className="group relative p-4 bg-blush-50/50 rounded-xl border border-charcoal-100 hover:border-iris-200 transition-colors"
                >
                  <div className="flex gap-4">
                    <Link
                      to={`/products/${product.id}`}
                      onClick={onClose}
                      className="w-20 h-20 bg-charcoal-100 rounded-lg overflow-hidden flex-shrink-0"
                    >
                      {product.imageUrl ? (
                        <img
                          src={product.imageUrl}
                          alt={product.name}
                          className="w-full h-full object-cover group-hover:scale-110 transition-transform"
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center text-charcoal-400">
                          <LuShoppingBag className="text-2xl" />
                        </div>
                      )}
                    </Link>
                    
                    <div className="flex-1 min-w-0">
                      <Link
                        to={`/products/${product.id}`}
                        onClick={onClose}
                      >
                        <h3 className="font-semibold text-charcoal-900 mb-1 truncate hover:text-iris-600 transition-colors">
                          {product.name}
                        </h3>
                      </Link>
                      <p className="text-sm text-charcoal-600 mb-2 line-clamp-2">
                        {product.description}
                      </p>
                      <p className="text-lg font-bold text-iris-600 mb-3">
                        ${product.price?.toFixed(2) || '0.00'}
                      </p>
                      
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => handleAddToCart(product)}
                          className="btn-primary text-sm px-4 py-2 flex items-center gap-2"
                        >
                          <LuShoppingBag className="text-base" />
                          Add to Cart
                        </button>
                        <button
                          onClick={() => removeFromWishlist(product.id)}
                          className="p-2 hover:bg-red-50 text-red-500 rounded-lg transition-colors border border-red-200"
                          title="Remove from wishlist"
                        >
                          <LuX className="text-base" />
                        </button>
                      </div>
                    </div>
                  </div>
                </motion.div>
              ))}
              </AnimatePresence>
            </motion.div>
          )}
        </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};

export default WishlistDrawer;