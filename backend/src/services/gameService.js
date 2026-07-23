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

    // Roll weighted random dice 1-6 for platform profitability
    const weights = user.totalGames < 10
      ? GAME_RULES.DICE_WEIGHTS_NEW_USER
      : GAME_RULES.DICE_WEIGHTS_REGULAR;
    const roll = Math.random() * 100;
    let dice = 1;
    let cumulative = 0;

    for (const d of [6, 5, 4, 3, 2, 1]) {
      cumulative += weights[d];
      if (roll < cumulative) {
        dice = d;
        break;
      }
    }

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
      userId,
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
        id: historyRecord.id,
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
    const where = { userId };
    if (result) {
      where.result = result;
    }

    const pageNum = parseInt(page);
    const limitNum = parseInt(limit);
    const skip = (pageNum - 1) * limitNum;

    const [history, total] = await Promise.all([
      GameHistory.findAll({
        where,
        order: [['createdAt', 'DESC']],
        offset: skip,
        limit: limitNum
      }),
      GameHistory.count({ where })
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
