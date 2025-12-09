const Joi = require('joi');

const schema = Joi.object({
    fullName: Joi.string().required().min(3).max(100),
    email: Joi.string().email().required(),
    department: Joi.string().optional(),
    phone: Joi.string().pattern(/^[0-9+]+$/).optional()
});

module.exports = schema;
