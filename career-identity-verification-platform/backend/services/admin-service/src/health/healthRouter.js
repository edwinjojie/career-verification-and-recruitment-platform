const express = require('express');
const authInternalClient = require('../services/authInternalClient');
const router = express.Router();

router.get('/health', (req, res) => {
    res.json({ status: 'UP', timestamp: new Date() });
});

router.get('/ready', async (req, res) => {
    const authUp = await authInternalClient.healthCheck();

    // TODO: Add database connection check result
    const dbUp = true; // Placeholder

    if (dbUp && authUp) {
        res.json({ status: 'READY', services: { db: 'ok', authService: 'up' } });
    } else {
        res.status(503).json({
            status: 'NOT_READY',
            services: {
                db: dbUp ? 'ok' : 'down',
                authService: authUp ? 'up' : 'down'
            }
        });
    }
});

module.exports = router;
