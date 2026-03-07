const express = require('express');
const asyncHandler = require('../../utils/asyncHandler');
const validate = require('../../middleware/validate.middleware');
const analyticsController = require('../../controllers/analytics.controller');
const { validateAnalyticsRange } = require('../../validators/analytics.validator');

const router = express.Router();

router.get('/monthly-summary', validate(validateAnalyticsRange), asyncHandler(analyticsController.monthlySummary));
router.get('/category-breakdown', validate(validateAnalyticsRange), asyncHandler(analyticsController.categoryBreakdown));

module.exports = router;
