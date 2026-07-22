const express = require('express');
const router = express.Router();
const WebhookController = require('./webhook.controller');

// Razorpay webhook endpoint (Raw JSON signature verification)
router.post('/webhook', WebhookController.handleRazorpayWebhook);

module.exports = router;
