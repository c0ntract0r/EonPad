const express = require('express');
const registerRouter = express.Router();
const registrationHandler = require('../../controllers/auth/register')

registerRouter.route('/')
    .post(registrationHandler.RegistrationHandler);

module.exports = registerRouter;