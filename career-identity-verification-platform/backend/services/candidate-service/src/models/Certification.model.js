const mongoose = require('mongoose');

const certificationSchema = new mongoose.Schema({
    candidateId: {
        type: String,
        required: true,
        index: true
    },
    name: {
        type: String,
        required: true,
        trim: true
    },
    issuingOrganization: {
        type: String,
        required: true,
        trim: true
    },
    issueDate: {
        type: Date
    },
    expiryDate: {
        type: Date
    },
    credentialId: {
        type: String,
        trim: true
    },
    credentialUrl: {
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
certificationSchema.index({ candidateId: 1, isDeleted: 1 });
certificationSchema.index({ candidateId: 1, issueDate: -1 });

module.exports = mongoose.model('Certification', certificationSchema);
