const express = require('express');
const registerRouter = express.Router();
const registrationHandler = require('../../controllers/auth/register')

registerRouter.route('/')
    .get((req, res) => { res.send('Testing register GET route...') })
    .post(registrationHandler.RegistrationHandler);

module.exports = registerRouter;