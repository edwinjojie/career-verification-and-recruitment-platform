const Experience = require('../models/Experience.model');
const AppError = require('../errors/AppError');
const { updateProfileCompletion } = require('../services/profileCompletionService');
const { logActivity } = require('../services/activityLogService');

/**
 * Add experience entry
 * POST /api/v1/candidate/experience
 */
const addExperience = async (req, res, next) => {
    try {
        const candidateId = req.user.userId;
        const experienceData = { ...req.body, candidateId };

        const experience = await Experience.create(experienceData);

        // Update profile completion
        await updateProfileCompletion(candidateId);

        // Log activity
        await logActivity(candidateId, 'experience_added', { experienceId: experience._id }, req);

        res.status(201).json({
            success: true,
            message: 'Experience added successfully',
            data: { experience }
        });

    } catch (error) {
        next(error);
    }
};

/**
 * Update experience entry
 * PATCH /api/v1/candidate/experience/:experienceId
 */
const updateExperience = async (req, res, next) => {
    try {
        const candidateId = req.user.userId;
        const { experienceId } = req.params;
        const updates = req.body;

        const experience = await Experience.findOneAndUpdate(
            { _id: experienceId, candidateId, isDeleted: false },
            { $set: updates },
            { new: true, runValidators: true }
        );

        if (!experience) {
            throw new AppError('Experience entry not found', 404, 'EXPERIENCE_NOT_FOUND');
        }

        // Log activity
        await logActivity(candidateId, 'experience_updated', { experienceId, fields: Object.keys(updates) }, req);

        res.status(200).json({
            success: true,
            message: 'Experience updated successfully',
            data: { experience }
        });

    } catch (error) {
        next(error);
    }
};

/**
 * Delete experience entry (soft delete)
 * DELETE /api/v1/candidate/experience/:experienceId
 */
const deleteExperience = async (req, res, next) => {
    try {
        const candidateId = req.user.userId;
        const { experienceId } = req.params;

        const experience = await Experience.findOneAndUpdate(
            { _id: experienceId, candidateId, isDeleted: false },
            { isDeleted: true },
            { new: true }
        );

        if (!experience) {
            throw new AppError('Experience entry not found', 404, 'EXPERIENCE_NOT_FOUND');
        }

        // Update profile completion
        await updateProfileCompletion(candidateId);

        // Log activity
        await logActivity(candidateId, 'experience_deleted', { experienceId }, req);

        res.status(200).json({
            success: true,
            message: 'Experience deleted successfully'
        });

    } catch (error) {
        next(error);
    }
};

module.exports = {
    addExperience,
    updateExperience,
    deleteExperience
};
