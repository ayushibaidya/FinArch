const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

const validateRegister = (req) => {
  const { email, fullName, password } = req.body;
  const errors = [];

  if (!email || !emailRegex.test(email)) {
    errors.push('Valid email is required');
  }

  if (!fullName || typeof fullName !== 'string' || fullName.trim().length < 2) {
    errors.push('fullName must be at least 2 characters');
  }

  if (!password || typeof password !== 'string' || password.length < 8) {
    errors.push('password must be at least 8 characters');
  }

  return {
    valid: errors.length === 0,
    errors,
    value: {
      email: typeof email === 'string' ? email.trim().toLowerCase() : email,
      fullName: typeof fullName === 'string' ? fullName.trim() : fullName,
      password,
    },
  };
};

const validateLogin = (req) => {
  const { email, password } = req.body;
  const errors = [];

  if (!email || !emailRegex.test(email)) {
    errors.push('Valid email is required');
  }

  if (!password || typeof password !== 'string') {
    errors.push('password is required');
  }

  return {
    valid: errors.length === 0,
    errors,
    value: {
      email: typeof email === 'string' ? email.trim().toLowerCase() : email,
      password,
    },
  };
};

module.exports = {
  validateRegister,
  validateLogin,
};
