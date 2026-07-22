const { body, validationResult } = require('express-validator');
const ApiResponse = require('../utils/apiResponse');

const validate = (validations) => {
  return async (req, res, next) => {
    for (let validation of validations) {
      const result = await validation.run(req);
      if (result.errors.length) break;
    }

    const errors = validationResult(req);
    if (errors.isEmpty()) {
      return next();
    }

    const extractedErrors = errors.array().map((err) => err.msg);
    return ApiResponse.error(res, 'Validation failed', 400, extractedErrors);
  };
};

const playGameValidation = validate([
  body('bet')
    .isInt({ min: 1 })
    .withMessage('Bet amount must be a positive integer greater than 0')
]);

module.exports = {
  playGameValidation
};
