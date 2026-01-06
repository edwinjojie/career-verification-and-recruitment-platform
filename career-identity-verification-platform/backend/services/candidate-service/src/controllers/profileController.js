const CandidateProfile = require('../models/CandidateProfile.model');
const Education = require('../models/Education.model');
const Experience = require('../models/Experience.model');
const Skill = require('../models/Skill.model');
const Certification = require('../models/Certification.model');
const Document = require('../models/Document.model');
const AppError = require('../errors/AppError');
const { calculateProfileCompletion, updateProfileCompletion } = require('../services/profileCompletionService');
const { logActivity } = require('../services/activityLogService');

/**
 * Initialize candidate profile (idempotent)
 * POST /api/v1/candidate/profile/init
 */
const initProfile = async (req, res, next) => {
    try {
        const candidateId = req.user.userId; // From JWT

        // Check if profile already exists
        let profile = await CandidateProfile.findOne({ authUserId: candidateId });

        if (profile) {
            return res.status(200).json({
                success: true,
                message: 'Profile already exists',
                data: { profile }
            });
        }

        // Create new profile
        profile = await CandidateProfile.create({
            authUserId: candidateId
        });

        // Log activity
        await logActivity(candidateId, 'profile_created', {}, req, 'system');

        res.status(201).json({
            success: true,
            message: 'Profile initialized successfully',
            data: { profile }
        });

    } catch (error) {
        next(error);
    }
};

/**
 * Get full candidate profile
 * GET /api/v1/candidate/profile
 */
const getProfile = async (req, res, next) => {
    try {
        const candidateId = req.user.userId;

        const profile = await CandidateProfile.findOne({ authUserId: candidateId });

        if (!profile) {
            throw new AppError('Profile not found', 404, 'PROFILE_NOT_FOUND');
        }

        // Fetch related data
        const education = await Education.find({ candidateId, isDeleted: false }).sort({ startDate: -1 });
        const experience = await Experience.find({ candidateId, isDeleted: false }).sort({ startDate: -1 });
        const skills = await Skill.find({ candidateId }).sort({ isPrimary: -1, skillName: 1 });
        const certifications = await Certification.find({ candidateId, isDeleted: false }).sort({ issueDate: -1 });
        const documents = await Document.find({ candidateId, isDeleted: false }).sort({ uploadedAt: -1 });

        res.status(200).json({
            success: true,
            data: {
                profile,
                education,
                experience,
                skills,
                certifications,
                documents
            }
        });

    } catch (error) {
        next(error);
    }
};

/**
 * Update profile core info
 * PATCH /api/v1/candidate/profile
 */
const updateProfile = async (req, res, next) => {
    try {
        const candidateId = req.user.userId;
        const updates = req.body;

        const profile = await CandidateProfile.findOneAndUpdate(
            { authUserId: candidateId },
            { $set: updates },
            { new: true, runValidators: true }
        );

        if (!profile) {
            throw new AppError('Profile not found', 404, 'PROFILE_NOT_FOUND');
        }

        // Recalculate completion
        await updateProfileCompletion(candidateId);

        // Log activity
        await logActivity(candidateId, 'profile_updated', { fields: Object.keys(updates) }, req);

        res.status(200).json({
            success: true,
            message: 'Profile updated successfully',
            data: { profile }
        });

    } catch (error) {
        next(error);
    }
};

/**
 * Get profile completion status
 * GET /api/v1/candidate/profile/status
 */
const getProfileStatus = async (req, res, next) => {
    try {
        const candidateId = req.user.userId;

        const completionData = await calculateProfileCompletion(candidateId);

        res.status(200).json({
            success: true,
            data: completionData
        });

    } catch (error) {
        next(error);
    }
};

/**
 * Mark profile as complete (validates criteria)
 * POST /api/v1/candidate/profile/complete
 */
const markProfileComplete = async (req, res, next) => {
    try {
        const candidateId = req.user.userId;

        const { score, isComplete, missingFields } = await calculateProfileCompletion(candidateId);

        if (!isComplete) {
            return res.status(400).json({
                success: false,
                error: {
                    code: 'PROFILE_INCOMPLETE',
                    message: 'Profile does not meet completion criteria',
                    details: {
                        score,
                        missingFields
                    }
                }
            });
        }

        const profile = await CandidateProfile.findOneAndUpdate(
            { authUserId: candidateId },
            {
                isProfileComplete: true,
                profileCompletionScore: score
            },
            { new: true }
        );

        // Log activity
        await logActivity(candidateId, 'profile_completed', { score }, req);

        res.status(200).json({
            success: true,
            message: 'Profile marked as complete',
            data: { profile }
        });

    } catch (error) {
        next(error);
    }
};

/**
 * Deactivate profile
 * POST /api/v1/candidate/profile/deactivate
 */
const deactivateProfile = async (req, res, next) => {
    try {
        const candidateId = req.user.userId;

        const profile = await CandidateProfile.findOneAndUpdate(
            { authUserId: candidateId },
            { isActive: false },
            { new: true }
        );

        if (!profile) {
            throw new AppError('Profile not found', 404, 'PROFILE_NOT_FOUND');
        }

        // Log activity
        await logActivity(candidateId, 'profile_deactivated', {}, req);

        res.status(200).json({
            success: true,
            message: 'Profile deactivated successfully',
            data: { profile }
        });

    } catch (error) {
        next(error);
    }
};

module.exports = {
    initProfile,
    getProfile,
    updateProfile,
    getProfileStatus,
    markProfileComplete,
    deactivateProfile
};
