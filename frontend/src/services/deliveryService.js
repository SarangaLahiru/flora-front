import api from './api';

export const deliveryService = {
  // Create new delivery
  createDelivery: async (deliveryData) => {
    const response = await api.post('/deliveries', deliveryData);
    return response.data;
  },

  // Track delivery by tracking number (public)
  trackDelivery: async (trackingNumber) => {
    const response = await api.get(`/deliveries/tracking/${trackingNumber}`);
    return response.data;
  },

  // Track delivery by order number (public)
  trackByOrderNumber: async (orderNumber) => {
    const response = await api.get(`/deliveries/order-number/${orderNumber}`);
    return response.data;
  },

  // Get deliveries by order
  getDeliveriesByOrder: async (orderId) => {
    const response = await api.get(`/deliveries/order/${orderId}`);
    return response.data;
  },

  // Get deliveries by event
  getDeliveriesByEvent: async (eventId) => {
    const response = await api.get(`/deliveries/event/${eventId}`);
    return response.data;
  },

  // Get all deliveries (admin)
  getAllDeliveries: async () => {
    const response = await api.get('/deliveries');
    return response.data;
  },

  // Get deliveries by date (admin)
  getDeliveriesByDate: async (date) => {
    const response = await api.get(`/deliveries/date/${date}`);
    return response.data;
  },

  // Get deliveries by status (admin)
  getDeliveriesByStatus: async (status) => {
    const response = await api.get(`/deliveries/status/${status}`);
    return response.data;
  },

  // Update delivery status (admin)
  updateDeliveryStatus: async (trackingNumber, status) => {
    const response = await api.put(`/deliveries/tracking/${trackingNumber}/status`, null, {
      params: { status }
    });
    return response.data;
  },

  // Assign driver to delivery (admin)
  assignDriver: async (trackingNumber, driverName, driverPhone, vehicleNumber) => {
    const response = await api.put(`/deliveries/tracking/${trackingNumber}/assign-driver`, null, {
      params: { driverName, driverPhone, vehicleNumber }
    });
    return response.data;
  }
};
