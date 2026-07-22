const User = require('../models/User');
const Purchase = require('../models/Purchase');
const GAME_RULES = require('../constants/gameRules');

class VipService {
  static async getVipStatus(userId) {
    const user = await User.findById(userId);
    if (!user) {
      throw new Error('User not found');
    }

    return {
      vip: user.vip,
      vipPurchasedAt: user.vipPurchasedAt,
      benefits: [
        'VIP Badge on Profile & Dashboard',
        '2x Daily Bonus Coins (500 coins instead of 250)',
        'Unlimited Dice Game Access',
        'Exclusive Themes & Micro-animations',
        'Ad-free Gaming Experience',
        'Advanced Stats & Analytics'
      ]
    };
  }

  static async purchaseVip(userId) {
    const user = await User.findById(userId);
    if (!user) {
      throw new Error('User not found');
    }

    if (user.vip) {
      throw new Error('User is already a Lifetime VIP member!');
    }

    const mockPaymentId = `MOCK_VIP_${Date.now()}_${Math.random().toString(36).substring(2, 7).toUpperCase()}`;

    const purchase = await Purchase.create({
      user: userId,
      type: 'vip',
      packageName: 'Lifetime VIP Membership',
      amount: GAME_RULES.VIP.PRICE,
      coinsAdded: 0,
      paymentId: mockPaymentId,
      paymentGateway: 'mock',
      status: 'completed'
    });

    user.vip = true;
    user.vipPurchasedAt = new Date();
    await user.save();

    return {
      purchase,
      vip: user.vip,
      vipPurchasedAt: user.vipPurchasedAt
    };
  }
}

module.exports = VipService;
