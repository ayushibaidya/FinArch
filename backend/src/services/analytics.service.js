const transactionRepository = require('../repositories/transaction.repository');

const getMonthlySummary = async (userId, range) => {
  return transactionRepository.getMonthlySummary(userId, range);
};

const getCategoryBreakdown = async (userId, range) => {
  const rows = await transactionRepository.getCategoryExpenseBreakdown(userId, range);
  const total = rows.reduce((sum, row) => sum + Number(row.total_expense), 0);

  return rows.map((row) => ({
    category_id: row.category_id,
    category_name: row.category_name,
    total_expense: Number(row.total_expense),
    percentage: total === 0 ? 0 : Number(((Number(row.total_expense) / total) * 100).toFixed(2)),
  }));
};

module.exports = {
  getMonthlySummary,
  getCategoryBreakdown,
};
