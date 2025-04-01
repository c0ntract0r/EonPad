const express = require('express');
const noteHandler = require('../../controllers/api/notes');
const notesRouter = express.Router();

notesRouter.route('/')
    .get(noteHandler.getAllNotes)
    .post(noteHandler.createNewNote);

notesRouter.route('/:id')
    .get((req, res) => { res.send('Getting single note from DB') })
    .patch((req, res) => { res.send('In future, update existing note') })
    .delete((req, res) => { res.send('Delete single note') });

module.exports = notesRouter;