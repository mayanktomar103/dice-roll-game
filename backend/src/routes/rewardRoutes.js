const express = require('express');
const router = express.Router();
const RewardController = require('../controllers/rewardController');
const { protect } = require('../middleware/authMiddleware');

router.use(protect);

router.post('/daily', RewardController.claimDaily);

module.exports = router;
