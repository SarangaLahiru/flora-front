import api from './api';

export const orderService = {
  createOrder: async (orderData) => {
    const response = await api.post('/orders', orderData);
    return response.data;
  },

  getUserOrders: async () => {
    const response = await api.get('/orders');
    return response.data;
  },

  getOrderByNumber: async (orderNumber) => {
    const response = await api.get(`/orders/number/${orderNumber}`);
    return response.data;
  },

  getOrderById: async (id) => {
    const response = await api.get(`/orders/${id}`);
    return response.data;
  },

  getAllOrders: async () => {
    const response = await api.get('/orders/all');
    return response.data;
  },

  updateOrderStatus: async (id, status) => {
    const response = await api.put(`/orders/${id}/status?status=${status}`);
    return response.data;
  }
};
