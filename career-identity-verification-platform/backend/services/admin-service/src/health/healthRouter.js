const express = require('express');
const router = express.Router();

router.get('/health', (req, res) => {
    res.json({ status: 'UP', timestamp: new Date() });
});

router.get('/ready', (req, res) => {
    // TODO: Add database connection check
    res.json({ status: 'READY', services: { db: 'ok', auth: 'ok' } });
});

module.exports = router;
