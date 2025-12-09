const Joi = require('joi');

const schema = Joi.object({
    newRole: Joi.string().valid('candidate', 'recruiter', 'executive', 'admin').required()
});

module.exports = schema;
