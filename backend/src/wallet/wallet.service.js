const User = require('../models/User');
const Transaction = require('./transaction.model');
const Wallet = require('./wallet.model');

class WalletService {
  static async getBalance(userId) {
    const user = await User.findById(userId);
    if (!user) {
      throw new Error('User not found');
    }

    return {
      coins: user.coins,
      walletBalance: user.walletBalance,
      lockedBalance: user.lockedBalance,
      totalDeposits: user.totalDeposits,
      totalWinnings: user.totalWinnings
    };
  }

  static async getTransactions(userId, { page = 1, limit = 10, type }) {
    const query = { user: userId };
    if (type) {
      query.type = type;
    }

    const pageNum = parseInt(page);
    const limitNum = parseInt(limit);
    const skip = (pageNum - 1) * limitNum;

    const [transactions, total] = await Promise.all([
      Transaction.find(query)
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limitNum),
      Transaction.countDocuments(query)
    ]);

    return {
      transactions,
      pagination: {
        total,
        page: pageNum,
        limit: limitNum,
        totalPages: Math.ceil(total / limitNum) || 1
      }
    };
  }

  static async getSummary(userId) {
    const user = await User.findById(userId);
    if (!user) {
      throw new Error('User not found');
    }

    const totalTransactions = await Transaction.countDocuments({ user: userId });

    return {
      user: {
        username: user.username,
        coins: user.coins,
        walletBalance: user.walletBalance,
        vip: user.vip
      },
      summary: {
        totalDeposits: user.totalDeposits,
        totalWithdrawals: user.totalWithdrawals,
        totalWinnings: user.totalWinnings,
        totalLosses: user.totalLosses,
        lastDeposit: user.lastDeposit,
        totalTransactions
      }
    };
  }
}

module.exports = WalletService;
