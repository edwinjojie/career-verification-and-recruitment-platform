const ActivityLog = require('../models/ActivityLog.model');

/**
 * Log candidate activity
 * 
 * @param {String} candidateId - The candidate's authUserId
 * @param {String} eventType - Type of event (from ActivityLog enum)
 * @param {Object} metadata - Additional event data
 * @param {Object} req - Express request object (for IP and user agent)
 * @param {String} source - Event source: 'user', 'system', or 'admin'
 * @returns {Object} Created activity log entry
 */
const logActivity = async (candidateId, eventType, metadata = {}, req = null, source = 'user') => {
    try {
        const activityData = {
            candidateId,
            eventType,
            metadata,
            source,
            ipAddress: req ? (req.ip || req.connection?.remoteAddress) : null,
            userAgent: req ? req.get('user-agent') : null
        };

        const activity = await ActivityLog.create(activityData);
        return activity;

    } catch (error) {
        // Log error but don't throw - activity logging should not break main flow
        console.error('Failed to log activity:', error.message);
        return null;
    }
};

/**
 * Get activity logs for a candidate
 * 
 * @param {String} candidateId - The candidate's authUserId
 * @param {Object} options - Query options (limit, skip, eventType filter)
 * @returns {Array} Activity log entries
 */
const getActivityLogs = async (candidateId, options = {}) => {
    const { limit = 50, skip = 0, eventType = null } = options;

    const query = { candidateId };
    if (eventType) {
        query.eventType = eventType;
    }

    const activities = await ActivityLog.find(query)
        .sort({ timestamp: -1 })
        .limit(limit)
        .skip(skip)
        .lean();

    return activities;
};

module.exports = {
    logActivity,
    getActivityLogs
};
