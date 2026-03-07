const authService = require('../services/auth.service');

const register = async (req, res) => {
  const result = await authService.register(req.validated);
  res.status(201).json(result);
};

const login = async (req, res) => {
  const result = await authService.login(req.validated);
  res.status(200).json(result);
};

module.exports = {
  register,
  login,
};
