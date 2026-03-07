const db = require('../config/db');

const create = async ({ userId, name, type, balance, currency }) => {
  const result = await db.query(
    `INSERT INTO accounts (user_id, name, type, balance, currency)
     VALUES ($1, $2, $3, $4, $5)
     RETURNING id, user_id, name, type, balance, currency, created_at`,
    [userId, name, type, balance, currency],
  );

  return result.rows[0];
};

const listByUser = async (userId) => {
  const result = await db.query(
    `SELECT id, user_id, name, type, balance, currency, created_at
     FROM accounts
     WHERE user_id = $1
     ORDER BY created_at DESC`,
    [userId],
  );

  return result.rows;
};

const getByIdForUser = async (id, userId, client = db) => {
  const result = await client.query(
    `SELECT id, user_id, name, type, balance, currency, created_at
     FROM accounts
     WHERE id = $1 AND user_id = $2`,
    [id, userId],
  );

  return result.rows[0] || null;
};

const deleteByIdForUser = async (id, userId) => {
  const result = await db.query('DELETE FROM accounts WHERE id = $1 AND user_id = $2 RETURNING id', [id, userId]);
  return result.rows[0] || null;
};

const updateBalance = async (id, userId, balance, client = db) => {
  const result = await client.query(
    `UPDATE accounts
     SET balance = $1
     WHERE id = $2 AND user_id = $3
     RETURNING id, user_id, name, type, balance, currency, created_at`,
    [balance, id, userId],
  );

  return result.rows[0] || null;
};

const replaceByIdForUser = async ({id, userId, name, type, balance, currency}, client = db) => {
  const result = await client.query(
    `UPDATE accounts
     SET name = $1, type = $2, balance = $3, currency = $4
     WHERE id = $5 AND user_id = $6
     RETURNING id, user_id, name, type, balance, currency, created_at`,
    [name, type, balance, currency, id, userId],
  );
  return result.rows[0] || null;
}

module.exports = {
  create,
  listByUser,
  getByIdForUser,
  deleteByIdForUser,
  updateBalance,
  replaceByIdForUser,
};
