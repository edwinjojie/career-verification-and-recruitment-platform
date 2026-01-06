const mongoose = require('mongoose');

const activityLogSchema = new mongoose.Schema({
    candidateId: {
        type: String,
        required: true,
        index: true
    },
    eventType: {
        type: String,
        enum: [
            'profile_created',
            'profile_updated',
            'profile_completed',
            'education_added',
            'education_updated',
            'education_deleted',
            'experience_added',
            'experience_updated',
            'experience_deleted',
            'skill_added',
            'skill_removed',
            'certification_added',
            'certification_removed',
            'document_uploaded',
            'document_deleted',
            'application_submitted',
            'profile_deactivated'
        ],
        required: true
    },
    metadata: {
        type: mongoose.Schema.Types.Mixed,
        default: {}
    },
    source: {
        type: String,
        enum: ['user', 'system', 'admin'],
        default: 'user'
    },
    ipAddress: {
        type: String
    },
    userAgent: {
        type: String
    },
    timestamp: {
        type: Date,
        default: Date.now,
        immutable: true
    }
}, {
    timestamps: false,
    versionKey: false
});

// Compound index for efficient activity queries
activityLogSchema.index({ candidateId: 1, timestamp: -1 });
activityLogSchema.index({ eventType: 1, timestamp: -1 });

module.exports = mongoose.model('ActivityLog', activityLogSchema);
