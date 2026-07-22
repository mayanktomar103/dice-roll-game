const StoreService = require('../services/storeService');
const ApiResponse = require('../utils/apiResponse');

class StoreController {
  static async getCoinPacks(req, res, next) {
    try {
      const packs = await StoreService.getCoinPacks();
      return ApiResponse.success(res, 'Coin packages fetched', { packs }, 200);
    } catch (error) {
      next(error);
    }
  }

  static async purchase(req, res, next) {
    try {
      const result = await StoreService.purchaseCoinPack(req.user._id, req.body);
      return ApiResponse.success(res, 'Coin pack purchased successfully!', result, 200);
    } catch (error) {
      return ApiResponse.error(res, error.message, 400);
    }
  }
}

module.exports = StoreController;
