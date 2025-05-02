const Users = require('../../models/users');
const Folders = require('../../models/folders');
const Notes = require('../../models/notes');
const { HTTP_RESPONSE_CODE, APP_ERROR_MESSAGE, APP_SUCCESS_MESSAGE } = require('../../utils/constants');


// Create a folder, optionally creating it as a child one 
const createFolder = async (req, res) => {
    const { folderName, parentFolderName } = req.body;
    let parentFolderId = null;

    if (!folderName || typeof folderName !== 'string' || folderName.trim() === '') 
            return res.status(HTTP_RESPONSE_CODE.BAD_REQUEST).json({ 'success': false, 'msg': APP_ERROR_MESSAGE.badRequest });
    
    // in case no user was found, or some problem occured
    const reqUser = await Users.findById(req.user.user_id);
    if (!reqUser) return res.status(HTTP_RESPONSE_CODE.NOT_FOUND)
        .json({ 'success': false, 'msg': APP_ERROR_MESSAGE.badRequest, 'data': null });

    const parentFolder = parentFolderName === 'null' || !parentFolderName ? null : parentFolderName;
    // check if the provided parent exists
    if (parentFolder) {
        const getParentFolder = await Folders.findOne({ user: reqUser._id ,name: parentFolder });
        if (!getParentFolder) return res.status(HTTP_RESPONSE_CODE.NOT_FOUND).json({ 'success': false, 'msg': `No Parent folder found with name ${parentFolder}...` });
        parentFolderId = getParentFolder._id;
    }

    try {
        const newFolder = new Folders ({
            name: folderName,
            user: reqUser._id,
            parentId: parentFolderId
        });

        const result = await newFolder.save();

        if (parentFolderId) {
            const getParentFolder = await Folders.findById(parentFolderId);
            const childFolder = await Folders.findOne({ name: folderName })
            getParentFolder.children.push(childFolder._id);

            await getParentFolder.save();
        }
        return res.status(HTTP_RESPONSE_CODE.CREATED).json({ 'success': true, 'msg': `Folder ${folderName} ${APP_SUCCESS_MESSAGE.objectCreated}`, 'data': result });
    } catch (error) {
        if (error.code === 11000) {
            const field = Object.keys(error.keyValue)[0];
            return res.status(HTTP_RESPONSE_CODE.CONFLICT).json({
                success: false,
                msg: `Folder with name ${error.keyValue[field]} already exists. Please Try something else.`,
                data: []
            })
        }
        // Generic error message as well, like others
        return res.status(HTTP_RESPONSE_CODE.BAD_REQUEST).json({ 'success': false, 'msg': `Error: ${error}`, 'data': null });
    }
}


const getAllFolders = async (req, res) => {
    // Get user ID from the token
    const reqUser = await Users.findById(req.user.user_id);
    if (!reqUser)  return res.status(HTTP_RESPONSE_CODE.BAD_REQUEST)
                    .json({ 'success': false, 'msg': APP_ERROR_MESSAGE.badRequest, 'data': null });

    try {

        const allFolders = await Folders.find({ user: req.user.user_id }).select('_id name children notes parentId').exec();
        return res.status(HTTP_RESPONSE_CODE.OK).json({ 'success': true, 'msg': `Folder list ${APP_SUCCESS_MESSAGE.objectFound}`, 'data': allFolders });

    } catch (error) {
        return res.status(HTTP_RESPONSE_CODE.BAD_REQUEST).json({ 'success': false, 'msg': `Unknown error: ${error}`, 'data': null });
    }
}

const getFolder = async (req, res) => {
    const reqUser = await Users.findById(req.user.user_id);

    if (!reqUser) return res.status(HTTP_RESPONSE_CODE.NOT_FOUND)
                            .json({ 'success': false, 'msg': APP_ERROR_MESSAGE.badRequest, 'data': null });
    
    try {

        const { folderId } = req.params;
        const folder = await Folders.findOne({user: reqUser, _id: folderId}).select('_id name children notes parentId').exec();

        return res.status(HTTP_RESPONSE_CODE.OK).json({'success': true, 'msg': `Folder ${APP_SUCCESS_MESSAGE.objectFound}`, 'data': folder});

    } catch (error) {
        if (error.name === "CastError") return res.status(HTTP_RESPONSE_CODE.NOT_FOUND).json({ 'success': false, 'msg': `Folder ${APP_ERROR_MESSAGE.notFound}`, 'data': [] });
        return res.status(HTTP_RESPONSE_CODE.BAD_REQUEST).json({ 'success': false, 'msg': `Unknown error: ${error}`, 'data': null });
    }
}


const renameFolder = async (req, res) => {

    const { folderId } = req.params;
    const { name } = req.body;

    // Get user ID from the token
    const reqUser = await Users.findById(req.user.user_id);

    if (!reqUser) 
        return res.status(HTTP_RESPONSE_CODE.NOT_FOUND)
                  .json({ 'success': false, 'msg': APP_ERROR_MESSAGE.badRequest, 'data': null });
    
    if (name === undefined || !name) return res.status(HTTP_RESPONSE_CODE.NO_CONTENT).json({'success': true, 'msg': 'Nothing to be updated.', data: []});
    
    try {
        const reqFolder = await Folders.findOne({ user: req.user.user_id, _id: folderId }).select('_id name').exec();

        reqFolder.name = name.trim();

        await reqFolder.save();

        return res.status(HTTP_RESPONSE_CODE.OK).json({success:true, 'msg': `Folder ${APP_SUCCESS_MESSAGE.objectUpdated}`, data: []});

    } catch (error) {
        if (error.name === "CastError") return res.status(HTTP_RESPONSE_CODE.NOT_FOUND).json({ 'success': false, 'msg': `Folder ${APP_ERROR_MESSAGE.notFound}`, 'data': [] });
        return res.status(HTTP_RESPONSE_CODE.BAD_REQUEST).json({ 'success': false, 'msg': `Error encountered: ${error}`, 'data': null });
    }
}

