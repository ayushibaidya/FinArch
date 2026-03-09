(function createWorkspaceValidation() {
  function validateAccount(input) {
    const errors = [];

    if (!input.name || input.name.trim().length < 2) {
      errors.push('Account name must be at least 2 characters.');
    }

    if (!['checking', 'savings', 'cash', 'credit'].includes(input.type)) {
      errors.push('Account type is invalid.');
    }

    if (!Number.isFinite(Number(input.balance))) {
      errors.push('Account balance must be a valid number.');
    }

    if (!input.currency || input.currency.trim().length !== 3) {
      errors.push('Currency must be a 3-letter code.');
    }

    return {
      valid: errors.length === 0,
      errors,
    };
  }

  function validateCategory(input) {
    const errors = [];

    if (!input.name || input.name.trim().length < 2) {
      errors.push('Category name must be at least 2 characters.');
    }

    if (!['income', 'expense'].includes(input.type)) {
      errors.push('Category type is invalid.');
    }

    return {
      valid: errors.length === 0,
      errors,
    };
  }

  function validateTransaction(input) {
    const errors = [];

    if (!Number.isInteger(Number(input.accountId)) || Number(input.accountId) <= 0) {
      errors.push('Select a valid account.');
    }

    if (!Number.isInteger(Number(input.categoryId)) || Number(input.categoryId) <= 0) {
      errors.push('Select a valid category.');
    }

    if (!['income', 'expense'].includes(input.type)) {
      errors.push('Transaction type is invalid.');
    }

    if (!Number.isFinite(Number(input.amount)) || Number(input.amount) <= 0) {
      errors.push('Amount must be greater than 0.');
    }

    if (!input.transactionDate) {
      errors.push('Transaction date is required.');
    }

    return {
      valid: errors.length === 0,
      errors,
    };
  }

  window.finarchWorkspaceValidation = {
    validateAccount,
    validateCategory,
    validateTransaction,
  };
})();
