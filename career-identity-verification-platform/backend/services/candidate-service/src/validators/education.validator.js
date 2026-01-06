const Joi = require('joi');

const addEducationSchema = Joi.object({
    degree: Joi.string().trim().required(),
    fieldOfStudy: Joi.string().trim().max(100),
    institution: Joi.string().trim().required(),
    startDate: Joi.date().iso(),
    endDate: Joi.date().iso().min(Joi.ref('startDate')),
    grade: Joi.string().trim().max(50),
    description: Joi.string().trim().max(500)
});

const updateEducationSchema = Joi.object({
    degree: Joi.string().trim(),
    fieldOfStudy: Joi.string().trim().max(100),
    institution: Joi.string().trim(),
    startDate: Joi.date().iso(),
    endDate: Joi.date().iso().min(Joi.ref('startDate')),
    grade: Joi.string().trim().max(50),
    description: Joi.string().trim().max(500)
}).min(1);

module.exports = {
    addEducationSchema,
    updateEducationSchema
};
