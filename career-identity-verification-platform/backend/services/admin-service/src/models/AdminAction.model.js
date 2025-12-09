const mongoose = require('mongoose');

const adminActionSchema = new mongoose.Schema({
    adminId: {
        type: String, // Storing as String ID from JWT
        required: true,
        index: true
    },
    targetUserId: {
        type: String,
        required: false // Some actions might not target a specific user (e.g., system config)
    },
    action: {
        type: String,
        enum: [
            'CREATE_RECRUITER',
            'CREATE_ADMIN',
            'UPDATE_ROLE',
            'BAN_USER',
            'UNBAN_USER',
            'APPROVE_RECRUITER'
        ],
        required: true
    },
    metadata: {
        type: mongoose.Schema.Types.Mixed,
        default: {} // Flexible for storing oldRole, newRole, reason, etc.
    },
    ip: {
        type: String,
        required: true
    },
    userAgent: {
        type: String,
        required: true
    },
    timestamp: {
        type: Date,
        default: Date.now,
        immutable: true // Prevent tampering
    }
}, {
    timestamps: false, // We manually handle 'timestamp'
    versionKey: false
});

// Index for typical audit queries: "What did Admin X do recently?"
adminActionSchema.index({ adminId: 1, timestamp: -1 });
adminActionSchema.index({ targetUserId: 1, timestamp: -1 });

module.exports = mongoose.model('AdminAction', adminActionSchema);
