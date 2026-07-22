const User = require('../models/User');
const Purchase = require('../models/Purchase');
const GameHistory = require('../models/GameHistory');

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
      User.countDocuments(),
      User.countDocuments({ vip: true }),
      User.find().sort({ createdAt: -1 }).limit(5).select('-password'),
      Purchase.aggregate([
        { $match: { status: 'completed' } },
        { $group: { _id: null, totalRevenue: { $sum: '$amount' } } }
      ]),
      Purchase.countDocuments({ status: 'completed' }),
      GameHistory.aggregate([
        {
          $group: {
            _id: null,
            totalGamesPlayed: { $sum: 1 },
            totalBetCoins: { $sum: '$bet' },
            totalPayoutCoins: { $sum: '$reward' },
            avgBet: { $avg: '$bet' }
          }
        }
      ])
    ]);

    const revenue = revenueResult.length > 0 ? revenueResult[0].totalRevenue : 0;
    const gameStats = gameStatsResult.length > 0
      ? gameStatsResult[0]
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
    const query = {};
    if (search) {
      query.$or = [
        { username: { $regex: search, $options: 'i' } },
        { email: { $regex: search, $options: 'i' } }
      ];
    }

    const pageNum = parseInt(page);
    const limitNum = parseInt(limit);
    const skip = (pageNum - 1) * limitNum;

    const [users, total] = await Promise.all([
      User.find(query).select('-password').sort({ createdAt: -1 }).skip(skip).limit(limitNum),
      User.countDocuments(query)
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
      Purchase.find()
        .populate('user', 'username email')
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limitNum),
      Purchase.countDocuments()
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
