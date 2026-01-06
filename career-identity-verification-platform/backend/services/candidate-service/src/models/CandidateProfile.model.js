const mongoose = require('mongoose');

const candidateProfileSchema = new mongoose.Schema({
    authUserId: {
        type: String,
        required: true,
        unique: true,
        index: true
    },
    firstName: {
        type: String,
        trim: true
    },
    lastName: {
        type: String,
        trim: true
    },
    phone: {
        type: String,
        trim: true
    },
    location: {
        city: String,
        state: String,
        country: String
    },
    headline: {
        type: String,
        maxlength: 100,
        trim: true
    },
    summary: {
        type: String,
        maxlength: 1000,
        trim: true
    },
    preferences: {
        desiredRole: String,
        desiredLocation: String,
        salaryRange: {
            min: Number,
            max: Number,
            currency: {
                type: String,
                default: 'USD'
            }
        },
        workType: {
            type: String,
            enum: ['remote', 'hybrid', 'onsite', '']
        }
    },
    profileCompletionScore: {
        type: Number,
        default: 0,
        min: 0,
        max: 100
    },
    isProfileComplete: {
        type: Boolean,
        default: false
    },
    isActive: {
        type: Boolean,
        default: true
    }
}, {
    timestamps: true,
    versionKey: false
});

// Index for profile completion queries
candidateProfileSchema.index({ isProfileComplete: 1 });
candidateProfileSchema.index({ isActive: 1 });

module.exports = mongoose.model('CandidateProfile', candidateProfileSchema);
