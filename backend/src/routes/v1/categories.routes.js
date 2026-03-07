const express = require('express');
const asyncHandler = require('../../utils/asyncHandler');
const validate = require('../../middleware/validate.middleware');
const categoryController = require('../../controllers/category.controller');
const { validateCreateCategory } = require('../../validators/category.validator');

const router = express.Router();

router.post('/', validate(validateCreateCategory), asyncHandler(categoryController.create));
router.get('/', asyncHandler(categoryController.list));

module.exports = router;
