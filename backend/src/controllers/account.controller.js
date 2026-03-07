const accountService = require('../services/account.service');

const create = async (req, res) => {
  const account = await accountService.createAccount(req.user.id, req.validated);
  res.status(201).json(account);
};

const list = async (req, res) => {
  const accounts = await accountService.listAccounts(req.user.id);
  res.status(200).json(accounts);
};

const get = async (req, res) => {
  const account = await accountService.getAccount(req.user.id, req.validated.id);
  res.status(200).json(account);
};

const remove = async (req, res) => {
  await accountService.deleteAccount(req.user.id, req.validated.id);
  res.status(204).send();
};

const replace = async (req, res) => {
  const account = await accountService.replaceAccount(req.user.id, req.validated.id, req.validated); 
  res.status(200).json(account); 
}; 

const patch = async (req, res) => {
  const account = await accountService.patchAccount(req.user.id, req.validated.id, req.validated); 
  res.status(200).json(account); 
}; 

module.exports = {
  create,
  list,
  get,
  remove,
  replace, 
  patch,
};
