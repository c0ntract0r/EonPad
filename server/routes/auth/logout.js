const express = require('express');
const logoutHandler  = require('../../controllers/auth/logoutController');
const logoutRouter = express.Router();

logoutRouter.route('/')
    .post(logoutHandler.handleLogout);

module.exports = logoutRouter;