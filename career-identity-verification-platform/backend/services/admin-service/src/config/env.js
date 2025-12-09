const dotenv = require('dotenv');
const path = require('path');

// Load .env file
dotenv.config({ path: path.join(__dirname, '../../.env') });

const requiredVars = [
    'PORT',
    'NODE_ENV',
    'MONGO_URI',
    'INTERNAL_SERVICE_SECRET',
    'AUTH_SERVICE_BASE_URL',
    'JWT_PUBLIC_KEY_PATH'
];

requiredVars.forEach((key) => {
    if (!process.env[key]) {
        throw new Error(`Missing required environment variable: ${key}`);
    }
});

const env = {
    PORT: process.env.PORT,
    NODE_ENV: process.env.NODE_ENV,
    MONGO_URI: process.env.MONGO_URI,
    INTERNAL_SERVICE_SECRET: process.env.INTERNAL_SERVICE_SECRET,
    AUTH_SERVICE_BASE_URL: process.env.AUTH_SERVICE_BASE_URL,
    JWT_PUBLIC_KEY_PATH: process.env.JWT_PUBLIC_KEY_PATH,
    LOG_LEVEL: process.env.LOG_LEVEL || 'info'
};

module.exports = env;
