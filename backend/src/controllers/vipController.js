const VipService = require('../services/vipService');
const ApiResponse = require('../utils/apiResponse');

class VipController {
  static async getStatus(req, res, next) {
    try {
      const status = await VipService.getVipStatus(req.user._id);
      return ApiResponse.success(res, 'VIP status fetched', status, 200);
    } catch (error) {
      next(error);
    }
  }

  static async purchase(req, res, next) {
    try {
      const result = await VipService.purchaseVip(req.user._id);
      return ApiResponse.success(res, 'Lifetime VIP membership activated!', result, 200);
    } catch (error) {
      return ApiResponse.error(res, error.message, 400);
    }
  }
}

module.exports = VipController;
