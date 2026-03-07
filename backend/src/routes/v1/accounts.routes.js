const express = require('express');
const asyncHandler = require('../../utils/asyncHandler');
const validate = require('../../middleware/validate.middleware');
const accountController = require('../../controllers/account.controller');
const { validateCreateAccount, validateAccountIdParam, validateReplaceAccount, validatePatchAccount } = require('../../validators/account.validator');

const router = express.Router();

router.post('/', validate(validateCreateAccount), asyncHandler(accountController.create));
router.get('/', asyncHandler(accountController.list));
router.get('/:id', validate(validateAccountIdParam), asyncHandler(accountController.get));

router.put('/:id', validate(validateReplaceAccount), asyncHandler(accountController.replace))
router.patch('/:id', validate(validatePatchAccount), asyncHandler(accountController.patch))

router.delete('/:id', validate(validateAccountIdParam), asyncHandler(accountController.remove));

module.exports = router;
