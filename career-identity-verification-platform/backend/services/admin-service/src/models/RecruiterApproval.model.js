const mongoose = require('mongoose');

const recruiterApprovalSchema = new mongoose.Schema({
    recruiterId: {
        type: String,
        required: true,
        unique: true,
        index: true
    },
    status: {
        type: String,
        enum: ['pending', 'approved', 'rejected'],
        default: 'pending'
    },
    approvedBy: {
        type: String, // Admin ID
        required: false
    },
    approvedAt: {
        type: Date
    }
}, {
    timestamps: true // Adds createdAt and updatedAt
});

module.exports = mongoose.model('RecruiterApproval', recruiterApprovalSchema);
