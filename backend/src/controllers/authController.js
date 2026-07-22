const AuthService = require('../services/authService');
const ApiResponse = require('../utils/apiResponse');

class AuthController {
  static async register(req, res, next) {
    try {
      const { username, email, password } = req.body;
      const result = await AuthService.registerUser({ username, email, password });

      // Set refresh token in HTTP-only cookie
      res.cookie('refreshToken', result.refreshToken, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'lax',
        maxAge: 7 * 24 * 60 * 60 * 1000 // 7 days
      });

      return ApiResponse.success(res, 'User registered successfully', result, 201);
    } catch (error) {
      return ApiResponse.error(res, error.message, 400);
    }
  }

  static async login(req, res, next) {
    try {
      const { email, password } = req.body;
      const result = await AuthService.loginUser({ email, password });

      res.cookie('refreshToken', result.refreshToken, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'lax',
        maxAge: 7 * 24 * 60 * 60 * 1000
      });

      return ApiResponse.success(res, 'Login successful', result, 200);
    } catch (error) {
      return ApiResponse.error(res, error.message, 401);
    }
  }

  static async refreshToken(req, res, next) {
    try {
      const token = req.cookies.refreshToken || req.body.refreshToken;
      const result = await AuthService.refreshAccessToken(token);

      res.cookie('refreshToken', result.refreshToken, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'lax',
        maxAge: 7 * 24 * 60 * 60 * 1000
      });

      return ApiResponse.success(res, 'Token refreshed successfully', result, 200);
    } catch (error) {
      return ApiResponse.error(res, error.message, 401);
    }
  }

  static async logout(req, res, next) {
    try {
      if (req.user) {
        await AuthService.logoutUser(req.user._id);
      }
      res.clearCookie('refreshToken');
      res.clearCookie('token');

      return ApiResponse.success(res, 'Logged out successfully', {}, 200);
    } catch (error) {
      next(error);
    }
  }

  static async getProfile(req, res, next) {
    try {
      return ApiResponse.success(res, 'User profile fetched', { user: req.user }, 200);
    } catch (error) {
      next(error);
    }
  }

  static async updateProfile(req, res, next) {
    try {
      const user = await AuthService.updateUserProfile(req.user._id, req.body);
      return ApiResponse.success(res, 'Profile updated successfully', { user }, 200);
    } catch (error) {
      return ApiResponse.error(res, error.message, 400);
    }
  }
}

module.exports = AuthController;
