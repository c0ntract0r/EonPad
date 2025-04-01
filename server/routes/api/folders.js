const express = require('express');
const folderRouter = express.Router();
const folderHandler = require('../../controllers/api/folders');

folderRouter.route('/')
    .get(folderHandler.getAllFolders)
    .post(folderHandler.createFolder);

folderRouter.route('/:id')
    .delete(folderHandler.deleteFolder)
    .put(folderHandler.renameFolder);

// folder names need to be updated(sometimes)

module.exports = folderRouter;