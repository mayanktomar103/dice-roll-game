const express = require('express');
const router = express.Router();
const GameController = require('../controllers/gameController');
const { protect } = require('../middleware/authMiddleware');
const { playGameValidation } = require('../validators/gameValidator');

router.use(protect);

router.post('/play', playGameValidation, GameController.play);
router.get('/history', GameController.getHistory);
router.get('/stats', GameController.getStats);

module.exports = router;
