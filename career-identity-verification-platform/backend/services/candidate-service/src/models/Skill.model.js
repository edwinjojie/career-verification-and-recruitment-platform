const mongoose = require('mongoose');

const skillSchema = new mongoose.Schema({
    candidateId: {
        type: String,
        required: true,
        index: true
    },
    skillName: {
        type: String,
        required: true,
        trim: true
    },
    proficiencyLevel: {
        type: String,
        enum: ['beginner', 'intermediate', 'advanced', 'expert', ''],
        default: ''
    },
    yearsOfExperience: {
        type: Number,
        min: 0
    },
    isPrimary: {
        type: Boolean,
        default: false
    }
}, {
    timestamps: true,
    versionKey: false
});

// Compound index to prevent duplicate skills per candidate
skillSchema.index({ candidateId: 1, skillName: 1 }, { unique: true });
skillSchema.index({ candidateId: 1, isPrimary: -1 });

module.exports = mongoose.model('Skill', skillSchema);
