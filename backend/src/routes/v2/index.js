const express = require('express');
const authMiddleware = require('../../middleware/auth.middleware');
const analyticsRoutes = require('./analytics.routes');

const router = express.Router();

router.use('/analytics', authMiddleware, analyticsRoutes);

module.exports = router;
