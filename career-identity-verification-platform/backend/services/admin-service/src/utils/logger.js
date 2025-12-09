const env = require('../config/env');

const formatMessage = (level, message, meta = {}) => {
    return JSON.stringify({
        timestamp: new Date().toISOString(),
        level,
        service: 'admin-service',
        message,
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
