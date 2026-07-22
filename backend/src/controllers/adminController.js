const AdminService = require('../services/adminService');
const ApiResponse = require('../utils/apiResponse');

class AdminController {
  static async getDashboard(req, res, next) {
    try {
      const stats = await AdminService.getDashboardStats();
      return ApiResponse.success(res, 'Admin dashboard metrics fetched', stats, 200);
    } catch (error) {
      next(error);
    }
  }

  static async getUsers(req, res, next) {
    try {
      const { page, limit, search } = req.query;
      const data = await AdminService.getUsersList({ page, limit, search });
      return ApiResponse.success(res, 'Users list fetched', data, 200);
    } catch (error) {
      next(error);
    }
  }

  static async getPurchases(req, res, next) {
    try {
      const { page, limit } = req.query;
      const data = await AdminService.getPurchasesList({ page, limit });
      return ApiResponse.success(res, 'Purchases list fetched', data, 200);
    } catch (error) {
      next(error);
    }
  }
}

module.exports = AdminController;
