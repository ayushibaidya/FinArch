const express = require('express');
const authMiddleware = require('../../middleware/auth.middleware');
const authRoutes = require('./auth.routes');
const accountRoutes = require('./accounts.routes');
const categoryRoutes = require('./categories.routes');
const transactionRoutes = require('./transactions.routes');

const router = express.Router();

router.use('/auth', authRoutes);
router.use('/accounts', authMiddleware, accountRoutes);
router.use('/categories', authMiddleware, categoryRoutes);
router.use('/transactions', authMiddleware, transactionRoutes);

module.exports = router;
