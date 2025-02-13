const express = require('express');
const registerRouter = express.Router();

registerRouter.route('/')
    .get((req, res) => { res.send('Testing register GET route...') })
    .post((req, res) => [ res.send('Testing register POST route') ]);

module.exports = registerRouter;