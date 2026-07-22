const RewardService = require('../services/rewardService');
const ApiResponse = require('../utils/apiResponse');

class RewardController {
  static async claimDaily(req, res, next) {
    try {
      const result = await RewardService.claimDailyReward(req.user._id);
      return ApiResponse.success(res, 'Daily reward claimed successfully!', result, 200);
    } catch (error) {
      return ApiResponse.error(res, error.message, 400);
    }
  }
}

module.exports = RewardController;
