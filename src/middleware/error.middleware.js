const HttpError = require('../utils/httpError');

const notFoundHandler = (req, res, next) => {
  next(new HttpError(404, 'Route not found'));
};

const errorHandler = (err, req, res, next) => {
  if (err.code === '23505') {
    return res.status(409).json({ message: 'Duplicate resource conflict' });
  }

  if (err.code === '23503') {
    return res.status(400).json({ message: 'Invalid foreign key reference' });
  }

  const status = err.status || 500;
  const payload = {
    message: err.message || 'Internal server error',
  };

  if (err.details) {
    payload.details = err.details;
  }

  if (status >= 500) {
    console.error(err);
  }

  res.status(status).json(payload);
};

module.exports = {
  notFoundHandler,
  errorHandler,
};
