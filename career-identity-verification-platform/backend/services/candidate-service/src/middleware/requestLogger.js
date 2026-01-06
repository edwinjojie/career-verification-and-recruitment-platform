const crypto = require('crypto');
const logger = require('../utils/logger');

/**
 * Request logging middleware
 * Generates unique request ID and logs incoming requests
 */
const requestLogger = (req, res, next) => {
    // Generate unique request ID
    req.requestId = crypto.randomUUID();

    // Log incoming request
    logger.info('Incoming Request', {
        requestId: req.requestId,
        method: req.method,
        path: req.path,
        ip: req.ip || req.connection.remoteAddress
    });

    // Log response when finished
    res.on('finish', () => {
        logger.info('Request Completed', {
            requestId: req.requestId,
            statusCode: res.statusCode
        });
    });

    next();
};

module.exports = requestLogger;
