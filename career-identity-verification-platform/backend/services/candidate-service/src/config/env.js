require('dotenv').config();

const env = {
    PORT: process.env.PORT || 3004,
    NODE_ENV: process.env.NODE_ENV || 'development',
    LOG_LEVEL: process.env.LOG_LEVEL || 'info',
    MONGO_URI: process.env.MONGO_URI || 'mongodb://localhost:27017/candidate-service',
    JWT_PUBLIC_KEY_PATH: process.env.JWT_PUBLIC_KEY_PATH || '../../secrets/jwt_public.pem',
    AUTH_SERVICE_BASE_URL: process.env.AUTH_SERVICE_BASE_URL || 'http://localhost:3002/api/v1/auth',
    AUTH_INTERNAL_TIMEOUT_MS: parseInt(process.env.AUTH_INTERNAL_TIMEOUT_MS || '3000', 10),
    INTERNAL_SERVICE_SECRET: process.env.INTERNAL_SERVICE_SECRET || 'change_me_to_secure_secret'
};

// Validate critical environment variables
const requiredVars = ['MONGO_URI', 'JWT_PUBLIC_KEY_PATH'];
const missingVars = requiredVars.filter(varName => !env[varName]);

if (missingVars.length > 0) {
    throw new Error(`Missing required environment variables: ${missingVars.join(', ')}`);
}

module.exports = env;
