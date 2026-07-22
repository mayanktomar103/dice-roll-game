import axiosInstance from '../api/axiosInstance';

export const vipService = {
  async getVipStatus() {
    const res = await axiosInstance.get('/vip/status');
    return res.data;
  },

  async purchaseVip() {
    const res = await axiosInstance.post('/vip/purchase');
    return res.data;
  }
};
