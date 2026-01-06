const logger = require('../utils/logger');

/**
 * Global error handler middleware
 * Catches all errors and returns standardized error responses
 */
const errorHandler = (err, req, res, next) => {
    const statusCode = err.statusCode || 500;
    const code = err.code || 'INTERNAL_ERROR';
    const message = err.message || 'An unexpected error occurred';

    // Log error details
    logger.error('Error Handler', {
        requestId: req.requestId,
        statusCode,
        code,
        message,
        stack: err.stack,
        isOperational: err.isOperational
    });

    // Send error response
    res.status(statusCode).json({
        success: false,
        error: {
            code,
            message,
            ...(process.env.NODE_ENV === 'development' && { stack: err.stack })
        }
    });
};

module.exports = errorHandler;
