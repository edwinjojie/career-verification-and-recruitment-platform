const Joi = require('joi');

const submitApplicationSchema = Joi.object({
    jobId: Joi.string().trim().required(),
    coverLetter: Joi.string().trim().max(2000),
    resumeDocumentId: Joi.string().trim()
});

module.exports = {
    submitApplicationSchema
};
