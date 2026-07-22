const User = require('../models/User');
const GAME_RULES = require('../constants/gameRules');

class RewardService {
  static async claimDailyReward(userId) {
    const user = await User.findById(userId);
    if (!user) {
      throw new Error('User not found');
    }

    const now = new Date();
    const cooldown = GAME_RULES.DAILY_REWARD.COOLDOWN_MS;

    if (user.dailyRewardClaimedAt) {
      const timeSinceLastClaim = now.getTime() - new Date(user.dailyRewardClaimedAt).getTime();
      if (timeSinceLastClaim < cooldown) {
        const remainingMs = cooldown - timeSinceLastClaim;
        const nextClaimAt = new Date(now.getTime() + remainingMs);
        throw new Error(
          `Daily reward already claimed. Next claim available in ${Math.ceil(remainingMs / 1000 / 60)} minutes.`
        );
      }
    }

    const bonus = user.vip ? GAME_RULES.DAILY_REWARD.VIP : GAME_RULES.DAILY_REWARD.STANDARD;

    user.coins += bonus;
    user.dailyRewardClaimedAt = now;
    await user.save();

    return {
      coinsAdded: bonus,
      newBalance: user.coins,
      dailyRewardClaimedAt: user.dailyRewardClaimedAt,
      nextClaimAt: new Date(now.getTime() + cooldown)
    };
  }
}

module.exports = RewardService;
