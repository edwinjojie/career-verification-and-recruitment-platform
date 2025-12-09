const express = require('express');
const router = express.Router();

const healthRouter = require('../health/healthRouter');
const metricsRouter = require('../metrics/metricsRouter');
const adminRoutes = require('./admin.routes');

// Mount foundational routes
router.use('/', healthRouter);
router.use('/', metricsRouter);

// Mount Admin API
router.use('/api/v1/admin', adminRoutes);

module.exports = router;
