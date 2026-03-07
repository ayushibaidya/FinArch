const express = require('express');
const asyncHandler = require('../../utils/asyncHandler');
const validate = require('../../middleware/validate.middleware');
const authController = require('../../controllers/auth.controller');
const { validateRegister, validateLogin } = require('../../validators/auth.validator');

const router = express.Router();

router.post('/register', validate(validateRegister), asyncHandler(authController.register));
router.post('/login', validate(validateLogin), asyncHandler(authController.login));

module.exports = router;
