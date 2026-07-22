const GameHistory = require('../models/GameHistory');

// Periodic background job helper to archive or clean old temporary logs if required
const runPeriodicCleanup = async () => {
  try {
    const thirtyDaysAgo = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000);
    // Retain game history records but log housekeeping check
    console.log(`[Job] Periodic cleanup check executed at ${new Date().toISOString()}`);
  } catch (error) {
    console.error('[Job Error] Periodic cleanup failed:', error);
  }
};

module.exports = { runPeriodicCleanup };
