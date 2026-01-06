const mongoose = require('mongoose');

const applicationSchema = new mongoose.Schema({
    candidateId: {
        type: String,
        required: true,
        index: true
    },
    jobId: {
        type: String,
        required: true,
        index: true
    },
    appliedAt: {
        type: Date,
        default: Date.now,
        immutable: true
    },
    status: {
        type: String,
        enum: ['submitted', 'under_review', 'shortlisted', 'rejected', 'accepted'],
        default: 'submitted'
    },
    snapshot: {
        type: mongoose.Schema.Types.Mixed,
        required: true,
        immutable: true
    },
    coverLetter: {
        type: String,
        maxlength: 2000,
        trim: true
    },
    resumeDocumentId: {
        type: String
    }
}, {
    timestamps: true,
    versionKey: false
});

// Unique constraint to prevent duplicate applications
applicationSchema.index({ candidateId: 1, jobId: 1 }, { unique: true });
applicationSchema.index({ candidateId: 1, appliedAt: -1 });
applicationSchema.index({ status: 1 });

module.exports = mongoose.model('Application', applicationSchema);
