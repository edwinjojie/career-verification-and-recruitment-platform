const express = require('express');
const router = express.Router();
const activityController = require('../controllers/activityController');
const verifyJwt = require('../middleware/verifyJwt');
const requireCandidate = require('../middleware/requireCandidate');

// Apply authentication middleware
router.use(verifyJwt);
router.use(requireCandidate);

// Activity routes
router.get('/', activityController.listActivity);

module.exports = router;
