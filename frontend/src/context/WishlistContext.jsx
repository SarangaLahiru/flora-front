import { createContext, useState, useContext, useEffect } from 'react';
import { wishlistService } from '../services/wishlistService';
import { useAuth } from './AuthContext';
import { toast } from 'react-toastify';

const WishlistContext = createContext();

export const useWishlist = () => {
  const context = useContext(WishlistContext);
  if (!context) {
    throw new Error('useWishlist must be used within a WishlistProvider');
  }
  return context;
};

export const WishlistProvider = ({ children }) => {
  const [wishlist, setWishlist] = useState([]);
  const [loading, setLoading] = useState(false);
  const [wishlistItems, setWishlistItems] = useState(new Set()); // Track which products are in wishlist
  const { isAuthenticated, loading: authLoading } = useAuth();

  useEffect(() => {
    // Wait for auth to finish loading
    if (authLoading) return;
    
    if (isAuthenticated()) {
      fetchWishlist();
    } else {
      setWishlist([]);
      setWishlistItems(new Set());
    }
  }, [isAuthenticated, authLoading]);

  const fetchWishlist = async () => {
    try {
      setLoading(true);
      const data = await wishlistService.getWishlist();
      setWishlist(data);
      setWishlistItems(new Set(data.map(item => item.id)));
    } catch (error) {
      // Silent error for background fetch
    } finally {
      setLoading(false);
    }
  };

  const addToWishlist = async (productId) => {
    if (!isAuthenticated()) {
      toast.error('Please login to add to wishlist');
      return false;
    }
    try {
      const response = await wishlistService.addToWishlist(productId);
      
      // Immediately update state for instant UI feedback
      setWishlistItems(prev => new Set([...prev, productId]));
      
      // Fetch full updated wishlist
      await fetchWishlist();
      toast.success('Added to wishlist');
      return true;
    } catch (error) {
      toast.error('Failed to add to wishlist');
      return false;
    }
  };

  const removeFromWishlist = async (productId) => {
    // Optimistically update UI immediately
    setWishlist(prev => prev.filter(item => item.id !== productId));
    setWishlistItems(prev => {
      const newSet = new Set(prev);
      newSet.delete(productId);
      return newSet;
    });
    
    try {
      await wishlistService.removeFromWishlist(productId);
      toast.success('Removed from wishlist');
    } catch (error) {
      toast.error('Failed to remove from wishlist');
      // Revert on error
      await fetchWishlist();
      throw error;
    }
  };

  const toggleWishlist = async (productId) => {
    if (wishlistItems.has(productId)) {
      await removeFromWishlist(productId);
    } else {
      await addToWishlist(productId);
    }
  };

  const isInWishlist = (productId) => {
    return wishlistItems.has(productId);
  };

  const value = {
    wishlist,
    loading,
    fetchWishlist,
    addToWishlist,
    removeFromWishlist,
    toggleWishlist,
    isInWishlist,
    wishlistCount: wishlist.length
  };

  return <WishlistContext.Provider value={value}>{children}</WishlistContext.Provider>;
};

