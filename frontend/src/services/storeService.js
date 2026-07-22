import axiosInstance from '../api/axiosInstance';

export const storeService = {
  async getCoinPacks() {
    const res = await axiosInstance.get('/store/coin-packs');
    return res.data;
  },

  async purchaseCoinPack(data) {
    const res = await axiosInstance.post('/store/purchase', data);
    return res.data;
  }
};
