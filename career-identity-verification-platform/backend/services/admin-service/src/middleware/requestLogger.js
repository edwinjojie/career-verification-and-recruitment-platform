const crypto = require('crypto');
const logger = require('../utils/logger');

const requestLogger = (req, res, next) => {
    // Generate or extract Request ID
    req.requestId = req.headers['x-request-id'] || crypto.randomUUID();
    res.setHeader('x-request-id', req.requestId);

    const start = Date.now();
    const { method, originalUrl, ip } = req;

    // Log Request Start
    logger.info('Request Started', {
        requestId: req.requestId,
        method,
        url: originalUrl,
        ip
    });

    // Log Request End
    res.on('finish', () => {
        const duration = Date.now() - start;
        logger.info('Request Completed', {
            requestId: req.requestId,
            method,
            url: originalUrl,
            status: res.statusCode,
            durationMs: duration
        });
    });

    next();
};

module.exports = requestLogger;
