const WalletService = require('./wallet.service');
const ApiResponse = require('../utils/apiResponse');

class WalletController {
  static async getBalance(req, res, next) {
    try {
      const balance = await WalletService.getBalance(req.user._id);
      return ApiResponse.success(res, 'Wallet balance fetched', balance, 200);
    } catch (error) {
      next(error);
    }
  }

  static async getTransactions(req, res, next) {
    try {
      const { page, limit, type } = req.query;
      const data = await WalletService.getTransactions(req.user._id, { page, limit, type });
      return ApiResponse.success(res, 'Transactions history fetched', data, 200);
    } catch (error) {
      next(error);
    }
  }

  static async getSummary(req, res, next) {
    try {
      const summary = await WalletService.getSummary(req.user._id);
      return ApiResponse.success(res, 'Wallet summary fetched', summary, 200);
    } catch (error) {
      next(error);
    }
  }
}

module.exports = WalletController;
