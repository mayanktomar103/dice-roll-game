const ApiResponse = require('../utils/apiResponse');

const adminOnly = (req, res, next) => {
  if (req.user && req.user.role === 'admin') {
    next();
  } else {
    return ApiResponse.error(res, 'Access denied: Admin permissions required', 403);
  }
};

module.exports = { adminOnly };
