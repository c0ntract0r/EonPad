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

const deleteFolder = async (req, res) => {
    const reqUser = await Users.findById(req.user.user_id);

    if (!reqUser) return res.status(HTTP_RESPONSE_CODE.NOT_FOUND)
                            .json({ 'success': false, 'msg': APP_ERROR_MESSAGE.badRequest, 'data': null });
    
    try {
        // HAVE SOMETHING TO DO RIGHT. HERE.
        const { folderId } = req.params;

        const reqFolder = await Folders.findOne({ user: req.user.user_id, _id: folderId }).select('_id parentId children').exec();
        // Get parent folder if it's not null for further operations
        const parentFolder = (reqFolder.parentId !== null) ? await Folders.findById(reqFolder.parentId) : null ;

        /* TO-DO: After dealing with notes, return here */

        // If not to delete content, then: Move child folders(and their contents) and notes 1 level up, and remove that child from parent 
        if ((typeof delContentFlag !== 'boolean') || (!delContentFlag) || (delContentFlag === false)) {

            // if not null, remove the corresponding child folder from 
            if (parentFolder) {
                parentFolder.children.pull(folderId);
                await parentFolder.save();
            }
            // if folder has child folders, update their parent Ids, and update parent folder's children, if not NULL
            if (reqFolder.children.length) {
                for (const child of reqFolder.children) {
                    const childFolder = await Folders.findById(child).select('parentId').exec();
                    childFolder.parentId = reqFolder.parentId;

                    if (parentFolder) {
                        parentFolder.children.push(child);
                    }
                    await childFolder.save();
                }
                if (parentFolder) {
                    await parentFolder.save();
                }
            }

            await Folders.findByIdAndDelete(folderId);

            return res.status(HTTP_RESPONSE_CODE.OK).json({'success': 'relative', 'msg': 'Folder deleted. Child objects remain', 'data': reqFolder});
        }

        

        
    } catch (error) {
        // return res.status(HTTP_RESPONSE_CODE.SERVER_ERROR).json({ 'success': false, 'msg': APP_ERROR_MESSAGE.serverError, 'data': null });
        return res.status(HTTP_RESPONSE_CODE.SERVER_ERROR).json({ 'success': false, 'msg': `Error encountered: ${error}`, 'data': null });
    }
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
