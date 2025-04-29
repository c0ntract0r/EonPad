const express = require('express');
const folderRouter = express.Router();
const folderHandler = require('../../controllers/api/folders');

folderRouter.route('/')
    .get(folderHandler.getAllFolders)
    .post(folderHandler.createFolder);

folderRouter.route('/:folderId')
    .get(folderHandler.getFolder)
    .delete(folderHandler.deleteFolder)
    .patch(folderHandler.renameFolder);

folderRouter.route('/move/:folderId')
    .patch(folderHandler.moveFolder);

module.exports = folderRouter;