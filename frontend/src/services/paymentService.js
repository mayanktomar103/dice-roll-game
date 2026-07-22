import axiosInstance from '../api/axiosInstance';

export const paymentService = {
  async createOrder(data) {
    const res = await axiosInstance.post('/payment/create-order', data);
    return res.data;
  },

  async verifyPayment(data) {
    const res = await axiosInstance.post('/payment/verify', data);
    return res.data;
  },

  async getHistory(params) {
    const res = await axiosInstance.get('/payment/history', { params });
    return res.data;
  },

  async getPackages() {
    const res = await axiosInstance.get('/payment/packages');
    return res.data;
  },

  async buyVipOrder() {
    const res = await axiosInstance.post('/payment/buy-vip');
    return res.data;
  },

  async buyCoinPackOrder(data) {
    const res = await axiosInstance.post('/payment/buy-coin-pack', data);
    return res.data;
  }
};
