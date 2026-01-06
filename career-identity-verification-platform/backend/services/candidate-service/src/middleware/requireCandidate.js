/**
 * Middleware to ensure the authenticated user has the 'candidate' role
 * Must be used after verifyJwt middleware
 */
const requireCandidate = (req, res, next) => {
    if (!req.user) {
        return res.status(401).json({
            success: false,
            error: {
                code: 'UNAUTHORIZED',
                message: 'Authentication required'
            }
        });
    }

    if (req.user.role !== 'candidate') {
        return res.status(403).json({
            success: false,
            error: {
                code: 'FORBIDDEN',
                message: 'Access denied. Candidate role required.'
            }
        });
    }

    next();
};

module.exports = requireCandidate;
