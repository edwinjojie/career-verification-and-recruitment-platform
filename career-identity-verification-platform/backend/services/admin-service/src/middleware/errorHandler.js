const logger = require('../utils/logger');
const ApiError = require('../errors/ApiError');

const errorHandler = (err, req, res, next) => {
    // Check if expected ApiError, otherwise wrap as Internal 500
    const error = err instanceof ApiError ? err : ApiError.internal(err.message);

    // Log the error
    logger.error(error.message, {
        requestId: req.requestId,
        stack: err.stack,
        statusCode: error.statusCode
    });

    res.status(error.statusCode).json({
        success: false,
        error: {
            code: error.statusCode,
            message: error.message,
            details: error.details
        },
        requestId: req.requestId,
        timestamp: new Date().toISOString()
    });
};

module.exports = errorHandler;
