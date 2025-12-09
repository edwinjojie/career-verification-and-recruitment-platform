const logger = require('../utils/logger');

const requireAdmin = (req, res, next) => {
    if (!req.user || req.user.role !== 'admin') {
        logger.warn('Access Denied: Non-Admin User', {
            requestId: req.requestId,
            userId: req.user ? req.user.sub : 'unknown',
            role: req.user ? req.user.role : 'unknown'
        });

        return res.status(403).json({
            success: false,
            error: {
                code: 'FORBIDDEN',
                message: 'Insufficient permissions. Admin role required.'
            }
        });
    }
    next();
};

module.exports = requireAdmin;
