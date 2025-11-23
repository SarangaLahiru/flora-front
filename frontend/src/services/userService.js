import api from './api';

export const userService = {
    getAllUsers: async () => {
        const response = await api.get('/admin/users');
        return response.data;
    },

    getUserById: async (id) => {
        const response = await api.get(`/admin/users/${id}`);
        return response.data;
    },

    updateUser: async (id, userData) => {
        const response = await api.put(`/admin/users/${id}`, userData);
        return response.data;
    },

    deleteUser: async (id) => {
        const response = await api.delete(`/admin/users/${id}`);
        return response.data;
    },

    toggleUserStatus: async (id) => {
        const response = await api.put(`/admin/users/${id}/toggle-status`);
        return response.data;
    },

    getUsersWithCounts: async () => {
        const response = await api.get('/admin/users/with-counts');
        return response.data;
    }
};
