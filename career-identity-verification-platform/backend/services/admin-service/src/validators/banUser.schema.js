const Joi = require('joi');

const schema = Joi.object({
    reason: Joi.string().required().min(5),
    duration: Joi.number().integer().min(1).optional()
});

module.exports = schema;
