const GAME_RULES = {
  INITIAL_COINS: 1000,
  INITIAL_LEVEL: 1,
  INITIAL_XP: 0,
  
  MULTIPLIERS: {
    6: 3,   // Win 3x bet
    5: 1.5, // Win 1.5x bet (New/Adjusted)
    4: 1,   // Return bet
    3: 0,   // Lose bet
    2: 0,   // Lose bet
    1: 0    // Lose bet
  },
  
  // Weights for regular users (totalGames >= 10)
  DICE_WEIGHTS_REGULAR: {
    6: 5,   // 5% chance (3x Win)
    5: 10,  // 10% chance (1.5x Win)
    4: 30,  // 30% chance (1x Return)
    3: 25,  // 25% chance (0x Lose)
    2: 15,  // 15% chance (0x Lose)
    1: 15   // 15% chance (0x Lose)
  },

  // Weights for new users (totalGames < 10)
  DICE_WEIGHTS_NEW_USER: {
    6: 5,   // 5% chance (3x Win)
    5: 25,  // 25% chance (1.5x Win)
    4: 35,  // 35% chance (1x Return)
    3: 20,  // 20% chance (0x Lose)
    2: 13,  // 13% chance (0x Lose)
    1: 12   // 12% chance (0x Lose)
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
