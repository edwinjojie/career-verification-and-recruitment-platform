const Joi = require('joi');

const addExperienceSchema = Joi.object({
    company: Joi.string().trim().required(),
    title: Joi.string().trim().required(),
    employmentType: Joi.string().valid('full-time', 'part-time', 'contract', 'internship', 'freelance', ''),
    location: Joi.string().trim().max(100),
    startDate: Joi.date().iso().required(),
    endDate: Joi.date().iso().min(Joi.ref('startDate')),
    description: Joi.string().trim().max(2000),
    isCurrentRole: Joi.boolean()
});

const updateExperienceSchema = Joi.object({
    company: Joi.string().trim(),
    title: Joi.string().trim(),
    employmentType: Joi.string().valid('full-time', 'part-time', 'contract', 'internship', 'freelance', ''),
    location: Joi.string().trim().max(100),
    startDate: Joi.date().iso(),
    endDate: Joi.date().iso().min(Joi.ref('startDate')),
    description: Joi.string().trim().max(2000),
    isCurrentRole: Joi.boolean()
}).min(1);

module.exports = {
    addExperienceSchema,
    updateExperienceSchema
};
