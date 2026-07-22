const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');
const cookieParser = require('cookie-parser');
const errorHandler = require('./middleware/errorHandler');
const { apiLimiter } = require('./middleware/rateLimiter');

// Routes
const authRoutes = require('./routes/authRoutes');
const gameRoutes = require('./routes/gameRoutes');
const rewardRoutes = require('./routes/rewardRoutes');
const storeRoutes = require('./routes/storeRoutes');
const vipRoutes = require('./routes/vipRoutes');
const adminRoutes = require('./routes/adminRoutes');

// Payment & Wallet Routes
const paymentRoutes = require('./payment/payment.routes');
const webhookRoutes = require('./payment/webhook.routes');
const walletRoutes = require('./wallet/wallet.routes');

const app = express();

// Middleware
app.use(helmet());
app.use(
  cors({
    origin: process.env.CLIENT_URL || 'http://localhost:5173',
    credentials: true
  })
);
app.use(morgan('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

// Rate Limiter
app.use('/api', apiLimiter);

// Health Check
app.get('/api/health', (req, res) => {
  res.status(200).json({ status: 'ok', message: 'DiceRoll API Server running smoothly' });
});

// API Routes
app.use('/api/auth', authRoutes);
app.use('/api/game', gameRoutes);
app.use('/api/rewards', rewardRoutes);
app.use('/api/store', storeRoutes);
app.use('/api/vip', vipRoutes);
app.use('/api/admin', adminRoutes);

// Payment & Wallet Module Mounting
app.use('/api/payment', paymentRoutes);
app.use('/api/payment', webhookRoutes);
app.use('/api/wallet', walletRoutes);

// Global Error Handler
app.use(errorHandler);

module.exports = app;
