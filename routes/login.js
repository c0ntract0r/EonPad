const express = require('express');
const loginRouter = express.Router();

loginRouter.route('/')
    .get((req, res) => { res.send('Testing login GET...') })
    .post((req, res) => { res.send('Testing login POST...') });

module.exports = loginRouter;