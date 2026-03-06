const allowedTypes = ['income', 'expense'];

const validateCreateTransaction = (req) => {
  const { accountId, categoryId, type, amount, description, transactionDate } = req.body;
  const errors = [];

  if (!Number.isInteger(Number(accountId)) || Number(accountId) <= 0) {
    errors.push('accountId must be a positive integer');
  }

  if (!Number.isInteger(Number(categoryId)) || Number(categoryId) <= 0) {
    errors.push('categoryId must be a positive integer');
  }

  if (!allowedTypes.includes(type)) {
    errors.push(`type must be one of: ${allowedTypes.join(', ')}`);
  }

  if (Number.isNaN(Number(amount)) || Number(amount) <= 0) {
    errors.push('amount must be a positive number');
  }

  if (transactionDate && Number.isNaN(Date.parse(transactionDate))) {
    errors.push('transactionDate must be a valid date');
  }

  if (description && typeof description !== 'string') {
    errors.push('description must be a string');
  }

  return {
    valid: errors.length === 0,
    errors,
    value: {
      accountId: Number(accountId),
      categoryId: Number(categoryId),
      type,
      amount: Number(amount),
      description,
      transactionDate: transactionDate || new Date().toISOString().slice(0, 10),
    },
  };
};

const validateTransactionQuery = (req) => {
  const { page, limit, type, accountId, categoryId, startDate, endDate } = req.query;
  const errors = [];

  if (type && !allowedTypes.includes(type)) {
    errors.push(`type must be one of: ${allowedTypes.join(', ')}`);
  }

  if (accountId && (!Number.isInteger(Number(accountId)) || Number(accountId) <= 0)) {
    errors.push('accountId must be a positive integer');
  }

  if (categoryId && (!Number.isInteger(Number(categoryId)) || Number(categoryId) <= 0)) {
    errors.push('categoryId must be a positive integer');
  }

  if (startDate && Number.isNaN(Date.parse(startDate))) {
    errors.push('startDate must be a valid date');
  }

  if (endDate && Number.isNaN(Date.parse(endDate))) {
    errors.push('endDate must be a valid date');
  }

  if (page && (!Number.isInteger(Number(page)) || Number(page) < 1)) {
    errors.push('page must be a positive integer');
  }

  if (limit && (!Number.isInteger(Number(limit)) || Number(limit) < 1 || Number(limit) > 100)) {
    errors.push('limit must be between 1 and 100');
  }

  return {
    valid: errors.length === 0,
    errors,
    value: {
      page: page ? Number(page) : undefined,
      limit: limit ? Number(limit) : undefined,
      type,
      accountId: accountId ? Number(accountId) : undefined,
      categoryId: categoryId ? Number(categoryId) : undefined,
      startDate,
      endDate,
    },
  };
};

module.exports = {
  validateCreateTransaction,
  validateTransactionQuery,
};
