const transactionService = require('../services/transaction.service');
const { parsePagination } = require('../utils/pagination');

const create = async (req, res) => {
  const result = await transactionService.createTransaction(req.user.id, req.validated);
  res.status(201).json(result);
};

const list = async (req, res) => {
  const pageQuery = req.validated.page || req.query.page;
  const limitQuery = req.validated.limit || req.query.limit;

  const pagination = parsePagination({
    page: pageQuery,
    limit: limitQuery,
  });

  const filters = {
    type: req.validated.type,
    accountId: req.validated.accountId,
    categoryId: req.validated.categoryId,
    startDate: req.validated.startDate,
    endDate: req.validated.endDate,
  };

  const data = await transactionService.listTransactions(req.user.id, { filters, pagination });

  res.status(200).json({
    data: data.items,
    pagination: {
      total: data.total,
      page: pagination.page,
      limit: pagination.limit,
      pages: Math.ceil(data.total / pagination.limit),
    },
  });
};

module.exports = {
  create,
  list,
};
