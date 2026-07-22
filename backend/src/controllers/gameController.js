const GameService = require('../services/gameService');
const ApiResponse = require('../utils/apiResponse');

class GameController {
  static async play(req, res, next) {
    try {
      const { bet } = req.body;
      const result = await GameService.playGame(req.user._id, bet);
      return ApiResponse.success(res, 'Dice rolled successfully', result, 200);
    } catch (error) {
      return ApiResponse.error(res, error.message, 400);
    }
  }

  static async getHistory(req, res, next) {
    try {
      const { page, limit, result } = req.query;
      const historyData = await GameService.getHistory(req.user._id, { page, limit, result });
      return ApiResponse.success(res, 'Game history fetched', historyData, 200);
    } catch (error) {
      next(error);
    }
  }

  static async getStats(req, res, next) {
    try {
      const stats = await GameService.getStats(req.user._id);
      return ApiResponse.success(res, 'Game stats fetched', stats, 200);
    } catch (error) {
      next(error);
    }
  }
}

module.exports = GameController;
