const db = require('../config/db');

const findByEmail = async (email) => {
  const result = await db.query('SELECT id, email, full_name, password_hash FROM users WHERE email = $1', [email]);
  return result.rows[0] || null;
};

const create = async ({ email, fullName, passwordHash }) => {
  const result = await db.query(
    `INSERT INTO users (email, full_name, password_hash)
     VALUES ($1, $2, $3)
     RETURNING id, email, full_name, created_at`,
    [email, fullName, passwordHash],
  );

  return result.rows[0];
};

module.exports = {
  findByEmail,
  create,
};
