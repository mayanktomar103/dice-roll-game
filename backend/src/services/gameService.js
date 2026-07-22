const User = require('../models/User');
const GameHistory = require('../models/GameHistory');
const GAME_RULES = require('../constants/gameRules');

class GameService {
  static async playGame(userId, betAmount) {
    const bet = Number(betAmount);

    if (isNaN(bet) || bet <= 0 || !Number.isInteger(bet)) {
      throw new Error('Bet must be a valid positive whole number');
    }

    const user = await User.findById(userId);
    if (!user) {
      throw new Error('User not found');
    }

    if (bet > user.coins) {
      throw new Error(`Insufficient coins balance. Current balance: ${user.coins}`);
    }

    // Roll random dice 1-6
    const dice = Math.floor(Math.random() * 6) + 1;

    let multiplier = GAME_RULES.MULTIPLIERS[dice];
    let reward = bet * multiplier;

    let result = 'lose';
    if (multiplier > 1) {
      result = 'win';
    } else if (multiplier === 1) {
      result = 'return';
    }

    const balanceBefore = user.coins;
    // Net change: subtract bet, add reward
    const netChange = reward - bet;
    const balanceAfter = balanceBefore + netChange;

    // XP calculation
    const xpEarned = result === 'win' ? GAME_RULES.XP.WIN : GAME_RULES.XP.LOSE;
    const newXp = user.xp + xpEarned;
    const newLevel = 1 + Math.floor(newXp / GAME_RULES.XP.XP_PER_LEVEL);

    // Stats updates
    const isWin = result === 'win';
    const isLose = result === 'lose';

    user.coins = balanceAfter;
    user.xp = newXp;
    user.level = newLevel;
    user.totalGames += 1;
    if (isWin) user.totalWins += 1;
    if (isLose) user.totalLosses += 1;

    await user.save();

    // Create game history record
    const historyRecord = await GameHistory.create({
      user: userId,
      bet,
      dice,
      reward,
      balanceBefore,
      balanceAfter,
      result,
      xpEarned
    });

    return {
      game: {
        id: historyRecord._id,
        bet,
        dice,
        reward,
        netChange,
        result,
        xpEarned,
        balanceBefore,
        balanceAfter
      },
      user: {
        coins: user.coins,
        level: user.level,
        xp: user.xp,
        totalGames: user.totalGames,
        totalWins: user.totalWins,
        totalLosses: user.totalLosses
      }
    };
  }

  static async getHistory(userId, { page = 1, limit = 10, result }) {
    const query = { user: userId };
    if (result) {
      query.result = result;
    }

    const pageNum = parseInt(page);
    const limitNum = parseInt(limit);
    const skip = (pageNum - 1) * limitNum;

    const [history, total] = await Promise.all([
      GameHistory.find(query)
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limitNum),
      GameHistory.countDocuments(query)
    ]);

    return {
      history,
      pagination: {
        total,
        page: pageNum,
        limit: limitNum,
        totalPages: Math.ceil(total / limitNum) || 1
      }
    };
  }

  static async getStats(userId) {
    const user = await User.findById(userId);
    if (!user) {
      throw new Error('User not found');
    }

    const winRate = user.totalGames > 0
      ? Math.round((user.totalWins / user.totalGames) * 100)
      : 0;

    return {
      totalGames: user.totalGames,
      totalWins: user.totalWins,
      totalLosses: user.totalLosses,
      winRate,
      level: user.level,
      xp: user.xp,
      coins: user.coins,
      vip: user.vip
    };
  }
}

module.exports = GameService;
