const express = require('express');
const refreshRouter = express.Router();
const refreshTokenHandler = require('../controllers/auth/refreshTokenController');

refreshRouter.route('/')
    .get(refreshTokenHandler.refreshTokenHandler)

module.exports = refreshRouter;