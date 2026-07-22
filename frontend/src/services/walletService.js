import axiosInstance from '../api/axiosInstance';

export const walletService = {
  async getBalance() {
    const res = await axiosInstance.get('/wallet/balance');
    return res.data;
  },

  async getTransactions(params) {
    const res = await axiosInstance.get('/wallet/transactions', { params });
    return res.data;
  },

  async getSummary() {
    const res = await axiosInstance.get('/wallet/summary');
    return res.data;
  }
};
