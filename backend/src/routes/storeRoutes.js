const express = require('express');
const router = express.Router();
const StoreController = require('../controllers/storeController');
const { protect } = require('../middleware/authMiddleware');

router.get('/coin-packs', StoreController.getCoinPacks);
router.post('/purchase', protect, StoreController.purchase);

module.exports = router;
