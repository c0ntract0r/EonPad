const express = require('express');
const notesRouter = express.Router();

notesRouter.route('/')
    .get((req, res) => { res.send('Get all existing notes') })
    .post((req, res) => { res.send('Creating new note') });

notesRouter.route('/:id')
    .get((req, res) => { res.send('Getting single note from DB') })
    .patch((req, res) => { res.send('In future, update existing note') })
    .delete((req, res) => { res.send('Delete single note') });

module.exports = notesRouter;