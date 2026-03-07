const db = require('../config/db');
const accountRepository = require('../repositories/account.repository');
const categoryRepository = require('../repositories/category.repository');
const transactionRepository = require('../repositories/transaction.repository');
const HttpError = require('../utils/httpError');

const createTransaction = async (userId, payload) => {
  return db.withTransaction(async (client) => {
    const account = await accountRepository.getByIdForUser(payload.accountId, userId, client);
    if (!account) {
      throw new HttpError(404, 'Account not found');
    }

    const category = await categoryRepository.getByIdForUser(payload.categoryId, userId, client);
    if (!category) {
      throw new HttpError(404, 'Category not found');
    }

    if (category.type !== payload.type) {
      throw new HttpError(400, 'Category type must match transaction type');
    }

    const currentBalance = Number(account.balance);
    const amount = Number(payload.amount);
    const nextBalance = payload.type === 'income' ? currentBalance + amount : currentBalance - amount;

    if (payload.type === 'expense' && nextBalance < 0) {
      throw new HttpError(400, 'Insufficient balance for expense transaction');
    }

    const updatedAccount = await accountRepository.updateBalance(account.id, userId, nextBalance, client);
    if (!updatedAccount) {
      throw new HttpError(500, 'Failed to update account balance');
    }

    const transaction = await transactionRepository.create(
      {
        userId,
        accountId: account.id,
        categoryId: category.id,
        type: payload.type,
        amount,
        description: payload.description || null,
        transactionDate: payload.transactionDate,
      },
      client,
    );

    return {
      transaction,
      account: updatedAccount,
    };
  });
};

const listTransactions = async (userId, { filters, pagination }) => {
  return transactionRepository.listByUser({ userId, filters, pagination });
};

module.exports = {
  createTransaction,
  listTransactions,
};
