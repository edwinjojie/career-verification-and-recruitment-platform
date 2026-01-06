const express = require('express');
const router = express.Router();
const skillController = require('../controllers/skillController');
const verifyJwt = require('../middleware/verifyJwt');
const requireCandidate = require('../middleware/requireCandidate');
const validateRequest = require('../middleware/validateRequest');
const { addSkillSchema } = require('../validators/skill.validator');

// Apply authentication middleware
router.use(verifyJwt);
router.use(requireCandidate);

// Skill routes
router.post('/', validateRequest(addSkillSchema), skillController.addSkill);
router.delete('/:skillId', skillController.removeSkill);

module.exports = router;
