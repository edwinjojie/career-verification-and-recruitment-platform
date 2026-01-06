const Education = require('../models/Education.model');
const AppError = require('../errors/AppError');
const { updateProfileCompletion } = require('../services/profileCompletionService');
const { logActivity } = require('../services/activityLogService');

/**
 * Add education entry
 * POST /api/v1/candidate/education
 */
const addEducation = async (req, res, next) => {
    try {
        const candidateId = req.user.userId;
        const educationData = { ...req.body, candidateId };

        const education = await Education.create(educationData);

        // Update profile completion
        await updateProfileCompletion(candidateId);

        // Log activity
        await logActivity(candidateId, 'education_added', { educationId: education._id }, req);

        res.status(201).json({
            success: true,
            message: 'Education added successfully',
            data: { education }
        });

    } catch (error) {
        next(error);
    }
};

/**
 * Update education entry
 * PATCH /api/v1/candidate/education/:educationId
 */
const updateEducation = async (req, res, next) => {
    try {
        const candidateId = req.user.userId;
        const { educationId } = req.params;
        const updates = req.body;

        const education = await Education.findOneAndUpdate(
            { _id: educationId, candidateId, isDeleted: false },
            { $set: updates },
            { new: true, runValidators: true }
        );

        if (!education) {
            throw new AppError('Education entry not found', 404, 'EDUCATION_NOT_FOUND');
        }

        // Log activity
        await logActivity(candidateId, 'education_updated', { educationId, fields: Object.keys(updates) }, req);

        res.status(200).json({
            success: true,
            message: 'Education updated successfully',
            data: { education }
        });

    } catch (error) {
        next(error);
    }
};

/**
 * Delete education entry (soft delete)
 * DELETE /api/v1/candidate/education/:educationId
 */
const deleteEducation = async (req, res, next) => {
    try {
        const candidateId = req.user.userId;
        const { educationId } = req.params;

        const education = await Education.findOneAndUpdate(
            { _id: educationId, candidateId, isDeleted: false },
            { isDeleted: true },
            { new: true }
        );

        if (!education) {
            throw new AppError('Education entry not found', 404, 'EDUCATION_NOT_FOUND');
        }

        // Update profile completion
        await updateProfileCompletion(candidateId);

        // Log activity
        await logActivity(candidateId, 'education_deleted', { educationId }, req);

        res.status(200).json({
            success: true,
            message: 'Education deleted successfully'
        });

    } catch (error) {
        next(error);
    }
};

module.exports = {
    addEducation,
    updateEducation,
    deleteEducation
};
