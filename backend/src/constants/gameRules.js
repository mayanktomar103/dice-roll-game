const GAME_RULES = {
  INITIAL_COINS: 1000,
  INITIAL_LEVEL: 1,
  INITIAL_XP: 0,
  
  MULTIPLIERS: {
    6: 3, // Win 3x bet
    5: 2, // Win 2x bet
    4: 1, // Return bet
    3: 0, // Lose bet
    2: 0, // Lose bet
    1: 0  // Lose bet
  },
  
  XP: {
    WIN: 20,
    LOSE: 10,
    RETURN: 10,
    XP_PER_LEVEL: 100
  },
  
  DAILY_REWARD: {
    STANDARD: 250,
    VIP: 500,
    COOLDOWN_MS: 24 * 60 * 60 * 1000 // 24 hours
  },
  
  VIP: {
    PRICE: 999, // ₹999 mock price for lifetime VIP
  }
};

module.exports = GAME_RULES;
