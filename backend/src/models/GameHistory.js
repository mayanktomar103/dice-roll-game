const mongoose = require('mongoose');

const gameHistorySchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      index: true
    },
    bet: {
      type: Number,
      required: true,
      min: 1
    },
    dice: {
      type: Number,
      required: true,
      min: 1,
      max: 6
    },
    reward: {
      type: Number,
      required: true,
      min: 0
    },
    balanceBefore: {
      type: Number,
      required: true
    },
    balanceAfter: {
      type: Number,
      required: true
    },
    result: {
      type: String,
      enum: ['win', 'lose', 'return'],
      required: true
    },
    xpEarned: {
      type: Number,
      default: 10
    }
  },
  {
    timestamps: true
  }
);

const GameHistory = mongoose.model('GameHistory', gameHistorySchema);
module.exports = GameHistory;
