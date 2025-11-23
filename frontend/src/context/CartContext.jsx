import { createContext, useState, useContext, useEffect } from 'react';
import { cartService } from '../services/cartService';
import { useAuth } from './AuthContext';
import { toast } from 'react-toastify';

const CartContext = createContext();

export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
};

export const CartProvider = ({ children }) => {
  const [cart, setCart] = useState(null);
  const [loading, setLoading] = useState(false);
  const { isAuthenticated, loading: authLoading } = useAuth();

  useEffect(() => {
    // Wait for auth to finish loading
    if (authLoading) return;
    
    if (isAuthenticated()) {
      fetchCart();
    } else {
      // Clear cart when user logs out
      setCart(null);
    }
  }, [isAuthenticated, authLoading]);

  const fetchCart = async () => {
    try {
      setLoading(true);
      const data = await cartService.getCart();
      setCart(data);
    } catch (error) {
      console.error('Error fetching cart:', error);
    } finally {
      setLoading(false);
    }
  };

  const addToCart = async (productId, quantity = 1) => {
    try {
      const response = await cartService.addToCart(productId, quantity);
      setCart(response);
      toast.success('Added to cart');
    } catch (error) {
      toast.error('Failed to add to cart');
      throw error;
    }
  };

  const updateCartItem = async (itemId, quantity) => {
    try {
      const response = await cartService.updateCartItem(itemId, quantity);
      setCart(response);
    } catch (error) {
      toast.error('Failed to update cart');
      throw error;
    }
  };

  const removeFromCart = async (itemId) => {
    // Optimistically update UI immediately
    setCart(prevCart => {
      if (!prevCart || !prevCart.items) return prevCart;
      const filteredItems = prevCart.items.filter(item => item.id !== itemId);
      const newTotal = filteredItems.reduce((sum, item) => sum + (item.subtotal || 0), 0);
      return {
        ...prevCart,
        items: filteredItems,
        totalAmount: newTotal,
        totalItems: filteredItems.length
      };
    });
    
    try {
      const response = await cartService.removeFromCart(itemId);
      
      // Update with backend response
      const updatedCart = {
        ...response,
        items: [...(response?.items || [])],
        totalAmount: response?.totalAmount || 0,
        totalItems: response?.totalItems || 0
      };
      setCart(updatedCart);
      toast.success('Removed from cart');
    } catch (error) {
      toast.error('Failed to remove item');
      // Revert optimistic update on error
      await fetchCart();
      throw error;
    }
  };

  const clearCart = async () => {
    try {
      await cartService.clearCart();
      setCart({ items: [], totalAmount: 0, totalItems: 0 });
      toast.success('Cart cleared');
    } catch (error) {
      toast.error('Failed to clear cart');
      throw error;
    }
  };

  const getCartItemsCount = () => {
    return cart?.items?.length || 0;
  };

  const getCartTotal = () => {
    return cart?.totalAmount || 0;
  };

  const value = {
    cart,
    loading,
    fetchCart,
    addToCart,
    updateCartItem,
    removeFromCart,
    clearCart,
    getCartItemsCount,
    getCartTotal
  };

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
};
