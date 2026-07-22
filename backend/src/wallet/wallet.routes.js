const express = require('express');
const router = express.Router();
const WalletController = require('./wallet.controller');
const { protect } = require('../middleware/authMiddleware');

router.use(protect);

router.get('/balance', WalletController.getBalance);
router.get('/transactions', WalletController.getTransactions);
router.get('/history', WalletController.getTransactions); // Alias for history
router.get('/summary', WalletController.getSummary);

module.exports = router;
