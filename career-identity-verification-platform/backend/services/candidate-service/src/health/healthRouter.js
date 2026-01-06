const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');

/**
 * Basic health check
 * GET /health
 */
router.get('/health', (req, res) => {
    res.status(200).json({
        success: true,
        status: 'healthy',
        service: 'candidate-service',
        timestamp: new Date().toISOString()
    });
});

/**
 * Readiness check (includes DB connection status)
 * GET /ready
 */
router.get('/ready', (req, res) => {
    const dbState = mongoose.connection.readyState;
    const isReady = dbState === 1; // 1 = connected

    if (isReady) {
        res.status(200).json({
            success: true,
            status: 'ready',
            service: 'candidate-service',
            database: 'connected',
            timestamp: new Date().toISOString()
        });
    } else {
        res.status(503).json({
            success: false,
            status: 'not ready',
            service: 'candidate-service',
            database: 'disconnected',
            timestamp: new Date().toISOString()
        });
    }
});

module.exports = router;
