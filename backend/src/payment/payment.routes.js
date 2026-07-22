const express = require('express');
const router = express.Router();
const PaymentController = require('./payment.controller');
const { protect } = require('../middleware/authMiddleware');
const { createOrderValidation, verifyPaymentValidation } = require('./payment.validation');

router.use(protect);

router.post('/create-order', createOrderValidation, PaymentController.createOrder);
router.post('/verify', verifyPaymentValidation, PaymentController.verify);
router.get('/history', PaymentController.getHistory);
router.get('/packages', PaymentController.getPackages);
router.post('/buy-vip', PaymentController.buyVip);
router.post('/buy-coin-pack', PaymentController.buyCoinPack);

module.exports = router;
