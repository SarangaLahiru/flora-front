import { useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import { FaTrash, FaMinus, FaPlus } from 'react-icons/fa';
import Loading from '../components/Loading';

const Cart = () => {
  const { cart, loading, fetchCart, updateCartItem, removeFromCart } = useCart();
  const { isAuthenticated } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (isAuthenticated()) {
      fetchCart();
    }
  }, []);

  const handleQuantityChange = async (itemId, newQuantity) => {
    try {
      await updateCartItem(itemId, newQuantity);
    } catch (error) {
      console.error('Error updating quantity:', error);
    }
  };

  const handleRemove = async (itemId) => {
    try {
      await removeFromCart(itemId);
    } catch (error) {
      console.error('Error removing item:', error);
    }
  };

  if (!isAuthenticated()) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 text-center">
        <h2 className="text-3xl font-bold mb-4">Please login to view your cart</h2>
        <Link to="/login" className="btn-primary">
          Login
        </Link>
      </div>
    );
  }

  if (loading) return <Loading />;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <h1 className="text-4xl font-bold text-gray-900 mb-8">Shopping Cart</h1>

      {cart?.items?.length > 0 ? (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Cart Items */}
          <div className="lg:col-span-2 space-y-4">
            {cart.items.map((item) => (
              <div key={item.id} className="card p-4">
                <div className="flex gap-4">
                  {/* Product Image */}
                  <div className="w-24 h-24 bg-gray-200 rounded-lg overflow-hidden flex-shrink-0">
                    {item.productImage ? (
                      <img
                        src={item.productImage}
                        alt={item.productName}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-gray-400">
                        <span className="text-3xl">📦</span>
                      </div>
                    )}
                  </div>

                  {/* Product Info */}
                  <div className="flex-1">
                    <Link
                      to={`/products/${item.productId}`}
                      className="font-semibold text-lg hover:text-primary-600 transition-colors"
                    >
                      {item.productName}
                    </Link>
                    <p className="text-primary-600 font-semibold mt-1">
                      ${item.productPrice.toFixed(2)}
                    </p>

                    {/* Quantity Controls */}
                    <div className="flex items-center space-x-3 mt-3">
                      <button
                        onClick={() => handleQuantityChange(item.id, item.quantity - 1)}
                        className="w-8 h-8 rounded-lg bg-gray-200 hover:bg-gray-300 flex items-center justify-center"
                      >
                        <FaMinus className="text-sm" />
                      </button>
                      <span className="font-semibold w-8 text-center">{item.quantity}</span>
                      <button
                        onClick={() => handleQuantityChange(item.id, item.quantity + 1)}
                        className="w-8 h-8 rounded-lg bg-gray-200 hover:bg-gray-300 flex items-center justify-center"
                      >
                        <FaPlus className="text-sm" />
                      </button>
                    </div>
                  </div>

                  {/* Subtotal and Remove */}
                  <div className="text-right">
                    <p className="font-bold text-xl text-gray-900">
                      ${item.subtotal.toFixed(2)}
                    </p>
                    <button
                      onClick={() => handleRemove(item.id)}
                      className="text-red-600 hover:text-red-700 mt-2"
                    >
                      <FaTrash />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Order Summary */}
          <div className="lg:col-span-1">
            <div className="card p-6 sticky top-20">
              <h2 className="text-2xl font-bold mb-6">Order Summary</h2>
              
              <div className="space-y-3 mb-6">
                <div className="flex justify-between text-gray-700">
                  <span>Subtotal ({cart.totalItems} items)</span>
                  <span>${cart.totalAmount.toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-gray-700">
                  <span>Shipping</span>
                  <span className="text-green-600">Free</span>
                </div>
                <div className="border-t border-gray-200 pt-3 flex justify-between text-xl font-bold">
                  <span>Total</span>
                  <span className="text-primary-600">${cart.totalAmount.toFixed(2)}</span>
                </div>
              </div>

              <Link to="/checkout" className="btn-primary w-full block text-center">
                Proceed to Checkout
              </Link>

              <Link
                to="/products"
                className="btn-outline w-full block text-center mt-3"
              >
                Continue Shopping
              </Link>
            </div>
          </div>
        </div>
      ) : (
        <div className="text-center py-16">
          <div className="text-6xl mb-4">🛒</div>
          <h2 className="text-2xl font-semibold text-gray-900 mb-4">Your cart is empty</h2>
          <p className="text-gray-600 mb-8">Start shopping to add items to your cart</p>
          <Link to="/products" className="btn-primary">
            Browse Products
          </Link>
        </div>
      )}
    </div>
  );
};

export default Cart;
