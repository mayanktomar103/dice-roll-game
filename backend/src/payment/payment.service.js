const Payment = require('./payment.model');
const User = require('../models/User');
const LedgerService = require('../wallet/ledger.service');
const RazorpayService = require('./razorpay.service');
const CoinPackage = require('../models/CoinPackage');
const GAME_RULES = require('../constants/gameRules');

class PaymentService {
  static async createOrder({ userId, type, amount, packageName = '', coinsAdded = 0 }) {
    const user = await User.findById(userId);
    if (!user) {
      throw new Error('User not found');
    }

    const receipt = `rcpt_${type}_${Date.now()}`;
    const razorpayOrder = await RazorpayService.createOrder({
      amount,
      currency: 'INR',
      receipt,
      notes: {
        userId: userId.toString(),
        type,
        packageName
      }
    });

    const payment = await Payment.create({
      user: userId,
      orderId: razorpayOrder.id,
      gateway: 'razorpay',
      type,
      packageName: packageName || (type === 'vip' ? 'Lifetime VIP Membership' : 'Coin Pack'),
      coinsAdded,
      amount,
      currency: 'INR',
      status: 'created'
    });

    return {
      orderId: razorpayOrder.id,
      amount: razorpayOrder.amount,
      currency: razorpayOrder.currency,
      keyId: process.env.RAZORPAY_KEY_ID || 'rzp_test_placeholder_key',
      paymentId: payment._id
    };
  }

  static async verifyPayment({ userId, razorpay_order_id, razorpay_payment_id, razorpay_signature }) {
    const payment = await Payment.findOne({ orderId: razorpay_order_id });
    if (!payment) {
      throw new Error('Payment order record not found');
    }

    // Idempotency check: prevent duplicate processing if already completed
    if (payment.status === 'completed') {
      const user = await User.findById(userId);
      return {
        success: true,
        message: 'Payment already processed and completed',
        payment,
        user
      };
    }

    // Verify cryptographic Razorpay signature
    const isValidSignature = RazorpayService.verifySignature({
      orderId: razorpay_order_id,
      paymentId: razorpay_payment_id,
      signature: razorpay_signature
    });

    if (!isValidSignature) {
      payment.status = 'failed';
      await payment.save();
      throw new Error('Invalid Razorpay signature. Security verification failed.');
    }

    // Update payment record
    payment.paymentId = razorpay_payment_id;
    payment.signature = razorpay_signature;
    payment.status = 'completed';
    await payment.save();

    const user = await User.findById(userId);
    const initialCoins = user.coins;

    if (payment.type === 'vip') {
      user.vip = true;
      user.vipPurchasedAt = new Date();
      user.totalDeposits += payment.amount;
      user.lastDeposit = new Date();
      await user.save();

      // Log transaction in ledger
      await LedgerService.recordTransaction({
        user: userId,
        type: 'VIP Purchase',
        amount: payment.amount,
        balanceBefore: initialCoins,
        balanceAfter: initialCoins,
        status: 'completed',
        reference: razorpay_order_id
      });
    } else if (payment.type === 'coin_pack') {
      const coinsToAdd = payment.coinsAdded || 0;
      user.coins += coinsToAdd;
      user.walletBalance += payment.amount;
      user.totalDeposits += payment.amount;
      user.lastDeposit = new Date();
      await user.save();

      // Log transaction in ledger
      await LedgerService.recordTransaction({
        user: userId,
        type: 'Coin Pack Purchase',
        amount: payment.amount,
        balanceBefore: initialCoins,
        balanceAfter: user.coins,
        status: 'completed',
        reference: razorpay_order_id
      });
    }

    return {
      payment,
      user: {
        coins: user.coins,
        vip: user.vip,
        walletBalance: user.walletBalance,
        totalDeposits: user.totalDeposits
      }
    };
  }

  static async getPaymentHistory(userId, { page = 1, limit = 10 }) {
    const pageNum = parseInt(page);
    const limitNum = parseInt(limit);
    const skip = (pageNum - 1) * limitNum;

    const [payments, total] = await Promise.all([
      Payment.find({ user: userId })
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limitNum),
      Payment.countDocuments({ user: userId })
    ]);

    return {
      payments,
      pagination: {
        total,
        page: pageNum,
        limit: limitNum,
        totalPages: Math.ceil(total / limitNum) || 1
      }
    };
  }

  static async getPackages() {
    let packs = await CoinPackage.find({ active: true }).sort({ price: 1 });
    if (packs.length === 0) {
      packs = [
        { name: 'Starter Pack', coins: 5000, price: 99, badge: 'Popular' },
        { name: 'Pro Gamer Pack', coins: 15000, price: 199, badge: 'Best Value' },
        { name: 'High Roller Pack', coins: 50000, price: 499, badge: 'Ultimate' }
      ];
    }
    return packs;
  }
}

module.exports = PaymentService;
