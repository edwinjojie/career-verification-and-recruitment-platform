const dotenv = require('dotenv');
const path = require('path');

// Load .env file from the root of the admin-service
dotenv.config({ path: path.join(__dirname, '../../.env') });

/**
 * Environment Variables Configuration
 * 
 * This module allows importing configuration variables from a central location.
 * It also documents the purpose of each variable.
 */

const env = {
    // PORT: The HTTP port the service listens on.
    PORT: process.env.PORT || 3003,

    // NODE_ENV: The runtime environment (development, production, test).
    NODE_ENV: process.env.NODE_ENV || 'development',

    // LOG_LEVEL: The logging level (info, warn, error, debug).
    LOG_LEVEL: process.env.LOG_LEVEL || 'info',

    // MONGO_URI: MongoDB connection string for the audit/admin database.
    MONGO_URI: process.env.MONGO_URI || 'mongodb://localhost:27017/admin-service',

    // AUTH_SERVICE_BASE_URL: Base URL for Auth Service internal endpoints (e.g. http://localhost:3002/api/v1/auth).
    AUTH_SERVICE_BASE_URL: process.env.AUTH_SERVICE_BASE_URL || 'http://localhost:3002/api/v1/auth',

    // INTERNAL_SERVICE_SECRET: Shared secret header value for securing internal calls between services.
    INTERNAL_SERVICE_SECRET: process.env.INTERNAL_SERVICE_SECRET,

    // JWT_PUBLIC_KEY_PATH: Filesystem path to the RS256 public key used to verify tokens.
    JWT_PUBLIC_KEY_PATH: process.env.JWT_PUBLIC_KEY_PATH || path.join(__dirname, '../../secrets/jwt_public.pem'),
};

module.exports = env;
