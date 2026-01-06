const mongoose = require('mongoose');

const educationSchema = new mongoose.Schema({
    candidateId: {
        type: String,
        required: true,
        index: true
    },
    degree: {
        type: String,
        required: true,
        trim: true
    },
    fieldOfStudy: {
        type: String,
        trim: true
    },
    institution: {
        type: String,
        required: true,
        trim: true
    },
    startDate: {
        type: Date
    },
    endDate: {
        type: Date
    },
    grade: {
        type: String,
        trim: true
    },
    description: {
        type: String,
        maxlength: 500,
        trim: true
    },
    isVerified: {
        type: Boolean,
        default: false
    },
    isDeleted: {
        type: Boolean,
        default: false
    }
}, {
    timestamps: true,
    versionKey: false
});

// Compound index for efficient queries
educationSchema.index({ candidateId: 1, isDeleted: 1 });
educationSchema.index({ candidateId: 1, startDate: -1 });

module.exports = mongoose.model('Education', educationSchema);
