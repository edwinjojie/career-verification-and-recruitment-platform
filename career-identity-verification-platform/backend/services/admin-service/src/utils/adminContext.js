const extractAdminContext = (req) => {
    return {
        adminId: req.user ? req.user.sub : 'system', // 'sub' is standard JWT subject (userId)
        ip: req.ip || req.connection.remoteAddress,
        userAgent: req.headers['user-agent'] || 'unknown',
        requestId: req.requestId
    };
};

module.exports = { extractAdminContext };