// Delete folder: Choose to either delete content, or only delete it, moving content to parent
const deleteFolder = async (req, res) => {
    const reqUser = await Users.findById(req.user.user_id);

    if (!reqUser) return res.status(HTTP_RESPONSE_CODE.NOT_FOUND)
                            .json({ 'success': false, 'msg': APP_ERROR_MESSAGE.badRequest, 'data': null });
    
    try {
        const { folderId } = req.params;
        const delContent = req.query.delContent;

        const reqFolder = await Folders.findOne({ user: req.user.user_id, _id: folderId }).select('_id parentId notes children').exec();

        // If not to delete content, then: Move child folders(and their contents) and notes 1 level up, and remove that child from parent 
        if ((!delContent) || (delContent.toLowerCase() !== 'true')) {

            const parentFolder = (reqFolder.parentId !== null) ? await Folders.findById(reqFolder.parentId) : null ;

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

            // In case if folder has notes inside it, which do not need to be deleted
            if (reqFolder.notes.length) {
                for (const note of reqFolder.notes) {
                    const childNote = await Notes.findOne({ user: req.user.user_id, _id: note }).exec();
                    childNote.parentFolder = reqFolder.parentId;

                    if (parentFolder) {
                        parentFolder.notes.push(childNote._id);
                        await parentFolder.save();
                    }

                    childNote.save();
                }
            }
            

            await Folders.findByIdAndDelete(folderId);

            return res.status(HTTP_RESPONSE_CODE.OK).json({'success': true, 'msg': 'Folder deleted. Child objects and notes remain.', 'data': reqFolder});
        }

        // In case, that delContent IS SET TO TRUE
        const recursiveDelete = async (targetFolder) => {

            const folder = await Folders.findById(targetFolder).exec();

            const childFolderIds = folder.children || [];
            if (childFolderIds.length > 0) {
                for (const childId of childFolderIds) {
                    await recursiveDelete(childId);
                }
            }

            if (folder.notes && folder.notes.length > 0) {
                for (const noteId of folder.notes) {
                    try {
                        await Notes.findOneAndDelete({ user: req.user.user_id, _id: noteId });
                    } catch (error) {
                        console.log(`Error deleting note ${noteId}: ${error}`);
                    }
                }
            }

            await Folders.findByIdAndDelete(targetFolder);
        }

        // if a parent folder exists, clean that up
        if (reqFolder.parentId) {
            const parentFolder = await Folders.findOne({ user: reqUser._id, _id: reqFolder.parentId }).exec();
            parentFolder.children.pull(reqFolder._id);
            await parentFolder.save();
        }
        await recursiveDelete(folderId);

        return res.status(HTTP_RESPONSE_CODE.OK).json({'success': 'true', 'msg': 'Folder deleted with its contents', 'data': reqFolder});

    } catch (error) {
        if (error.name === "CastError") return res.status(HTTP_RESPONSE_CODE.NOT_FOUND).json({ 'success': false, 'msg': `Folder ${APP_ERROR_MESSAGE.notFound}`, 'data': [] });
        return res.status(HTTP_RESPONSE_CODE.BAD_REQUEST).json({ 'success': false, 'msg': `Error encountered: ${error}`, 'data': null });
    }
}

// Move folder to a specified place. Need: New parent's ID, folder's Id to move
const moveFolder = async (req, res) => {
    // Get user ID from the token
    const reqUser = await Users.findById(req.user.user_id);

    if (!reqUser) 
        return res.status(HTTP_RESPONSE_CODE.BAD_REQUEST)
                  .json({ 'success': false, 'msg': APP_ERROR_MESSAGE.badRequest, 'data': null });

    let parentDoc = null;
    const { folderId } = req.params;
    const { newParentId } = req.body;
    const newParent = newParentId === 'null' || !newParentId ? null : newParentId;

    if (newParent) {
        parentDoc = await Folders.findById(newParentId).exec();
        if (!parentDoc) return res.status(HTTP_RESPONSE_CODE.NOT_FOUND).json({ 'success': false ,'msg': `folder ${APP_ERROR_MESSAGE.notFound}`, data: null});
    }

    try {

        const folder = await Folders.findOne({ user: reqUser._id, _id: folderId }).exec();
        if (folder.parentId) {
            const oldParent =  await Folders.findOne({ user: reqUser._id, _id: folder.parentId }).exec();
            oldParent.children.pull(folder._id);

            await oldParent.save();
        }

        folder.parentId = newParent;
        if (parentDoc) {
            parentDoc.children.push(folder._id);
            await parentDoc.save();
        }

        await folder.save();

        return res.status(HTTP_RESPONSE_CODE.OK).json({ 'success': true, 'msg': `Folder with ID ${folderId} moved to ${newParent}`, data: [] });

    } catch (error) {
        if (error.name === "CastError") return res.status(HTTP_RESPONSE_CODE.NOT_FOUND).json({ 'success': false, 'msg': `Folder ${APP_ERROR_MESSAGE.notFound}`, 'data': [] });
        return res.status(HTTP_RESPONSE_CODE.BAD_REQUEST).json({ 'success': false, 'msg': `Error: ${error}`, 'data': null });
    }

}

module.exports = { 
    getFolder,
    getAllFolders, 
    createFolder, 
    renameFolder,
    deleteFolder,
    moveFolder
};
