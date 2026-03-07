const express = require('express');
const asyncHandler = require('../../utils/asyncHandler');
const validate = require('../../middleware/validate.middleware');
const transactionController = require('../../controllers/transaction.controller');
const { validateCreateTransaction, validateTransactionQuery } = require('../../validators/transaction.validator');

const router = express.Router();

router.post('/', validate(validateCreateTransaction), asyncHandler(transactionController.create));
router.get('/', validate(validateTransactionQuery), asyncHandler(transactionController.list));

module.exports = router;
