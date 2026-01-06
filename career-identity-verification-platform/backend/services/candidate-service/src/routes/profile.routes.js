const express = require('express');
const router = express.Router();
const profileController = require('../controllers/profileController');
const verifyJwt = require('../middleware/verifyJwt');
const requireCandidate = require('../middleware/requireCandidate');
const validateRequest = require('../middleware/validateRequest');
const { updateProfileSchema } = require('../validators/profile.validator');

// Apply authentication middleware to all routes
router.use(verifyJwt);
router.use(requireCandidate);

// Profile routes
router.post('/init', profileController.initProfile);
router.get('/', profileController.getProfile);
router.patch('/', validateRequest(updateProfileSchema), profileController.updateProfile);
router.get('/status', profileController.getProfileStatus);
router.post('/complete', profileController.markProfileComplete);
router.post('/deactivate', profileController.deactivateProfile);

module.exports = router;
