const { sendError } = require('../utils/response');
const logger = require('../utils/logger');

const errorHandler = (err, req, res, next) => {
  logger.error(err.message, { stack: err.stack });

  const statusCode = res.statusCode && res.statusCode !== 200 ? res.statusCode : 500;
  
  // Prisma Unique Constraint Error
  if (err.code === 'P2002') {
    return sendError(res, 'Duplicate field value entered', 400);
  }

  // Prisma Record Not Found Error
  if (err.code === 'P2025') {
    return sendError(res, 'Resource not found', 404);
  }

  // Prisma Validation Error
  if (err.name === 'PrismaClientValidationError') {
    return sendError(res, 'Invalid data provided', 400);
  }

  // JWT or Firebase Error
  if ((err.code && err.code.startsWith && err.code.startsWith('auth/')) || err.name === 'JsonWebTokenError') {
    return sendError(res, 'Authentication failed or invalid token', 401);
  }

  if (err.name === 'TokenExpiredError') {
    return sendError(res, 'Session expired, please log in again', 401);
  }

  if (err.status === 429 || err.statusCode === 429) {
    return sendError(res, 'Too many requests, please try again later', 429);
  }

  return sendError(res, err.message || 'Internal Server Error', statusCode);
};

module.exports = { errorHandler };
