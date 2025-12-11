const express = require('express');
const authController = require('../controllers/authController');
const authMiddleware = require('../middleware/authMiddleware');

const router = express.Router();

router.post('/internal/register', authMiddleware.requireInternalSecret, authController.internalRegister);
router.get('/internal/users', authMiddleware.requireInternalSecret, authController.internalGetUsers);
router.patch('/internal/users/:id/role', authMiddleware.requireInternalSecret, authController.internalUpdateUserRole);
router.patch('/internal/users/:id/ban', authMiddleware.requireInternalSecret, authController.internalBanUser);
router.get('/internal/health', authController.internalHealth); // Health check usually public or internal-secret protected, making it public/semi-public or just verify it works

router.post('/register', authController.register);
router.get('/verify-email', authController.verifyEmail);
router.post('/login', authController.login);
router.post('/refresh', authController.refreshToken);
router.post('/logout', authController.logout);
router.get('/me', authMiddleware.protect, authController.getMe);

module.exports = router;
