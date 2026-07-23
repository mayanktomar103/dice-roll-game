const User = require('../models/User');
const Purchase = require('../models/Purchase');
const GameHistory = require('../models/GameHistory');
const { sequelize } = require('../config/db');
const { Op } = require('sequelize');

class AdminService {
  static async getDashboardStats() {
    const [
      totalUsers,
      totalVipUsers,
      recentUsers,
      revenueResult,
      totalPurchases,
      gameStatsResult
    ] = await Promise.all([
      User.count(),
      User.count({ where: { vip: true } }),
      User.findAll({
        order: [['createdAt', 'DESC']],
        limit: 5,
        attributes: { exclude: ['password'] }
      }),
      Purchase.sum('amount', { where: { status: 'completed' } }),
      Purchase.count({ where: { status: 'completed' } }),
      GameHistory.findAll({
        attributes: [
          [sequelize.fn('COUNT', sequelize.col('id')), 'totalGamesPlayed'],
          [sequelize.fn('SUM', sequelize.col('bet')), 'totalBetCoins'],
          [sequelize.fn('SUM', sequelize.col('reward')), 'totalPayoutCoins'],
          [sequelize.fn('AVG', sequelize.col('bet')), 'avgBet']
        ]
      })
    ]);

    const revenue = revenueResult || 0;
    const rawGameStats = gameStatsResult.length > 0 ? gameStatsResult[0].get() : null;
    const gameStats = rawGameStats
      ? {
          totalGamesPlayed: parseInt(rawGameStats.totalGamesPlayed || 0),
          totalBetCoins: parseInt(rawGameStats.totalBetCoins || 0),
          totalPayoutCoins: parseInt(rawGameStats.totalPayoutCoins || 0),
          avgBet: parseFloat(rawGameStats.avgBet || 0)
        }
      : { totalGamesPlayed: 0, totalBetCoins: 0, totalPayoutCoins: 0, avgBet: 0 };

    return {
      overview: {
        totalUsers,
        totalVipUsers,
        revenue,
        totalPurchases
      },
      gameStats: {
        totalGamesPlayed: gameStats.totalGamesPlayed,
        totalBetCoins: gameStats.totalBetCoins,
        totalPayoutCoins: gameStats.totalPayoutCoins,
        avgBet: Math.round(gameStats.avgBet || 0)
      },
      recentUsers
    };
  }

  static async getUsersList({ page = 1, limit = 10, search }) {
    const where = {};
    if (search) {
      where[Op.or] = [
        { username: { [Op.like]: `%${search}%` } },
        { email: { [Op.like]: `%${search}%` } }
      ];
    }

    const pageNum = parseInt(page);
    const limitNum = parseInt(limit);
    const skip = (pageNum - 1) * limitNum;

    const [users, total] = await Promise.all([
      User.findAll({
        where,
        attributes: { exclude: ['password'] },
        order: [['createdAt', 'DESC']],
        offset: skip,
        limit: limitNum
      }),
      User.count({ where })
    ]);

    return {
      users,
      pagination: {
        total,
        page: pageNum,
        limit: limitNum,
        totalPages: Math.ceil(total / limitNum) || 1
      }
    };
  }

  static async getPurchasesList({ page = 1, limit = 10 }) {
    const pageNum = parseInt(page);
    const limitNum = parseInt(limit);
    const skip = (pageNum - 1) * limitNum;

    const [purchases, total] = await Promise.all([
      Purchase.findAll({
        include: [{
          model: User,
          as: 'user',
          attributes: ['username', 'email']
        }],
        order: [['createdAt', 'DESC']],
        offset: skip,
        limit: limitNum
      }),
      Purchase.count()
    ]);

    return {
      purchases,
      pagination: {
        total,
        page: pageNum,
        limit: limitNum,
        totalPages: Math.ceil(total / limitNum) || 1
      }
    };
  }
}

module.exports = AdminService;
