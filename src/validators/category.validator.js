const allowedTypes = ['income', 'expense'];

const validateCreateCategory = (req) => {
  const { name, type } = req.body;
  const errors = [];

  if (!name || typeof name !== 'string' || name.trim().length < 2) {
    errors.push('name must be at least 2 characters');
  }

  if (!allowedTypes.includes(type)) {
    errors.push(`type must be one of: ${allowedTypes.join(', ')}`);
  }

  return {
    valid: errors.length === 0,
    errors,
    value: {
      name: typeof name === 'string' ? name.trim() : name,
      type,
    },
  };
};

module.exports = {
  validateCreateCategory,
};
