const Joi = require('joi');

const addSkillSchema = Joi.object({
    skillName: Joi.string().trim().required(),
    proficiencyLevel: Joi.string().valid('beginner', 'intermediate', 'advanced', 'expert', ''),
    yearsOfExperience: Joi.number().min(0).max(50),
    isPrimary: Joi.boolean()
});

module.exports = {
    addSkillSchema
};
