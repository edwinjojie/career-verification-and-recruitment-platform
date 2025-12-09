const express = require('express');
const router = express.Router();

router.get('/metrics', (req, res) => {
    res.set('Content-Type', 'text/plain');
    res.send('# HELP admin_service_up Service up status\n# TYPE admin_service_up gauge\nadmin_service_up 1\n');
});

module.exports = router;
