const accountRepository = require('../repositories/account.repository');
const transactionRepository = require('../repositories/transaction.repository');
const HttpError = require('../utils/httpError');

const createAccount = async (userId, payload) => {
  return accountRepository.create({
    userId,
    name: payload.name,
    type: payload.type,
    balance: payload.balance,
    currency: payload.currency,
  });
};

const listAccounts = async (userId) => accountRepository.listByUser(userId);

const getAccount = async (userId, accountId) => {
  const account = await accountRepository.getByIdForUser(accountId, userId);
  if (!account) {
    throw new HttpError(404, 'Account not found');
  }

  return account;
};

const deleteAccount = async (userId, accountId) => {
  const hasTransactions = await transactionRepository.existsByAccountIdAndUser(accountId, userId);
  if (hasTransactions) {
    throw new HttpError(409, 'Cannot delete account with existing transactions');
  }

  const deleted = await accountRepository.deleteByIdForUser(accountId, userId);
  if (!deleted) {
    throw new HttpError(404, 'Account not found');
  }

  return deleted;
};

const replaceAccount = async (userId, accountId, payload) => {
  const updated = await accountRepository.replaceByIdForUser({
    id: accountId, 
    userId, 
    name: payload.name, 
    type: payload.type,
    balance: payload.balance, 
    currency: payload.currency
  }); 

  if(!updated) throw new HttpError(404, 'Account not found'); 
  return updated; 
}; 

const patchAccount = async (useReducer, accountId, payload) => {
  const existing = await accountRepository.getByIdForUser(accountId, userId); 
  if(!existing) throw new HttpError(404, 'Account not found'); 

  const updated = await accountRepository.replaceByIdForUser({
    id: accountId,
    userId, 
    name: payload.name ?? exisiting.name, 
    type: payload.type ?? existing.type, 
    balance: payload.balance ?? Number(exsisting.balance), 
    currency: payload.currency ?? existing.currency,
  }); 

  return updated; 
}


module.exports = {
  createAccount,
  listAccounts,
  getAccount,
  deleteAccount,
  replaceAccount, 
  patchAccount
};
