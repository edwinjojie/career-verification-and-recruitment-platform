const jwt = require('jsonwebtoken');
const fs = require('fs');
const path = require('path');
const crypto = require('crypto');
const env = require('../config/env');

// Load keys
const privateKey = fs.readFileSync(path.join(__dirname, '../../secrets/jwt_private.pem'), 'utf8');
const publicKey = fs.readFileSync(path.join(__dirname, '../../secrets/jwt_public.pem'), 'utf8');

exports.generateAccessToken = (user) => {
    const payload = {
        sub: user._id,
        role: user.role,
        email: user.email,
    };

    return jwt.sign(payload, privateKey, {
        algorithm: 'RS256',
        expiresIn: env.JWT_EXPIRES_IN,
    });
};

exports.generateRefreshToken = () => {
    return crypto.randomBytes(40).toString('hex');
};

exports.verifyAccessToken = (token) => {
    try {
        return jwt.verify(token, publicKey, { algorithms: ['RS256'] });
    } catch (error) {
        return null;
    }
};
