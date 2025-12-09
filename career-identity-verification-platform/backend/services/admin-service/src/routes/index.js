const express = require('express');
const router = express.Router();

const healthRouter = require('../health/healthRouter');
const metricsRouter = require('../metrics/metricsRouter');

// Mount foundational routes
router.use('/', healthRouter);
router.use('/', metricsRouter);

// Placeholder for Admin API
const adminRouter = express.Router();
// adminRouter.use(require('../middleware/verifyJwt'));
// adminRouter.use(require('../middleware/requireAdmin'));
// adminRouter.post('/recruiters', authController.createRecruiter);

router.use('/api/v1/admin', adminRouter);

module.exports = router;
