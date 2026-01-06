const Joi = require('joi');

const addCertificationSchema = Joi.object({
    name: Joi.string().trim().required(),
    issuingOrganization: Joi.string().trim().required(),
    issueDate: Joi.date().iso(),
    expiryDate: Joi.date().iso().min(Joi.ref('issueDate')),
    credentialId: Joi.string().trim().max(100),
    credentialUrl: Joi.string().trim().uri()
});

module.exports = {
    addCertificationSchema
};
