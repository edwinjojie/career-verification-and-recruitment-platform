const { getActivityLogs } = require('../services/activityLogService');

/**
 * List activity history
 * GET /api/v1/candidate/activity
 */
const listActivity = async (req, res, next) => {
    try {
        const candidateId = req.user.userId;
        const { eventType, limit = 50, skip = 0 } = req.query;

        const activities = await getActivityLogs(candidateId, {
            eventType,
            limit: parseInt(limit),
            skip: parseInt(skip)
        });

        res.status(200).json({
            success: true,
            data: {
                activities,
                pagination: {
                    limit: parseInt(limit),
                    skip: parseInt(skip)
                }
            }
        });

    } catch (error) {
        next(error);
    }
};

module.exports = {
    listActivity
};
