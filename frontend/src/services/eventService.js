import api from './api';

export const eventService = {
  // Create new event booking
  createEvent: async (eventData) => {
    const response = await api.post('/events', eventData);
    return response.data;
  },

  // Get user's events
  getUserEvents: async () => {
    const response = await api.get('/events');
    return response.data;
  },

  // Get event by ID
  getEventById: async (id) => {
    const response = await api.get(`/events/${id}`);
    return response.data;
  },

  // Get event by number
  getEventByNumber: async (eventNumber) => {
    const response = await api.get(`/events/number/${eventNumber}`);
    return response.data;
  },

  // Get all events (admin)
  getAllEvents: async () => {
    const response = await api.get('/events/all');
    return response.data;
  },

  // Get upcoming events (admin)
  getUpcomingEvents: async (startDate, endDate) => {
    const response = await api.get('/events/upcoming', {
      params: { startDate, endDate }
    });
    return response.data;
  },

  // Update event status (admin)
  updateEventStatus: async (id, status) => {
    const response = await api.put(`/events/${id}/status`, null, {
      params: { status }
    });
    return response.data;
  },

  // Delete event
  deleteEvent: async (id) => {
    const response = await api.delete(`/events/${id}`);
    return response.data;
  },

  // Admin: Approve event
  approveEvent: async (id, adminNotes) => {
    const response = await api.post(`/events/${id}/approve`, { adminNotes });
    return response.data;
  },

  // Admin: Reject event
  rejectEvent: async (id, rejectionReason, adminNotes) => {
    const response = await api.post(`/events/${id}/reject`, { rejectionReason, adminNotes });
    return response.data;
  },

  // Admin: Get pending events
  getPendingEvents: async () => {
    const response = await api.get('/events/pending');
    return response.data;
  },

  // Admin: Get events by status
  getEventsByStatus: async (status) => {
    const response = await api.get(`/events/status/${status}`);
    return response.data;
  }
};
