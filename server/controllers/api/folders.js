const Users = require('../../models/users');
const Folders = require('../../models/folders');
const { HTTP_RESPONSE_CODE, APP_ERROR_MESSAGE } = require('../../utils/constants');

const getAllFolders = async (req, res) => {

}

const createFolder = async (req, res) => {
    // parentFolder is optional, as folderName may be a root folder
    const { folderName, parentFolder} = req.body;
    if (!folderName || folderName === '') return res.status(HTTP_RESPONSE_CODE.BAD_REQUEST).json({ 'msg': APP_ERROR_MESSAGE.badRequest });
    // in case no user was found, or some problem occured
    const reqUser = await Users.findById(req.user.user_id);
    if (!reqUser) { return res.status(HTTP_RESPONSE_CODE.NOT_FOUND).json({ 'msg': APP_ERROR_MESSAGE.noValidUser })};

    const newFolder = new Folders ({
        name: folderName,
        user: reqUser,
    });

    // I need to check, if there are folders with repeating name in same name

    await newFolder.save();

    if (parentFolder) {
        const getParentFolder = await Folders.findOne({ name: parentFolder });
        // create the folder in root, even if no parentID was found
        if (!getParentFolder) return res.status(HTTP_RESPONSE_CODE.NOT_FOUND).json({ 'msg': `No Parent folder found with name ${parentFolder}...` });
        // the newly created child folder
        const childFolder = await Folders.findOne({ name: folderName });
        getParentFolder.children.push(childFolder._id);

        childFolder.parentId = getParentFolder._id;

        await childFolder.save();
        await getParentFolder.save();
    }
    return res.status(HTTP_RESPONSE_CODE.CREATED).json({ 'msg': APP_ERROR_MESSAGE.objectCreated });
}

const renameFolder = async (req, res) => {

}

const deleteFolder = async (req, res) => {

}

module.exports = { 
    getAllFolders, 
    createFolder, 
    renameFolder,
    deleteFolder
     };
