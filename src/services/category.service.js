const categoryRepository = require('../repositories/category.repository');

const createCategory = async (userId, payload) => {
  return categoryRepository.create({
    userId,
    name: payload.name,
    type: payload.type,
  });
};

const listCategories = async (userId) => categoryRepository.listByUser(userId);

module.exports = {
  createCategory,
  listCategories,
};
