const express = require('express');
const router = express.Router();

const healthRouter = require('../health/healthRouter');
const metricsRouter = require('../metrics/metricsRouter');

// Candidate API routes
const profileRoutes = require('./profile.routes');
const educationRoutes = require('./education.routes');
const experienceRoutes = require('./experience.routes');
const skillRoutes = require('./skill.routes');
const certificationRoutes = require('./certification.routes');
const documentRoutes = require('./document.routes');
const applicationRoutes = require('./application.routes');
const activityRoutes = require('./activity.routes');
const adminRoutes = require('./admin.routes');

// Mount foundational routes
router.use('/', healthRouter);
router.use('/', metricsRouter);

// Mount Candidate API routes
router.use('/api/v1/candidate/profile', profileRoutes);
router.use('/api/v1/candidate/education', educationRoutes);
router.use('/api/v1/candidate/experience', experienceRoutes);
router.use('/api/v1/candidate/skills', skillRoutes);
router.use('/api/v1/candidate/certifications', certificationRoutes);
router.use('/api/v1/candidate/documents', documentRoutes);
router.use('/api/v1/candidate/applications', applicationRoutes);
router.use('/api/v1/candidate/activity', activityRoutes);

// Mount Internal Admin routes
router.use('/internal/candidate', adminRoutes);

module.exports = router;
