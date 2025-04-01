const express = require('express');
const regValidationHandler = express.Router();
const ValidationHandler = require('../../controllers/auth/register');

regValidationHandler.route('/')
    .post(ValidationHandler.registrationValidationHandler);

module.exports = regValidationHandler;