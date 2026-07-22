const mongoose = require('mongoose');

const cosmeticSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true
    },
    image: {
      type: String,
      required: true
    },
    type: {
      type: String,
      enum: ['dice_skin', 'avatar', 'board_theme'],
      default: 'avatar'
    },
    price: {
      type: Number,
      required: true,
      min: 0
    },
    active: {
      type: Boolean,
      default: true
    }
  },
  {
    timestamps: true
  }
);

const Cosmetic = mongoose.model('Cosmetic', cosmeticSchema);
module.exports = Cosmetic;
