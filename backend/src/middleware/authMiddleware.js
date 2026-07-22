const jwt = require('jsonwebtoken');
const User = require('../models/User');
const ApiResponse = require('../utils/apiResponse');

const protect = async (req, res, next) => {
  try {
    let token;

    if (
      req.headers.authorization &&
      req.headers.authorization.startsWith('Bearer')
    ) {
      token = req.headers.authorization.split(' ')[1];
    } else if (req.cookies && req.cookies.token) {
      token = req.cookies.token;
    }

    if (!token) {
      return ApiResponse.error(res, 'Not authorized, no token provided', 401);
    }

    try {
      const decoded = jwt.verify(
        token,
        process.env.JWT_SECRET || 'supersecret_diceroll_access_key_2026'
      );
      const user = await User.findById(decoded.id);

      if (!user) {
        return ApiResponse.error(res, 'User no longer exists', 401);
      }

      req.user = user;
      next();
    } catch (error) {
      return ApiResponse.error(res, 'Not authorized, token failed or expired', 401);
    }
  } catch (error) {
    next(error);
  }
};

module.exports = { protect };
