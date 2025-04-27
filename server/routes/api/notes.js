const express = require('express');
const noteHandler = require('../../controllers/api/notes');
const notesRouter = express.Router();

notesRouter.route('/')
    .get(noteHandler.getAllNotes)
    .post(noteHandler.createNote);

notesRouter.route('/:noteId')
    .get(noteHandler.getNote)
    .patch(noteHandler.updateNote)
    .delete(noteHandler.deleteNote);

notesRouter.route('/:noteId/move')
    .patch(noteHandler.moveNote)

module.exports = notesRouter;