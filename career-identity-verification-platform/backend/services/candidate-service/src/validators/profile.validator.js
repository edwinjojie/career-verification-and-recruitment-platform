const Joi = require('joi');

const updateProfileSchema = Joi.object({
    firstName: Joi.string().trim().max(50),
    lastName: Joi.string().trim().max(50),
    phone: Joi.string().trim().pattern(/^[+]?[(]?[0-9]{1,4}[)]?[-\s.]?[(]?[0-9]{1,4}[)]?[-\s.]?[0-9]{1,9}$/),
    location: Joi.object({
        city: Joi.string().trim().max(100),
        state: Joi.string().trim().max(100),
        country: Joi.string().trim().max(100)
    }),
    headline: Joi.string().trim().max(100),
    summary: Joi.string().trim().max(1000),
    preferences: Joi.object({
        desiredRole: Joi.string().trim().max(100),
        desiredLocation: Joi.string().trim().max(100),
        salaryRange: Joi.object({
            min: Joi.number().min(0),
            max: Joi.number().min(0),
            currency: Joi.string().trim().max(10).default('USD')
        }),
        workType: Joi.string().valid('remote', 'hybrid', 'onsite', '')
    })
}).min(1); // At least one field must be provided

module.exports = {
    updateProfileSchema
};
