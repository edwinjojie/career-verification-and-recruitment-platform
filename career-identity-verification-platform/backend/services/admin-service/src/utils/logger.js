const env = require('../config/env');

const formatMessage = (level, message, meta = {}) => {
    // Basic Redaction
    if (meta.password) meta.password = '[REDACTED]';
    if (meta.secret) meta.secret = '[REDACTED]';
    if (meta.token) meta.token = '[REDACTED]';
    if (meta.internalServiceSecret) meta.internalServiceSecret = '[REDACTED]';

    return JSON.stringify({
        timestamp: new Date().toISOString(),
        level,
        service: 'admin-service',
        message,
        correlationId: meta.requestId || meta.correlationId || 'system',
        ...meta
    });
};

const logger = {
    info: (message, meta) => console.log(formatMessage('info', message, meta)),
    warn: (message, meta) => console.warn(formatMessage('warn', message, meta)),
    error: (message, meta) => console.error(formatMessage('error', message, meta)),
    debug: (message, meta) => {
        if (env.LOG_LEVEL === 'debug') {
            console.debug(formatMessage('debug', message, meta));
        }
    }
};

module.exports = logger;
