const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const userSchema = new mongoose.Schema(
  {
    username: {
      type: String,
      required: [true, 'Username is required'],
      unique: true,
      trim: true,
      minlength: [3, 'Username must be at least 3 characters'],
      maxlength: [20, 'Username cannot exceed 20 characters']
    },
    email: {
      type: String,
      required: [true, 'Email is required'],
      unique: true,
      trim: true,
      lowercase: true
    },
    password: {
      type: String,
      required: [true, 'Password is required'],
      minlength: [6, 'Password must be at least 6 characters'],
      select: false
    },
    coins: {
      type: Number,
      default: 1000,
      min: [0, 'Coins cannot be negative']
    },
    level: {
      type: Number,
      default: 1,
      min: 1
    },
    xp: {
      type: Number,
      default: 0,
      min: 0
    },
    vip: {
      type: Boolean,
      default: false
    },
    vipPurchasedAt: {
      type: Date,
      default: null
    },
    dailyRewardClaimedAt: {
      type: Date,
      default: null
    },
    avatar: {
      type: String,
      default: 'avatar_default'
    },
    totalGames: {
      type: Number,
      default: 0,
      min: 0
    },
    totalWins: {
      type: Number,
      default: 0,
      min: 0
    },
    totalLosses: {
      type: Number,
      default: 0,
      min: 0
    },

    // Wallet System Extensions
    walletBalance: {
      type: Number,
      default: 0,
      min: 0
    },
    lockedBalance: {
      type: Number,
      default: 0,
      min: 0
    },
    totalDeposits: {
      type: Number,
      default: 0,
      min: 0
    },
    totalWithdrawals: {
      type: Number,
      default: 0,
      min: 0
    },
    totalWinnings: {
      type: Number,
      default: 0,
      min: 0
    },
    lastDeposit: {
      type: Date,
      default: null
    },
    lastWithdrawal: {
      type: Date,
      default: null
    },

    role: {
      type: String,
      enum: ['user', 'admin'],
      default: 'user'
    },
    refreshToken: {
      type: String,
      select: false
    }
  },
  {
    timestamps: true
  }
);

// Hash password before saving
userSchema.pre('save', async function (next) {
  if (!this.isModified('password')) return next();
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
  next();
});

// Instance method to compare password
userSchema.methods.comparePassword = async function (candidatePassword) {
  return await bcrypt.compare(candidatePassword, this.password);
};

const User = mongoose.model('User', userSchema);
module.exports = User;
