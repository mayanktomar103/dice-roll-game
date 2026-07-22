import axiosInstance from '../api/axiosInstance';

export const gameService = {
  async play(bet) {
    const res = await axiosInstance.post('/game/play', { bet });
    return res.data;
  },

  async getHistory(params) {
    const res = await axiosInstance.get('/game/history', { params });
    return res.data;
  },

  async getStats() {
    const res = await axiosInstance.get('/game/stats');
    return res.data;
  },

  async claimDailyReward() {
    const res = await axiosInstance.post('/rewards/daily');
    return res.data;
  }
};
