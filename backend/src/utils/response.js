/**
 * Standardize successful responses
 * @param {Object} res - Express response object
 * @param {String} message - Success message
 * @param {Object} data - Data to send
 * @param {Number} statusCode - HTTP status code
 */
const sendSuccess = (res, message = 'Operation Successful', data = {}, statusCode = 200) => {
  return res.status(statusCode).json({
    success: true,
    message,
    data,
  });
};

/**
 * Standardize error responses
 * @param {Object} res - Express response object
 * @param {String} message - Error message
 * @param {Number} statusCode - HTTP status code
 */
const sendError = (res, message = 'An error occurred', statusCode = 500) => {
  return res.status(statusCode).json({
    success: false,
    message,
    timestamp: new Date().toISOString(),
  });
};

/**
 * Standardize paginated responses
 * @param {Object} res - Express response object
 * @param {String} message - Success message
 * @param {Array} items - Paginated item array
 * @param {Object} pagination - Pagination metadata (page, limit, total)
 */
const sendPaginated = (res, message = 'Data retrieved successfully', items = [], pagination = {}) => {
  return res.status(200).json({
    success: true,
    message,
    data: items,
    pagination: {
      page: pagination.page || 1,
      limit: pagination.limit || 10,
      total: pagination.total || items.length,
      totalPages: Math.ceil((pagination.total || items.length) / (pagination.limit || 10)),
    },
  });
};

module.exports = {
  sendSuccess,
  sendError,
  sendPaginated,
};
