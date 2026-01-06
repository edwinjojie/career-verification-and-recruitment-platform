const express = require('express');
const router = express.Router();
const applicationController = require('../controllers/applicationController');
const verifyJwt = require('../middleware/verifyJwt');
const requireCandidate = require('../middleware/requireCandidate');
const validateRequest = require('../middleware/validateRequest');
const { submitApplicationSchema } = require('../validators/application.validator');

// Apply authentication middleware
router.use(verifyJwt);
router.use(requireCandidate);

// Application routes
router.post('/', validateRequest(submitApplicationSchema), applicationController.submitApplication);
router.get('/', applicationController.listApplications);
router.get('/:applicationId', applicationController.getApplicationDetails);

module.exports = router;
