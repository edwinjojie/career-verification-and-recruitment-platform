const express = require('express');
const router = express.Router();

const adminController = require('../controllers/adminController');
const verifyJwt = require('../middleware/verifyJwt');
const requireAdmin = require('../middleware/requireAdmin');
const validateRequest = require('../middleware/validateRequest');

// Schema Validators
const createRecruiterSchema = require('../validators/createRecruiter.schema');
const createAdminSchema = require('../validators/createAdmin.schema');
const updateRoleSchema = require('../validators/updateRole.schema');
const banUserSchema = require('../validators/banUser.schema');

// Apply Global Admin Guards
router.use(verifyJwt);
router.use(requireAdmin);

// 1. Recruiter Management
router.post('/recruiters',
    validateRequest(createRecruiterSchema),
    adminController.createRecruiter
);

router.get('/recruiters/pending', adminController.listPendingRecruiters);

// New Approval Route
router.patch('/recruiters/:id/approve', adminController.approveRecruiter);


// 2. Admin Management
router.post('/admins',
    validateRequest(createAdminSchema),
    adminController.createAdmin
);

// 3. User Role / Ban Management
router.get('/users', adminController.listUsers);

router.patch('/users/:id/role',
    validateRequest(updateRoleSchema),
    adminController.updateRole
);

router.patch('/users/:id/ban',
    validateRequest(banUserSchema),
    adminController.banUser
);

// 4. Audit Logs
router.get('/audit', adminController.listAuditLogs);

module.exports = router;
