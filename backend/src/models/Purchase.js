const mongoose = require('mongoose');

const purchaseSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      index: true
    },
    type: {
      type: String,
      enum: ['coin_pack', 'vip'],
      required: true
    },
    packageName: {
      type: String,
      required: true
    },
    amount: {
      type: Number,
      required: true,
      min: 0
    },
    coinsAdded: {
      type: Number,
      default: 0
    },
    paymentId: {
      type: String,
      required: true
    },
    paymentGateway: {
      type: String,
      default: 'mock'
    },
    status: {
      type: String,
      enum: ['completed', 'pending', 'failed'],
      default: 'completed'
    }
  },
  {
    timestamps: true
  }
);

const Purchase = mongoose.model('Purchase', purchaseSchema);
module.exports = Purchase;
