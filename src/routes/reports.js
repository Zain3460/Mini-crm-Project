const express = require('express');
const router = express.Router();
const reportService = require('../services/reportService');

router.get('/stats', async (req, res, next) => {
    try {
        const stats = await reportService.getGeneralStats();
        res.json(stats);
    } catch (error) {
        next(error);
    }
});

router.get('/top-customers', async (req, res, next) => {
    try {
        const limit = req.query.limit ? parseInt(req.query.limit) : 5;
        const topCustomers = await reportService.getTopCustomers(limit);
        res.json(topCustomers);
    } catch (error) {
        next(error);
    }
});

module.exports = router;
