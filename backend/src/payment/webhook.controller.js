const RazorpayService = require('./razorpay.service');
const Payment = require('./payment.model');
const User = require('../models/User');
const LedgerService = require('../wallet/ledger.service');

class WebhookController {
  static async handleRazorpayWebhook(req, res) {
    try {
      const signature = req.headers['x-razorpay-signature'];
      if (!signature) {
        return res.status(400).json({ success: false, message: 'Missing Razorpay signature header' });
      }

      const isValid = RazorpayService.verifyWebhookSignature(
        req.body,
        signature,
        process.env.RAZORPAY_WEBHOOK_SECRET
      );

      if (!isValid) {
        return res.status(400).json({ success: false, message: 'Invalid webhook signature' });
      }

      const event = req.body.event;
      const payload = req.body.payload;

      console.log(`[Razorpay Webhook Event] ${event}`);

      if (event === 'payment.captured' || event === 'order.paid') {
        const paymentEntity = payload.payment.entity;
        const orderId = paymentEntity.order_id;
        const paymentId = paymentEntity.id;

        const payment = await Payment.findOne({ orderId });
        if (payment && payment.status !== 'completed') {
          payment.status = 'completed';
          payment.paymentId = paymentId;
          await payment.save();

          const user = await User.findById(payment.userId);
          if (user) {
            const initialCoins = user.coins;

            if (payment.type === 'vip') {
              user.vip = true;
              user.vipPurchasedAt = new Date();
              user.totalDeposits += payment.amount;
              await user.save();

              await LedgerService.recordTransaction({
                user: user.id,
                type: 'VIP Purchase',
                amount: payment.amount,
                balanceBefore: initialCoins,
                balanceAfter: initialCoins,
                status: 'completed',
                reference: orderId
              });
            } else if (payment.type === 'coin_pack') {
              user.coins += payment.coinsAdded || 0;
              user.walletBalance += payment.amount;
              user.totalDeposits += payment.amount;
              await user.save();

              await LedgerService.recordTransaction({
                user: user.id,
                type: 'Coin Pack Purchase',
                amount: payment.amount,
                balanceBefore: initialCoins,
                balanceAfter: user.coins,
                status: 'completed',
                reference: orderId
              });
            }
          }
        }
      } else if (event === 'payment.failed') {
        const paymentEntity = payload.payment.entity;
        const orderId = paymentEntity.order_id;

        const payment = await Payment.findOne({ orderId });
        if (payment && payment.status !== 'completed') {
          payment.status = 'failed';
          await payment.save();
        }
      }

      return res.status(200).json({ status: 'ok' });
    } catch (error) {
      console.error('[Razorpay Webhook Exception]', error);
      return res.status(500).json({ success: false, message: error.message });
    }
  }
}

module.exports = WebhookController;
