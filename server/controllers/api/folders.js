const Users = require('../../models/users');
const Folders = require('../../models/folders');
const { HTTP_RESPONSE_CODE, APP_ERROR_MESSAGE, APP_SUCCESS_MESSAGE } = require('../../utils/constants');

// Get only 1 folder, receive id
const getFolder = async (req, res) => {
    const reqUser = await Users.findById(req.user.user_id);

    if (!reqUser) return res.status(HTTP_RESPONSE_CODE.NOT_FOUND)
                            .json({ 'success': false, 'msg': APP_ERROR_MESSAGE.badRequest, 'data': null });
    
    try {

        const { folderId } = req.params;
        const folder = await Folders.findById(folderId).select('_id name children notes parentId').exec();

        return res.status(HTTP_RESPONSE_CODE.OK).json({'success': true, 'msg': `Folder ${APP_SUCCESS_MESSAGE.objectFound}`, 'data': folder});

    } catch (error) {
        // I yet to know what types of error one can encounter here
        // P.S: I KNOW NOW SOME: But I need to handle them differently
        return res.status(HTTP_RESPONSE_CODE.SERVER_ERROR).json({ 'success': false, 'msg': `Unknown server error: ${error}`, 'data': null });
    }
}

// get current user's all folders
const getAllFolders = async (req, res) => {
    // Get user ID from the token
    const reqUser = await Users.findById(req.user.user_id);

    if (!reqUser) 
        return res.status(HTTP_RESPONSE_CODE.NOT_FOUND)
                  .json({ 'success': false, 'msg': APP_ERROR_MESSAGE.badRequest, 'data': null });

    try {

        const allFolders = await Folders.find({ user: req.user.user_id }).select('_id name children notes parentId').exec();
        return res.status(HTTP_RESPONSE_CODE.OK).json({ 'success': true, 'msg': `Folder list ${APP_SUCCESS_MESSAGE.objectFound}`, 'data': allFolders });

    } catch (error) {
        // I yet to know what types of error one can encounter here
        return res.status(HTTP_RESPONSE_CODE.SERVER_ERROR).json({ 'success': false, 'msg': `Unknown server error: ${error}`, 'data': null });
    }
    
}

const createFolder = async (req, res) => {
    const { folderName, parentFolderName} = req.body;
    let parentFolderId = null;

    if (!folderName || typeof folderName !== 'string' || folderName.trim() === '') 
            return res.status(HTTP_RESPONSE_CODE.BAD_REQUEST).json({ 'msg': APP_ERROR_MESSAGE.badRequest });
    
    // in case no user was found, or some problem occured
    const reqUser = await Users.findById(req.user.user_id);
    if (!reqUser) { return res.status(HTTP_RESPONSE_CODE.NOT_FOUND).json({ 'msg': APP_ERROR_MESSAGE.noValidUser })};

    const parentFolder = parentFolderName === 'null' || !parentFolderName ? null : parentFolderName;
    // check if the provided parent exists
    if (parentFolder) {
        const getParentFolder = await Folders.findOne({ name: parentFolder });
        if (!getParentFolder) return res.status(HTTP_RESPONSE_CODE.NOT_FOUND).json({ 'msg': `No Parent folder found with name ${parentFolder}...` });
        parentFolderId = getParentFolder._id;
    }

    try {
        const newFolder = new Folders ({
            name: folderName,
            user: reqUser,
            parentId: parentFolderId
        });

        await newFolder.save();

        if (parentFolderId) {
            const getParentFolder = await Folders.findById(parentFolderId);
            const childFolder = await Folders.findOne({ name: folderName })
            getParentFolder.children.push(childFolder._id);

            await getParentFolder.save();
        }

    } catch (error) {
        if (error.code === 11000) {
            const field = Object.keys(error.keyValue)[0];
            return res.status(HTTP_RESPONSE_CODE.CONFLICT).json({
                msg: `Folder with name ${error.keyValue[field]} already exists. Please Try something else.`
            })
        }
    }
    return res.status(HTTP_RESPONSE_CODE.CREATED).json({ 'msg': APP_ERROR_MESSAGE.objectCreated });
}

// TO-DO
const renameFolder = async (req, res) => {

}

// TO-DO
const deleteFolder = async (req, res) => {
    const {folderName, parentFolderName, deleteContent} = req.body;
    let parentFolderId = null;

    // in case, no folder is provided
    if (!folderName || typeof folderName !== 'string' || folderName.trim() === '') 
        return res.status(HTTP_RESPONSE_CODE.BAD_REQUEST).json({ 'msg': APP_ERROR_MESSAGE.badRequest });

    // in case no user was found, or some problem occured
    const reqUser = await Users.findById(req.user.user_id);
    if (!reqUser) { return res.status(HTTP_RESPONSE_CODE.NOT_FOUND).json({ 'msg': APP_ERROR_MESSAGE.noValidUser })};

    // normalize parent folder here, and if provided and not found, throw an error
    const parentFolder = parentFolderName === 'null' || !parentFolderName ? null : parentFolderName;
    if (parentFolder) {
        const getParentFolder = await Folders.findOne({ name: parentFolder });
        if (!getParentFolder) return res.status(HTTP_RESPONSE_CODE.NOT_FOUND).json({ 'msg': `No Parent folder found with name ${parentFolder}...` });
        parentFolderId = getParentFolder._id;
    }

    try {
        // 2 POSSIBLE SCENARIOS of parentID: null, or belongs to a folder


        const childFolder = await Folders.findOne({ name: folderName });

        if (parentFolderId) {
            const getParentFolder = await Folders.findOne({ name: parentFolder })
            // You are my child NO MORE
            getParentFolder.children.pull({ _id: childFolder._id });
        };

        await Folders.findByIdAndDelete(childFolder._id);

    } catch (error) {
        // I don't know what error can be 
        console.log(`Here must be an error that I don't know about it yet. ${error}`);
        return res.status(HTTP_RESPONSE_CODE.SERVER_ERROR).json({ 'msg': `Some unknown server error...` });
    }
    return res.status(HTTP_RESPONSE_CODE.SUCCESS).json({ 'msg': APP_SUCCESS_MESSAGE.objectDeleted });
}

// TO-DO
const moveFolder = async (req, res) => {

}

module.exports = { 
    getFolder,
    getAllFolders, 
    createFolder, 
    renameFolder,
    deleteFolder
};
