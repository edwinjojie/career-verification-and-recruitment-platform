const express = require('express');
const router = express.Router();
const adminController = require('../controllers/adminController');

// Note: In production, these routes should be protected with internal service secret
// For now, they are accessible but should only be called by other internal services

// Admin routes
router.get('/:candidateId', adminController.adminGetCandidateProfile);
router.patch('/documents/:documentId/verify', adminController.adminVerifyDocument);

module.exports = router;
