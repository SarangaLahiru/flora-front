import { createContext, useState, useContext, useEffect } from 'react';
import { authService } from '../services/authService';

const AuthContext = createContext();

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const currentUser = authService.getCurrentUser();
    setUser(currentUser);
    setLoading(false);
  }, []);

  const login = async (credentials) => {
    const userData = await authService.login(credentials);
    setUser(userData);
    return userData;
  };

  const register = async (userData) => {
    return await authService.register(userData);
  };

  const googleLogin = async (credential) => {
    const userData = await authService.googleLogin(credential);
    setUser(userData);
    return userData;
  };

  const logout = () => {
    authService.logout();
    setUser(null);
    // Clear cart and wishlist from context will happen via useEffect in those contexts
    window.location.reload(); // Force reload to clear all context data
  };

  const isAuthenticated = () => {
    return !!user;
  };

  const hasRole = (role) => {
    return user?.roles?.includes(role);
  };

  const value = {
    user,
    login,
    register,
    googleLogin,
    logout,
    logout,
    isAuthenticated,
    hasRole,
    loading
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
