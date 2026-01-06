const CandidateProfile = require('../models/CandidateProfile.model');
const Education = require('../models/Education.model');
const Experience = require('../models/Experience.model');
const Skill = require('../models/Skill.model');
const Document = require('../models/Document.model');

/**
 * Calculate profile completion score and status
 * 
 * Completion Criteria:
 * - Profile summary ≥ 50 chars (20%)
 * - At least 1 education (20%)
 * - At least 1 experience (20%)
 * - At least 3 skills (20%)
 * - At least 1 resume uploaded (10%)
 * - Preferences filled (10%)
 * 
 * @param {String} candidateId - The candidate's authUserId
 * @returns {Object} { score, isComplete, missingFields }
 */
const calculateProfileCompletion = async (candidateId) => {
    try {
        const profile = await CandidateProfile.findOne({ authUserId: candidateId });

        if (!profile) {
            return { score: 0, isComplete: false, missingFields: ['profile'] };
        }

        let score = 0;
        const missingFields = [];

        // 1. Profile summary ≥ 50 chars (20%)
        if (profile.summary && profile.summary.length >= 50) {
            score += 20;
        } else {
            missingFields.push('summary (min 50 characters)');
        }

        // 2. At least 1 education (20%)
        const educationCount = await Education.countDocuments({
            candidateId,
            isDeleted: false
        });
        if (educationCount >= 1) {
            score += 20;
        } else {
            missingFields.push('at least 1 education entry');
        }

        // 3. At least 1 experience (20%)
        const experienceCount = await Experience.countDocuments({
            candidateId,
            isDeleted: false
        });
        if (experienceCount >= 1) {
            score += 20;
        } else {
            missingFields.push('at least 1 work experience');
        }

        // 4. At least 3 skills (20%)
        const skillCount = await Skill.countDocuments({ candidateId });
        if (skillCount >= 3) {
            score += 20;
        } else {
            missingFields.push(`at least 3 skills (currently ${skillCount})`);
        }

        // 5. At least 1 resume uploaded (10%)
        const resumeCount = await Document.countDocuments({
            candidateId,
            documentType: 'resume',
            isDeleted: false
        });
        if (resumeCount >= 1) {
            score += 10;
        } else {
            missingFields.push('resume document');
        }

        // 6. Preferences filled (10%)
        if (profile.preferences &&
            profile.preferences.desiredRole &&
            profile.preferences.desiredLocation) {
            score += 10;
        } else {
            missingFields.push('career preferences (desired role and location)');
        }

        const isComplete = score >= 80;

        return { score, isComplete, missingFields };

    } catch (error) {
        throw new Error(`Failed to calculate profile completion: ${error.message}`);
    }
};

/**
 * Update profile completion score and status
 * 
 * @param {String} candidateId - The candidate's authUserId
 * @returns {Object} Updated profile with completion data
 */
const updateProfileCompletion = async (candidateId) => {
    const { score, isComplete } = await calculateProfileCompletion(candidateId);

    const updatedProfile = await CandidateProfile.findOneAndUpdate(
        { authUserId: candidateId },
        {
            profileCompletionScore: score,
            isProfileComplete: isComplete
        },
        { new: true }
    );

    return updatedProfile;
};

module.exports = {
    calculateProfileCompletion,
    updateProfileCompletion
};
