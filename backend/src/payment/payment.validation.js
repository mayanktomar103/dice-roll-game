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

const createOrderValidation = validate([
  body('type')
    .isIn(['vip', 'coin_pack'])
    .withMessage('Payment type must be either vip or coin_pack'),
  body('amount')
    .isNumeric()
    .custom((val) => val > 0)
    .withMessage('Amount must be greater than 0')
]);

const verifyPaymentValidation = validate([
  body('razorpay_order_id').notEmpty().withMessage('razorpay_order_id is required'),
  body('razorpay_payment_id').notEmpty().withMessage('razorpay_payment_id is required'),
  body('razorpay_signature').notEmpty().withMessage('razorpay_signature is required')
]);

module.exports = {
  createOrderValidation,
  verifyPaymentValidation
};
