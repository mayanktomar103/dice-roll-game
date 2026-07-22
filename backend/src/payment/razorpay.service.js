const Razorpay = require('razorpay');
const crypto = require('crypto');

class RazorpayService {
  static getRazorpayInstance() {
    const key_id = process.env.RAZORPAY_KEY_ID || 'rzp_test_placeholder_key';
    const key_secret = process.env.RAZORPAY_KEY_SECRET || 'placeholder_secret';

    return new Razorpay({
      key_id,
      key_secret
    });
  }

  static async createOrder({ amount, currency = 'INR', receipt, notes = {} }) {
    try {
      const razorpay = this.getRazorpayInstance();
      const options = {
        amount: Math.round(amount * 100), // Amount in paise for INR
        currency,
        receipt,
        notes
      };

      const order = await razorpay.orders.create(options);
      return order;
    } catch (error) {
      console.error('[Razorpay Order Creation Error]', error);
      throw new Error(`Razorpay Order Creation failed: ${error.message}`);
    }
  }

  static verifySignature({ orderId, paymentId, signature }) {
    const key_secret = process.env.RAZORPAY_KEY_SECRET || 'placeholder_secret';
    const hmac = crypto.createHmac('sha256', key_secret);
    hmac.update(`${orderId}|${paymentId}`);
    const generatedSignature = hmac.digest('hex');

    return generatedSignature === signature;
  }

  static verifyWebhookSignature(body, signature, secret) {
    const webhookSecret = secret || process.env.RAZORPAY_WEBHOOK_SECRET || 'placeholder_webhook_secret';
    const hmac = crypto.createHmac('sha256', webhookSecret);
    hmac.update(typeof body === 'string' ? body : JSON.stringify(body));
    const generatedSignature = hmac.digest('hex');

    return generatedSignature === signature;
  }
}

module.exports = RazorpayService;
