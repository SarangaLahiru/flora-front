import api from './api';

export const authService = {
  login: async (credentials) => {
    const response = await api.post('/auth/login', credentials);
    if (response.data.token) {
      localStorage.setItem('token', response.data.token);
      localStorage.setItem('user', JSON.stringify(response.data));
    }
    return response.data;
  },

  register: async (userData) => {
    const response = await api.post('/auth/register', userData);
    return response.data;
  },

  googleLogin: async (credential) => {
    const response = await api.post('/auth/google', { idToken: credential });
    if (response.data.token) {
      localStorage.setItem('token', response.data.token);
      localStorage.setItem('user', JSON.stringify(response.data));
    }
    return response.data;
  },

  logout: () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
  },

  getCurrentUser: () => {
    const user = localStorage.getItem('user');
    return user ? JSON.parse(user) : null;
  },

  isAuthenticated: () => {
    return !!localStorage.getItem('token');
  },

  hasRole: (role) => {
    const user = authService.getCurrentUser();
    return user?.roles?.includes(role);
  }
};
