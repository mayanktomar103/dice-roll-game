const JWT_CONFIG = {
  SECRET: process.env.JWT_SECRET || 'supersecret_diceroll_access_key_2026',
  EXPIRES_IN: process.env.JWT_EXPIRES_IN || '15m',
  REFRESH_SECRET: process.env.JWT_REFRESH_SECRET || 'supersecret_diceroll_refresh_key_2026',
  REFRESH_EXPIRES_IN: process.env.JWT_REFRESH_EXPIRES_IN || '7d'
};

module.exports = JWT_CONFIG;
