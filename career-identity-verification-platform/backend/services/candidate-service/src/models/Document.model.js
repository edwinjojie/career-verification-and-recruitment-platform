const mongoose = require('mongoose');

const documentSchema = new mongoose.Schema({
    candidateId: {
        type: String,
        required: true,
        index: true
    },
    documentType: {
        type: String,
        enum: ['resume', 'certificate', 'id_proof', 'portfolio'],
        required: true
    },
    fileName: {
        type: String,
        required: true,
        trim: true
    },
    fileSize: {
        type: Number
    },
    mimeType: {
        type: String,
        trim: true
    },
    storageUrl: {
        type: String,
        trim: true
    },
    uploadedAt: {
        type: Date,
        default: Date.now
    },
    uploadedBy: {
        type: String,
        enum: ['candidate', 'admin', 'system'],
        default: 'candidate'
    },
    verificationStatus: {
        type: String,
        enum: ['pending', 'verified', 'rejected'],
        default: 'pending'
    },
    rejectionReason: {
        type: String,
        trim: true
    },
    isDeleted: {
        type: Boolean,
        default: false
    }
}, {
    timestamps: true,
    versionKey: false
});

// Compound indexes
documentSchema.index({ candidateId: 1, documentType: 1, isDeleted: 1 });
documentSchema.index({ candidateId: 1, uploadedAt: -1 });

module.exports = mongoose.model('Document', documentSchema);
