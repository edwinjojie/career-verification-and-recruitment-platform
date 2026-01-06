const Joi = require('joi');

const uploadDocumentSchema = Joi.object({
    documentType: Joi.string().valid('resume', 'certificate', 'id_proof', 'portfolio').required(),
    fileName: Joi.string().trim().required(),
    fileSize: Joi.number().min(0).max(10485760), // 10MB max
    mimeType: Joi.string().trim(),
    storageUrl: Joi.string().trim()
});

module.exports = {
    uploadDocumentSchema
};
