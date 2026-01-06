const express = require('express');
const router = express.Router();
const certificationController = require('../controllers/certificationController');
const verifyJwt = require('../middleware/verifyJwt');
const requireCandidate = require('../middleware/requireCandidate');
const validateRequest = require('../middleware/validateRequest');
const { addCertificationSchema } = require('../validators/certification.validator');

// Apply authentication middleware
router.use(verifyJwt);
router.use(requireCandidate);

// Certification routes
router.post('/', validateRequest(addCertificationSchema), certificationController.addCertification);
router.delete('/:certificationId', certificationController.removeCertification);

module.exports = router;
