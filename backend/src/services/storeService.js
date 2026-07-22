const CoinPackage = require('../models/CoinPackage');
const Purchase = require('../models/Purchase');
const User = require('../models/User');

class StoreService {
  static async getCoinPacks() {
    let packs = await CoinPackage.find({ active: true }).sort({ price: 1 });

    if (packs.length === 0) {
      // Return default packs if DB isn't seeded yet
      packs = [
        { _id: 'pack_1', name: 'Starter Pack', coins: 5000, price: 99, badge: 'Popular' },
        { _id: 'pack_2', name: 'Pro Gamer Pack', coins: 15000, price: 199, badge: 'Best Value' },
        { _id: 'pack_3', name: 'High Roller Pack', coins: 50000, price: 499, badge: 'Ultimate' }
      ];
    }

    return packs;
  }

  static async purchaseCoinPack(userId, { packId, coins, price, name }) {
    const user = await User.findById(userId);
    if (!user) {
      throw new Error('User not found');
    }

    let coinsToAdd = coins;
    let packName = name || 'Coin Pack';
    let packPrice = price || 99;

    if (packId && packId.length === 24) {
      const pack = await CoinPackage.findById(packId);
      if (pack) {
        coinsToAdd = pack.coins;
        packName = pack.name;
        packPrice = pack.price;
      }
    }

    if (!coinsToAdd || coinsToAdd <= 0) {
      throw new Error('Invalid coin package');
    }

    const mockPaymentId = `MOCK_PAY_${Date.now()}_${Math.random().toString(36).substring(2, 7).toUpperCase()}`;

    // Record purchase
    const purchase = await Purchase.create({
      user: userId,
      type: 'coin_pack',
      packageName: packName,
      amount: packPrice,
      coinsAdded: coinsToAdd,
      paymentId: mockPaymentId,
      paymentGateway: 'mock',
      status: 'completed'
    });

    // Update user balance
    user.coins += coinsToAdd;
    await user.save();

    return {
      purchase,
      newBalance: user.coins
    };
  }
}

module.exports = StoreService;
