const validateAnalyticsRange = (req) => {
  const { from, to } = req.query;
  const errors = [];

  if (from && Number.isNaN(Date.parse(from))) {
    errors.push('from must be a valid date');
  }

  if (to && Number.isNaN(Date.parse(to))) {
    errors.push('to must be a valid date');
  }

  return {
    valid: errors.length === 0,
    errors,
    value: { from, to },
  };
};

module.exports = {
  validateAnalyticsRange,
};
