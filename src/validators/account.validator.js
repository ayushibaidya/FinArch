const allowedTypes = ['checking', 'savings', 'cash', 'credit'];

const validateCreateAccount = (req) => {
  const { name, type, balance = 0, currency = 'USD' } = req.body;
  const errors = [];

  if (!name || typeof name !== 'string' || name.trim().length < 2) {
    errors.push('name must be at least 2 characters');
  }

  if (!allowedTypes.includes(type)) {
    errors.push(`type must be one of: ${allowedTypes.join(', ')}`);
  }

  if (Number.isNaN(Number(balance))) {
    errors.push('balance must be a number');
  }

  if (!currency || typeof currency !== 'string' || currency.trim().length !== 3) {
    errors.push('currency must be a 3-letter code');
  }

  return {
    valid: errors.length === 0,
    errors,
    value: {
      name: typeof name === 'string' ? name.trim() : name,
      type,
      balance: Number(balance),
      currency: typeof currency === 'string' ? currency.trim().toUpperCase() : currency,
    },
  };
};

const validateReplaceAccount = (req) => {
  const id = Number(req.params.id);
  const { name, type, balance, currency } = req.body;
  const errors = [];

  if (!Number.isInteger(id) || id <= 0) errors.push('id must be a positive integer');
  if (!name || typeof name !== 'string' || name.trim().length < 2) errors.push('name must be at least 2 characters');
  if (!allowedTypes.includes(type)) errors.push(`type must be one of: ${allowedTypes.join(', ')}`);
  if (Number.isNaN(Number(balance))) errors.push('balance must be a number');
  if (!currency || typeof currency !== 'string' || currency.trim().length !== 3) errors.push('currency must be a 3-letter code');

  return {
    valid: errors.length === 0,
    errors,
    value: {
      id,
      name: name?.trim(),
      type,
      balance: Number(balance),
      currency: currency?.trim().toUpperCase(),
    },
  };
};

const validatePatchAccount = (req) => {
  const id = Number(req.params.id);
  const { name, type, balance, currency } = req.body;
  const errors = [];
  const value = { id };
  let hasAny = false;

  if (!Number.isInteger(id) || id <= 0) errors.push('id must be a positive integer');

  if (name !== undefined) {
    hasAny = true;
    if (typeof name !== 'string' || name.trim().length < 2) errors.push('name must be at least 2 characters');
    else value.name = name.trim();
  }

  if (type !== undefined) {
    hasAny = true;
    if (!allowedTypes.includes(type)) errors.push(`type must be one of: ${allowedTypes.join(', ')}`);
    else value.type = type;
  }

  if (balance !== undefined) {
    hasAny = true;
    if (Number.isNaN(Number(balance))) errors.push('balance must be a number');
    else value.balance = Number(balance);
  }

  if (currency !== undefined) {
    hasAny = true;
    if (typeof currency !== 'string' || currency.trim().length !== 3) errors.push('currency must be a 3-letter code');
    else value.currency = currency.trim().toUpperCase();
  }

  if (!hasAny) errors.push('At least one field must be provided');

  return { valid: errors.length === 0, errors, value };
};

const validateAccountIdParam = (req) => {
  const id = Number(req.params.id);
  const errors = [];

  if (!Number.isInteger(id) || id <= 0) {
    errors.push('id must be a positive integer');
  }

  return {
    valid: errors.length === 0,
    errors,
    value: { id },
  };
};

module.exports = {
  validateCreateAccount,
  validateAccountIdParam,
  validateReplaceAccount,
  validatePatchAccount,
};
