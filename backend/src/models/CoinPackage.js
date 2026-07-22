const mongoose = require('mongoose');

const coinPackageSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true
    },
    coins: {
      type: Number,
      required: true,
      min: 1
    },
    price: {
      type: Number,
      required: true,
      min: 0
    },
    badge: {
      type: String,
      default: ''
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

const CoinPackage = mongoose.model('CoinPackage', coinPackageSchema);
module.exports = CoinPackage;
