const express = require('express');
const loginRouter = express.Router();
const loginHandler  = require('../../controllers/auth/login');

loginRouter.route('/')
    .get((req, res) => { res.send('Testing login GET...') })
    .post(loginHandler.loginHandler);

module.exports = loginRouter;