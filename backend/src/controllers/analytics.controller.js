const analyticsService = require('../services/analytics.service');

const monthlySummary = async (req, res) => {
  const result = await analyticsService.getMonthlySummary(req.user.id, req.validated);
  res.status(200).json(result);
};

const categoryBreakdown = async (req, res) => {
  const result = await analyticsService.getCategoryBreakdown(req.user.id, req.validated);
  res.status(200).json(result);
};

module.exports = {
  monthlySummary,
  categoryBreakdown,
};
