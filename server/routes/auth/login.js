const express = require('express');
const loginRouter = express.Router();
const loginHandler  = require('../../controllers/auth/login');
const loginLimiter = require('../../middlewares/authLimiter');

// LoginLimiter is specific for login route
loginRouter.route('/')
    .post(loginLimiter, loginHandler.loginHandler);

module.exports = loginRouter;