import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import { LuX, LuPlus, LuMinus, LuShoppingBag, LuLogIn } from 'react-icons/lu';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';

const CartDrawer = ({ isOpen, onClose }) => {
  const { cart, updateCartItem, removeFromCart, getCartTotal } = useCart();
  const { isAuthenticated } = useAuth();
  const navigate = useNavigate();

  const handleCheckout = () => {
    onClose();
    navigate('/checkout');
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
                  <LuShoppingBag className="text-xl text-white" />
                </div>
                <h2 className="text-2xl font-bold text-charcoal-900">Your Cart</h2>
                {cart?.items?.length > 0 && (
                  <span className="px-2.5 py-1 bg-primary-100 text-primary-700 text-xs font-bold rounded-full">
                    {cart.items.length}
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

            {/* Cart Items */}
            <div className="flex-1 overflow-y-auto p-6">
              {!isAuthenticated() ? (
                <div className="flex flex-col items-center justify-center h-full text-center">
                  <div className="w-24 h-24 bg-gradient-to-br from-primary-100 to-iris-100 rounded-full flex items-center justify-center mb-4">
                    <LuLogIn className="text-4xl text-primary-600" />
                  </div>
                  <h3 className="text-xl font-semibold text-charcoal-900 mb-2">Login Required</h3>
                  <p className="text-charcoal-500 mb-6 max-w-sm">
                    Please login to view your cart and start shopping for beautiful flowers!
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
              ) : !cart?.items || cart.items.length === 0 ? (
                <div className="flex flex-col items-center justify-center h-full text-center">
                  <div className="w-24 h-24 bg-charcoal-50 rounded-full flex items-center justify-center mb-4">
                    <LuShoppingBag className="text-4xl text-charcoal-300" />
                  </div>
                  <h3 className="text-xl font-semibold text-charcoal-900 mb-2">Your cart is empty</h3>
                  <p className="text-charcoal-500 mb-6">Add some beautiful flowers to your cart!</p>
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
                    {cart.items.map((item, index) => (
                      <motion.div
                        key={item.id}
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
                        className="flex gap-4 p-4 bg-blush-50/50 rounded-xl border border-charcoal-100"
                      >
                        <div className="w-20 h-20 bg-charcoal-100 rounded-lg overflow-hidden flex-shrink-0">
                          {item.productImage ? (
                            <img
                              src={item.productImage}
                              alt={item.productName}
                              className="w-full h-full object-cover"
                            />
                          ) : (
                            <div className="w-full h-full flex items-center justify-center text-charcoal-400">
                              <LuShoppingBag className="text-2xl" />
                            </div>
                          )}
                        </div>

                        <div className="flex-1 min-w-0">
                          <h3 className="font-semibold text-charcoal-900 mb-1 truncate">
                            {item.productName}
                          </h3>
                          <p className="text-sm text-charcoal-600 mb-2">
                            ${item.productPrice?.toFixed(2) || '0.00'} each
                          </p>

                          <div className="flex items-center justify-between">
                            <div className="flex items-center gap-2 border border-charcoal-200 rounded-lg">
                              <button
                                onClick={() => updateCartItem(item.id, Math.max(1, item.quantity - 1))}
                                className="p-1.5 hover:bg-charcoal-50 transition-colors"
                                disabled={item.quantity <= 1}
                              >
                                <LuMinus className="text-sm text-charcoal-600" />
                              </button>
                              <span className="px-3 py-1 text-sm font-medium text-charcoal-900 min-w-[2rem] text-center">
                                {item.quantity}
                              </span>
                              <button
                                onClick={() => updateCartItem(item.id, item.quantity + 1)}
                                className="p-1.5 hover:bg-charcoal-50 transition-colors"
                              >
                                <LuPlus className="text-sm text-charcoal-600" />
                              </button>
                            </div>

                            <div className="flex items-center gap-3">
                              <span className="font-bold text-iris-600">
                                ${item.subtotal?.toFixed(2) || '0.00'}
                              </span>
                              <button
                                onClick={() => removeFromCart(item.id)}
                                className="p-1.5 hover:bg-red-50 text-red-500 rounded transition-colors"
                              >
                                <LuX className="text-sm" />
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

            {/* Footer */}
            {cart?.items && cart.items.length > 0 && (
              <div className="border-t border-charcoal-100 p-6 space-y-4">
                <div className="flex justify-between items-center text-lg">
                  <span className="font-semibold text-charcoal-700">Total:</span>
                  <span className="text-2xl font-bold text-iris-600">
                    ${getCartTotal().toFixed(2)}
                  </span>
                </div>
                <button
                  onClick={handleCheckout}
                  className="btn-primary w-full py-3 text-lg font-semibold"
                >
                  Proceed to Checkout
                </button>
              </div>
            )}
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};

export default CartDrawer;

