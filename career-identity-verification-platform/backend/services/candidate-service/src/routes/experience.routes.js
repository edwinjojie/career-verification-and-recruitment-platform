const express = require('express');
const router = express.Router();
const experienceController = require('../controllers/experienceController');
const verifyJwt = require('../middleware/verifyJwt');
const requireCandidate = require('../middleware/requireCandidate');
const validateRequest = require('../middleware/validateRequest');
const { addExperienceSchema, updateExperienceSchema } = require('../validators/experience.validator');

// Apply authentication middleware
router.use(verifyJwt);
router.use(requireCandidate);

// Experience routes
router.post('/', validateRequest(addExperienceSchema), experienceController.addExperience);
router.patch('/:experienceId', validateRequest(updateExperienceSchema), experienceController.updateExperience);
router.delete('/:experienceId', experienceController.deleteExperience);

module.exports = router;
