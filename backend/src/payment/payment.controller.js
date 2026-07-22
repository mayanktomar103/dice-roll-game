const PaymentService = require('./payment.service');
const ApiResponse = require('../utils/apiResponse');

class PaymentController {
  static async createOrder(req, res, next) {
    try {
      const { type, amount, packageName, coinsAdded } = req.body;
      const orderData = await PaymentService.createOrder({
        userId: req.user._id,
        type,
        amount,
        packageName,
        coinsAdded
      });

      return ApiResponse.success(res, 'Razorpay order created', orderData, 201);
    } catch (error) {
      return ApiResponse.error(res, error.message, 400);
    }
  }

  static async verify(req, res, next) {
    try {
      const { razorpay_order_id, razorpay_payment_id, razorpay_signature } = req.body;
      const result = await PaymentService.verifyPayment({
        userId: req.user._id,
        razorpay_order_id,
        razorpay_payment_id,
        razorpay_signature
      });

      return ApiResponse.success(res, 'Payment verified & completed successfully!', result, 200);
    } catch (error) {
      return ApiResponse.error(res, error.message, 400);
    }
  }

  static async getHistory(req, res, next) {
    try {
      const { page, limit } = req.query;
      const data = await PaymentService.getPaymentHistory(req.user._id, { page, limit });
      return ApiResponse.success(res, 'Payment history fetched', data, 200);
    } catch (error) {
      next(error);
    }
  }

  static async getPackages(req, res, next) {
    try {
      const packages = await PaymentService.getPackages();
      return ApiResponse.success(res, 'Payment packages fetched', { packages }, 200);
    } catch (error) {
      next(error);
    }
  }

  static async buyVip(req, res, next) {
    try {
      const orderData = await PaymentService.createOrder({
        userId: req.user._id,
        type: 'vip',
        amount: 999,
        packageName: 'Lifetime VIP Membership',
        coinsAdded: 0
      });
      return ApiResponse.success(res, 'Razorpay VIP order created', orderData, 201);
    } catch (error) {
      return ApiResponse.error(res, error.message, 400);
    }
  }

  static async buyCoinPack(req, res, next) {
    try {
      const { amount, coins, packageName } = req.body;
      const orderData = await PaymentService.createOrder({
        userId: req.user._id,
        type: 'coin_pack',
        amount,
        packageName,
        coinsAdded: coins
      });
      return ApiResponse.success(res, 'Razorpay Coin Pack order created', orderData, 201);
    } catch (error) {
      return ApiResponse.error(res, error.message, 400);
    }
  }
}

module.exports = PaymentController;
