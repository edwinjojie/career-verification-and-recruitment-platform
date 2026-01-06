const Skill = require('../models/Skill.model');
const AppError = require('../errors/AppError');
const { updateProfileCompletion } = require('../services/profileCompletionService');
const { logActivity } = require('../services/activityLogService');

/**
 * Add skill
 * POST /api/v1/candidate/skills
 */
const addSkill = async (req, res, next) => {
    try {
        const candidateId = req.user.userId;
        const skillData = { ...req.body, candidateId };

        const skill = await Skill.create(skillData);

        // Update profile completion
        await updateProfileCompletion(candidateId);

        // Log activity
        await logActivity(candidateId, 'skill_added', { skillId: skill._id, skillName: skill.skillName }, req);

        res.status(201).json({
            success: true,
            message: 'Skill added successfully',
            data: { skill }
        });

    } catch (error) {
        // Handle duplicate skill error
        if (error.code === 11000) {
            return next(new AppError('Skill already exists', 400, 'DUPLICATE_SKILL'));
        }
        next(error);
    }
};

/**
 * Remove skill
 * DELETE /api/v1/candidate/skills/:skillId
 */
const removeSkill = async (req, res, next) => {
    try {
        const candidateId = req.user.userId;
        const { skillId } = req.params;

        const skill = await Skill.findOneAndDelete({ _id: skillId, candidateId });

        if (!skill) {
            throw new AppError('Skill not found', 404, 'SKILL_NOT_FOUND');
        }

        // Update profile completion
        await updateProfileCompletion(candidateId);

        // Log activity
        await logActivity(candidateId, 'skill_removed', { skillId, skillName: skill.skillName }, req);

        res.status(200).json({
            success: true,
            message: 'Skill removed successfully'
        });

    } catch (error) {
        next(error);
    }
};

module.exports = {
    addSkill,
    removeSkill
};
