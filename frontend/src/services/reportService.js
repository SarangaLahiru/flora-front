import api from './api';

export const reportService = {
  // Get sales report
  getSalesReport: async (startDate, endDate) => {
    const response = await api.get('/reports/sales', {
      params: { startDate, endDate }
    });
    return response.data;
  },

  // Get inventory report
  getInventoryReport: async () => {
    const response = await api.get('/reports/inventory');
    return response.data;
  },

  // Get delivery report
  getDeliveryReport: async (date) => {
    const response = await api.get('/reports/deliveries', {
      params: { date }
    });
    return response.data;
  },

  // Get dashboard summary
  getDashboardSummary: async () => {
    const response = await api.get('/reports/dashboard');
    return response.data;
  },

  getAllOrders: async () => {
    const response = await api.get('/orders/all');
    return response.data;
  },

  // Period-based reports
  getSalesReportByPeriod: async (period) => {
    const response = await api.get(`/reports/sales/period/${period}`);
    return response.data;
  },

  getDeliveryReportByPeriod: async (period) => {
    const response = await api.get(`/reports/deliveries/period/${period}`);
    return response.data;
  },

  getDashboardSummaryByPeriod: async (period) => {
    const response = await api.get(`/reports/dashboard/${period}`);
    return response.data;
  }
};
