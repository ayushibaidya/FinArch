const jwt = require('jsonwebtoken');
const env = require('../config/env');
const HttpError = require('../utils/httpError');

const authMiddleware = (req, res, next) => {
  const header = req.headers.authorization;

  if (!header || !header.startsWith('Bearer ')) {
    return next(new HttpError(401, 'Missing or invalid authorization header'));
  }

  const token = header.slice(7);

  try {
    const payload = jwt.verify(token, env.jwtSecret);
    req.user = {
      id: payload.sub,
      email: payload.email,
    };

    return next();
  } catch (error) {
    return next(new HttpError(401, 'Invalid or expired token'));
  }
};

module.exports = authMiddleware;
