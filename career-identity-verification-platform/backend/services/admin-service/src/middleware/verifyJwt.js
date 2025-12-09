const jwt = require('jsonwebtoken');
const fs = require('fs');
const path = require('path');
const env = require('../config/env');
const logger = require('../utils/logger');

// Load Public Key
let publicKey;
try {
    // Resolve path relative to CWD or absolute
    const keyPath = path.isAbsolute(env.JWT_PUBLIC_KEY_PATH)
        ? env.JWT_PUBLIC_KEY_PATH
        : path.resolve(process.cwd(), env.JWT_PUBLIC_KEY_PATH);

    publicKey = fs.readFileSync(keyPath, 'utf8');
} catch (error) {
    logger.error('Failed to load JWT Public Key', { error: error.message });
    process.exit(1); // Fatal error
}

const verifyJwt = (req, res, next) => {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
        return res.status(401).json({
            success: false,
            error: {
                code: 'UNAUTHORIZED',
                message: 'Missing or invalid Authorization header'
            }
        });
    }

    const token = authHeader.split(' ')[1];

    try {
        const decoded = jwt.verify(token, publicKey, { algorithms: ['RS256'] });
        req.user = decoded; // Attach user to request
        next();
    } catch (error) {
        logger.warn('JWT Verification Failed', {
            requestId: req.requestId,
            error: error.message
        });

        return res.status(401).json({
            success: false,
            error: {
                code: 'UNAUTHORIZED',
                message: 'Invalid or expired token'
            }
        });
    }
};

module.exports = verifyJwt;
