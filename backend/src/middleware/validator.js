const { validationResult } = require('express-validator');
const { sendError } = require('../utils/response');

const validate = (req, res, next) => {
  const errors = validationResult(req);
  if (errors.isEmpty()) {
    return next();
  }

  const extractedErrors = [];
  errors.array().map((err) => extractedErrors.push({ field: err.path, message: err.msg }));

  return res.status(422).json({
    success: false,
    message: errors.array()[0]?.msg || 'Request validation failed',
    errors: extractedErrors,
    timestamp: new Date().toISOString(),
  });
};

module.exports = { validate };
