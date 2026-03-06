const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const env = require('../config/env');
const userRepository = require('../repositories/user.repository');
const HttpError = require('../utils/httpError');

const register = async ({ email, fullName, password }) => {
  const existing = await userRepository.findByEmail(email);
  if (existing) {
    throw new HttpError(409, 'Email already registered');
  }

  const passwordHash = await bcrypt.hash(password, 10);
  const user = await userRepository.create({ email, fullName, passwordHash });

  const token = jwt.sign({ email: user.email }, env.jwtSecret, {
    subject: String(user.id),
    expiresIn: env.jwtExpiresIn,
  });

  return { user, token };
};

const login = async ({ email, password }) => {
  const user = await userRepository.findByEmail(email);
  if (!user) {
    throw new HttpError(401, 'Invalid credentials');
  }

  const valid = await bcrypt.compare(password, user.password_hash);
  if (!valid) {
    throw new HttpError(401, 'Invalid credentials');
  }

  const token = jwt.sign({ email: user.email }, env.jwtSecret, {
    subject: String(user.id),
    expiresIn: env.jwtExpiresIn,
  });

  return {
    user: {
      id: user.id,
      email: user.email,
      full_name: user.full_name,
    },
    token,
  };
};

module.exports = {
  register,
  login,
};
