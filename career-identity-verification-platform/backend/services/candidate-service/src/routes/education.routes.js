const express = require('express');
const router = express.Router();
const educationController = require('../controllers/educationController');
const verifyJwt = require('../middleware/verifyJwt');
const requireCandidate = require('../middleware/requireCandidate');
const validateRequest = require('../middleware/validateRequest');
const { addEducationSchema, updateEducationSchema } = require('../validators/education.validator');

// Apply authentication middleware
router.use(verifyJwt);
router.use(requireCandidate);

// Education routes
router.post('/', validateRequest(addEducationSchema), educationController.addEducation);
router.patch('/:educationId', validateRequest(updateEducationSchema), educationController.updateEducation);
router.delete('/:educationId', educationController.deleteEducation);

module.exports = router;
