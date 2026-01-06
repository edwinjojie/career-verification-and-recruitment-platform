const express = require('express');
const router = express.Router();
const documentController = require('../controllers/documentController');
const verifyJwt = require('../middleware/verifyJwt');
const requireCandidate = require('../middleware/requireCandidate');
const validateRequest = require('../middleware/validateRequest');
const { uploadDocumentSchema } = require('../validators/document.validator');

// Apply authentication middleware
router.use(verifyJwt);
router.use(requireCandidate);

// Document routes
router.post('/', validateRequest(uploadDocumentSchema), documentController.uploadDocument);
router.get('/', documentController.listDocuments);
router.delete('/:documentId', documentController.deleteDocument);

module.exports = router;
