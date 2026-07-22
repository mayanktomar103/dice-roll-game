# DiceRoll 🎲 - Full-Stack Virtual Gaming Application

DiceRoll is a production-ready, modular, and scalable full-stack virtual dice gaming application built with **React 19**, **Vite**, **Tailwind CSS**, **Node.js**, **Express**, **MongoDB (Mongoose)**, and **JWT Authentication**.

> ⚠️ **IMPORTANT NOTICE:**
> - **NOT A GAMBLING APPLICATION**: This game uses ONLY virtual coins that have **NO real-world monetary value**.
> - Virtual coins **cannot** be withdrawn, redeemed, or exchanged for real money.
> - Store coin packs and Lifetime VIP memberships unlock gameplay features and virtual rewards only.

---

## 🌟 Features

- **3D Animated Dice Roller**: Powered by Framer Motion and 3D transform CSS.
- **Fair Game Payout Logic**:
  - **Dice 6**: Win 3x Bet (+2x Net Profit)
  - **Dice 5**: Win 2x Bet (+1x Net Profit)
  - **Dice 4**: Return Bet (0 Net Profit)
  - **Dice 1 - 3**: Lose Bet (-1x Net Loss)
- **Level & XP Progression System**:
  - Earn **+20 XP** on every win and **+10 XP** on lose/return.
  - Level up automatically every 100 XP (`Level = 1 + floor(XP / 100)`).
- **24-Hour Daily Bonus**:
  - Regular Users: Claim **250 free coins** every 24 hours.
  - VIP Users: Claim **500 free coins** every 24 hours.
- **Lifetime VIP Pass**:
  - VIP Badge on profile and dashboard.
  - Doubled daily bonus coins.
  - Exclusive styling and ad-free experience.
- **Virtual Coin Store**:
  - 5,000 Coins @ ₹99
  - 15,000 Coins @ ₹199
  - 50,000 Coins @ ₹499
  - Mock payment checkout flow ready for future Razorpay integration.
- **Game History & Analytics**:
  - Full history table with filterable game outcomes (Win, Lose, Return).
  - Win rate statistics, total games played, total wins/losses.
- **Admin APIs**:
  - `/api/admin/dashboard` metrics (total users, VIP users, revenue, game stats).
  - `/api/admin/users` paginated list.
  - `/api/admin/purchases` transaction monitoring.

---

## 🏗️ Project Structure

```text
dice-roll-game/
├── README.md
├── backend/
│   ├── package.json
│   ├── .env.example
│   └── src/
│       ├── app.js
│       ├── server.js
│       ├── config/          # db.js, jwt.js
│       ├── constants/       # gameRules.js
│       ├── controllers/     # auth, game, reward, store, vip, admin
│       ├── middleware/      # auth, admin, errorHandler, rateLimiter
│       ├── models/          # User, GameHistory, Purchase, CoinPackage, Cosmetic
│       ├── routes/          # auth, game, reward, store, vip, admin
│       ├── seed/            # seedData.js
│       ├── services/        # auth, game, reward, store, vip, admin
│       ├── utils/           # apiResponse, generateToken
│       └── validators/      # authValidator, gameValidator
└── frontend/
    ├── package.json
    ├── vite.config.js
    ├── index.html
    └── src/
        ├── App.jsx
        ├── main.jsx
        ├── api/             # axiosInstance
        ├── components/
        │   ├── common/      # Navbar, Footer, ProtectedRoute, LoadingSpinner
        │   └── ui/          # Dice3D, StatCard
        ├── context/         # AuthContext, UserContext, ThemeContext
        ├── pages/
        │   ├── Home/
        │   ├── Login/
        │   ├── Register/
        │   ├── Dashboard/
        │   ├── DiceGame/
        │   ├── History/
        │   ├── VIP/
        │   ├── Store/
        │   ├── Profile/
        │   └── NotFound/
        ├── routes/          # AppRoutes.jsx
        ├── services/        # authService, gameService, storeService, vipService
        └── styles/          # index.css
```

---

## 🛠️ Environment Variables Setup

### Backend Environment Variables (`backend/.env`)

Create a `.env` file inside the `backend/` directory:

```env
PORT=5000
NODE_ENV=development
MONGODB_URI=mongodb://localhost:27017/diceroll
JWT_SECRET=supersecret_diceroll_access_key_2026
JWT_EXPIRES_IN=15m
JWT_REFRESH_SECRET=supersecret_diceroll_refresh_key_2026
JWT_REFRESH_EXPIRES_IN=7d
CLIENT_URL=http://localhost:5173
```

---

## 🚀 Installation & Running Guide

### 1. Prerequisite: MongoDB Setup
Ensure MongoDB is installed and running locally on `mongodb://localhost:27017` or use a MongoDB Atlas connection URI in `MONGODB_URI`.

### 2. Backend Setup
```bash
# Navigate into backend directory
cd backend

# Install dependencies
npm install

# (Optional) Seed coin packages & admin account
npm run seed

# Run in development mode
npm run dev
```
The backend server will start on `http://localhost:5000`.

### 3. Frontend Setup
```bash
# In a new terminal, navigate into frontend directory
cd frontend

# Install dependencies
npm install

# Run Vite dev server
npm run dev
```
The frontend application will start on `http://localhost:5173`.

---

## 📡 API Endpoint Overview

### Auth Routes (`/api/auth`)
- `POST /api/auth/register` - Create user account (gives +1,000 free coins)
- `POST /api/auth/login` - Authenticate user & get JWT tokens
- `POST /api/auth/logout` - Revoke tokens & clear session
- `POST /api/auth/refresh-token` - Rotate refresh tokens
- `GET /api/auth/profile` - Fetch current user profile
- `PUT /api/auth/profile` - Update profile details

### Game Routes (`/api/game`)
- `POST /api/game/play` - Execute dice roll bet (1-6 result & payout)
- `GET /api/game/history` - Fetch user game history (paginated & filterable)
- `GET /api/game/stats` - Fetch user game statistics

### Rewards Route (`/api/rewards`)
- `POST /api/rewards/daily` - Claim 24-hour daily bonus coins (250 for regular, 500 for VIP)

### Store Routes (`/api/store`)
- `GET /api/store/coin-packs` - List active virtual coin packages
- `POST /api/store/purchase` - Purchase coin package (Mock checkout)

### VIP Routes (`/api/vip`)
- `GET /api/vip/status` - Check VIP status & benefits
- `POST /api/vip/purchase` - Purchase Lifetime VIP Pass (Mock checkout)

### Admin Routes (`/api/admin`) - Requires `role: 'admin'`
- `GET /api/admin/dashboard` - Get overall platform metrics & revenue stats
- `GET /api/admin/users` - Paginated user management list
- `GET /api/admin/purchases` - Paginated purchase transactions list

---

## 📝 License
Distributed under the ISC License. Designed for entertainment and educational purposes only.