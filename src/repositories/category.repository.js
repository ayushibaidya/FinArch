const db = require('../config/db');

const create = async ({ userId, name, type }) => {
  const result = await db.query(
    `INSERT INTO categories (user_id, name, type)
     VALUES ($1, $2, $3)
     RETURNING id, user_id, name, type, created_at`,
    [userId, name, type],
  );

  return result.rows[0];
};

const listByUser = async (userId) => {
  const result = await db.query(
    `SELECT id, user_id, name, type, created_at
     FROM categories
     WHERE user_id = $1
     ORDER BY name ASC`,
    [userId],
  );

  return result.rows;
};

const getByIdForUser = async (id, userId, client = db) => {
  const result = await client.query(
    `SELECT id, user_id, name, type, created_at
     FROM categories
     WHERE id = $1 AND user_id = $2`,
    [id, userId],
  );

  return result.rows[0] || null;
};

module.exports = {
  create,
  listByUser,
  getByIdForUser,
};
