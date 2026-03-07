const categoryService = require('../services/category.service');

const create = async (req, res) => {
  const category = await categoryService.createCategory(req.user.id, req.validated);
  res.status(201).json(category);
};

const list = async (req, res) => {
  const categories = await categoryService.listCategories(req.user.id);
  res.status(200).json(categories);
};

module.exports = {
  create,
  list,
};
