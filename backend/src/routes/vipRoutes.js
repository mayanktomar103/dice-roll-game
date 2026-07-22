const express = require('express');
const router = express.Router();
const VipController = require('../controllers/vipController');
const { protect } = require('../middleware/authMiddleware');

router.use(protect);

router.get('/status', VipController.getStatus);
router.post('/purchase', VipController.purchase);

module.exports = router;
