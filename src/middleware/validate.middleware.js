const HttpError = require('../utils/httpError');

const validate = (validator) => (req, res, next) => {
  const result = validator(req);

  if (!result.valid) {
    return next(new HttpError(400, 'Validation failed', result.errors));
  }

  req.validated = result.value || {};
  return next();
};

module.exports = validate;
