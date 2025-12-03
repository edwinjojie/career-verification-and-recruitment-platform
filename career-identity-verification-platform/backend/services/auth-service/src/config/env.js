const dotenv = require('dotenv');
const path = require('path');

// Load .env file
dotenv.config({ path: path.join(__dirname, '../../.env') });

const env = {
    NODE_ENV: process.env.NODE_ENV || 'development',
    PORT: process.env.PORT || 3002,
    MONGO_URI: process.env.MONGO_URI || 'mongodb://localhost:27017/auth-service',
    JWT_SECRET: process.env.JWT_SECRET || 'your-secret-key', // Change in prod
    JWT_EXPIRES_IN: process.env.JWT_EXPIRES_IN || '15m',
    REFRESH_TOKEN_EXPIRES_IN: process.env.REFRESH_TOKEN_EXPIRES_IN || '7d',
    LOG_LEVEL: process.env.LOG_LEVEL || 'info',
};

module.exports = env;
