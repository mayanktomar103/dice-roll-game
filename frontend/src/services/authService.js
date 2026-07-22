import axiosInstance from '../api/axiosInstance';

export const authService = {
  async register(data) {
    const res = await axiosInstance.post('/auth/register', data);
    return res.data;
  },

  async login(data) {
    const res = await axiosInstance.post('/auth/login', data);
    return res.data;
  },

  async logout() {
    const res = await axiosInstance.post('/auth/logout');
    return res.data;
  },

  async getProfile() {
    const res = await axiosInstance.get('/auth/profile');
    return res.data;
  },

  async updateProfile(data) {
    const res = await axiosInstance.put('/auth/profile', data);
    return res.data;
  }
};
