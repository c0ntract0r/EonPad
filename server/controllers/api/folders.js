const Users = require('../../models/users');
const Folders = require('../../models/folders');
const { HTTP_RESPONSE_CODE, APP_ERROR_MESSAGE } = require('../../utils/constants');

const getAllFolders = async (req, res) => {

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
