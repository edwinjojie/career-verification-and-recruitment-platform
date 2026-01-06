const mongoose = require('mongoose');

const experienceSchema = new mongoose.Schema({
    candidateId: {
        type: String,
        required: true,
        index: true
    },
    company: {
        type: String,
        required: true,
        trim: true
    },
    title: {
        type: String,
        required: true,
        trim: true
    },
    employmentType: {
        type: String,
        enum: ['full-time', 'part-time', 'contract', 'internship', 'freelance', ''],
        default: ''
    },
    location: {
        type: String,
        trim: true
    },
    startDate: {
        type: Date,
        required: true
    },
    endDate: {
        type: Date
    },
    description: {
        type: String,
        maxlength: 2000,
        trim: true
    },
    isCurrentRole: {
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

// Compound indexes for efficient queries
experienceSchema.index({ candidateId: 1, isDeleted: 1 });
experienceSchema.index({ candidateId: 1, startDate: -1 });

module.exports = mongoose.model('Experience', experienceSchema);
