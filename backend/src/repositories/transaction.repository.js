const db = require('../config/db');

const create = async ({ userId, accountId, categoryId, type, amount, description, transactionDate }, client = db) => {
  const result = await client.query(
    `INSERT INTO transactions (user_id, account_id, category_id, transaction_type, amount, description, transaction_date)
     VALUES ($1, $2, $3, $4, $5, $6, $7)
     RETURNING id, user_id, account_id, category_id, transaction_type, amount, description, transaction_date, created_at`,
    [userId, accountId, categoryId, type, amount, description, transactionDate],
  );

  return result.rows[0];
};

const listByUser = async ({ userId, filters, pagination }) => {
  const values = [userId];
  const where = ['t.user_id = $1'];

  if (filters.type) {
    values.push(filters.type);
    where.push(`t.transaction_type = $${values.length}`);
  }

  if (filters.accountId) {
    values.push(filters.accountId);
    where.push(`t.account_id = $${values.length}`);
  }

  if (filters.categoryId) {
    values.push(filters.categoryId);
    where.push(`t.category_id = $${values.length}`);
  }

  if (filters.startDate) {
    values.push(filters.startDate);
    where.push(`t.transaction_date >= $${values.length}`);
  }

  if (filters.endDate) {
    values.push(filters.endDate);
    where.push(`t.transaction_date <= $${values.length}`);
  }

  const baseWhere = where.join(' AND ');

  const countResult = await db.query(`SELECT COUNT(*)::int AS total FROM transactions t WHERE ${baseWhere}`, values);
  const total = countResult.rows[0].total;

  values.push(pagination.limit);
  values.push(pagination.offset);

  const dataResult = await db.query(
    `SELECT t.id, t.user_id, t.account_id, a.name AS account_name,
            t.category_id, c.name AS category_name,
            t.transaction_type, t.amount, t.description, t.transaction_date, t.created_at
     FROM transactions t
     JOIN accounts a ON a.id = t.account_id
     JOIN categories c ON c.id = t.category_id
     WHERE ${baseWhere}
     ORDER BY t.transaction_date DESC, t.id DESC
     LIMIT $${values.length - 1} OFFSET $${values.length}`,
    values,
  );

  return {
    total,
    items: dataResult.rows,
  };
};

const existsByAccountIdAndUser = async (accountId, userId) => {
  const result = await db.query(
    'SELECT 1 FROM transactions WHERE account_id = $1 AND user_id = $2 LIMIT 1',
    [accountId, userId],
  );

  return result.rowCount > 0;
};

const getMonthlySummary = async (userId, { from, to }) => {
  const values = [userId];
  const where = ['user_id = $1'];

  if (from) {
    values.push(from);
    where.push(`transaction_date >= $${values.length}`);
  }

  if (to) {
    values.push(to);
    where.push(`transaction_date <= $${values.length}`);
  }

  const result = await db.query(
    `SELECT to_char(date_trunc('month', transaction_date), 'YYYY-MM') AS month,
            ROUND(SUM(CASE WHEN transaction_type = 'income' THEN amount ELSE 0 END), 2) AS income,
            ROUND(SUM(CASE WHEN transaction_type = 'expense' THEN amount ELSE 0 END), 2) AS expense,
            ROUND(SUM(CASE WHEN transaction_type = 'income' THEN amount ELSE -amount END), 2) AS net
     FROM transactions
     WHERE ${where.join(' AND ')}
     GROUP BY date_trunc('month', transaction_date)
     ORDER BY date_trunc('month', transaction_date)`,
    values,
  );

  return result.rows;
};

const getCategoryExpenseBreakdown = async (userId, { from, to }) => {
  const values = [userId];
  const where = ["t.user_id = $1", "t.transaction_type = 'expense'"];

  if (from) {
    values.push(from);
    where.push(`t.transaction_date >= $${values.length}`);
  }

  if (to) {
    values.push(to);
    where.push(`t.transaction_date <= $${values.length}`);
  }

  const result = await db.query(
    `SELECT c.id AS category_id, c.name AS category_name, ROUND(SUM(t.amount), 2) AS total_expense
     FROM transactions t
     JOIN categories c ON c.id = t.category_id
     WHERE ${where.join(' AND ')}
     GROUP BY c.id, c.name
     ORDER BY total_expense DESC`,
    values,
  );

  return result.rows;
};

module.exports = {
  create,
  listByUser,
  existsByAccountIdAndUser,
  getMonthlySummary,
  getCategoryExpenseBreakdown,
};
