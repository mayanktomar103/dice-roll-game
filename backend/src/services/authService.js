const User = require('../models/User');
const { generateAccessToken, generateRefreshToken } = require('../utils/generateToken');
const jwt = require('jsonwebtoken');
const { Op } = require('sequelize');

class AuthService {
  static async registerUser({ username, email, password }) {
    const existingUser = await User.findOne({
      [Op.or]: [{ email }, { username }]
    });

    if (existingUser) {
      if (existingUser.email === email) {
        throw new Error('Email is already registered');
      }
      throw new Error('Username is already taken');
    }

    const user = await User.create({
      username,
      email,
      password,
      coins: 1000,
      level: 1,
      xp: 0
    });

    const accessToken = generateAccessToken(user._id);
    const refreshToken = generateRefreshToken(user._id);

    user.refreshToken = refreshToken;
    await user.save();

    return {
      user: {
        _id: user._id,
        username: user.username,
        email: user.email,
        coins: user.coins,
        level: user.level,
        xp: user.xp,
        vip: user.vip,
        avatar: user.avatar,
        role: user.role,
        createdAt: user.createdAt
      },
      accessToken,
      refreshToken
    };
  }

  static async loginUser({ email, password }) {
    const user = await User.scope('withPassword').findOne({ where: { email } });
    if (!user) {
      throw new Error('Invalid email or password');
    }

    const isMatch = await user.comparePassword(password);
    if (!isMatch) {
      throw new Error('Invalid email or password');
    }

    const accessToken = generateAccessToken(user._id);
    const refreshToken = generateRefreshToken(user._id);

    user.refreshToken = refreshToken;
    await user.save();

    return {
      user: {
        _id: user._id,
        username: user.username,
        email: user.email,
        coins: user.coins,
        level: user.level,
        xp: user.xp,
        vip: user.vip,
        avatar: user.avatar,
        role: user.role,
        dailyRewardClaimedAt: user.dailyRewardClaimedAt,
        totalGames: user.totalGames,
        totalWins: user.totalWins,
        totalLosses: user.totalLosses,
        createdAt: user.createdAt
      },
      accessToken,
      refreshToken
    };
  }

  static async refreshAccessToken(token) {
    if (!token) {
      throw new Error('Refresh token is required');
    }

    const decoded = jwt.verify(
      token,
      process.env.JWT_REFRESH_SECRET || 'supersecret_diceroll_refresh_key_2026'
    );

    const user = await User.scope('withRefreshToken').findByPk(decoded.id);
    if (!user || user.refreshToken !== token) {
      throw new Error('Invalid or expired refresh token');
    }

    const accessToken = generateAccessToken(user._id);
    const newRefreshToken = generateRefreshToken(user._id);

    user.refreshToken = newRefreshToken;
    await user.save();

    return {
      accessToken,
      refreshToken: newRefreshToken
    };
  }

  static async logoutUser(userId) {
    await User.findByIdAndUpdate(userId, { refreshToken: null });
    return true;
  }

  static async updateUserProfile(userId, updates) {
    const allowed = ['username', 'avatar'];
    const filteredUpdates = {};

    for (const key of allowed) {
      if (updates[key] !== undefined) {
        filteredUpdates[key] = updates[key];
      }
    }

    if (filteredUpdates.username) {
      const existing = await User.findOne({
        where: {
          username: filteredUpdates.username,
          id: { [Op.ne]: userId }
        }
      });
      if (existing) {
        throw new Error('Username is already taken');
      }
    }

    const user = await User.findByIdAndUpdate(userId, filteredUpdates, {
      new: true,
      runValidators: true
    });

    return user;
  }
}

module.exports = AuthService;
