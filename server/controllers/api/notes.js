const Notes = require('../../models/notes');
const Users = require('../../models/users');
const Folders = require('../../models/folders');
const { HTTP_RESPONSE_CODE, APP_ERROR_MESSAGE, APP_SUCCESS_MESSAGE } = require('../../utils/constants');

const createNote = async (req, res) => {
    const reqUser = await Users.findById(req.user.user_id);
    if (!reqUser) {
        return res.status(HTTP_RESPONSE_CODE.BAD_REQUEST.json({ 'success': false, 'msg': APP_ERROR_MESSAGE.badRequest, 'data': null }));
    }

    const {noteTitle, noteBody, folderId } = req.body;
    const parentFolder = folderId === 'null' || !folderId ? null : folderId;
    
    if (parentFolder) {
        const parentResult = await Folders.findById(folderId).exec();
        if (!parentResult) return res.status(HTTP_RESPONSE_CODE.NOT_FOUND).json({ 'success': false ,'msg': `folder ${APP_ERROR_MESSAGE.notFound}`, data: null});
    }
    try {

        const newNote = new Notes ({
            title: noteTitle,
            body: noteBody,
            user: reqUser._id,
            parentFolder: parentFolder
        });

        const result = await newNote.save();

        if (parentFolder) {
            const parentResult = await Folders.findById(folderId).select('notes').exec();
            parentResult.notes.push(result._id);

            await parentResult.save();
        }

    } catch(error) {
        return res.status(HTTP_RESPONSE_CODE.BAD_REQUEST).json({ 'success': false, 'msg': `Error: ${error}`, 'data': null });
    }
    return res.status(HTTP_RESPONSE_CODE.CREATED).json({ 'success': true, 'msg': `Note ${noteTitle} ${APP_SUCCESS_MESSAGE.objectCreated}` });
}

const getAllNotes = async (req, res) => {
    const reqUser = await Users.findById(req.user.user_id);
    if (!reqUser) 
        return res.status(HTTP_RESPONSE_CODE.BAD_REQUEST)
        .json({ 'success': false, 'msg': APP_ERROR_MESSAGE.badRequest, 'data': null });

    try {

        const allNotes = await Notes.find({ user: req.user.user_id }).select('_id title body parentFolder').exec();
        return res.status(HTTP_RESPONSE_CODE.OK).json({ 'success': true, 'msg': `Notes list ${APP_SUCCESS_MESSAGE.objectFound}`, 'data': allNotes });

    } catch (error) {
        return res.status(HTTP_RESPONSE_CODE.BAD_REQUEST).json({ 'success': false, 'msg': `Unknown error: ${error}`, 'data': null });
    }

}

const getNote = async (req, res) => {
    const reqUser = await Users.findById(req.user.user_id);

    if (!reqUser)
        return res.status(HTTP_RESPONSE_CODE.BAD_REQUEST).json({ 'success': false, 'msg': APP_ERROR_MESSAGE.badRequest, 'data': null });

    try {
        const { noteId } = req.params;
        const note = await Notes.findOne({ user: reqUser._id, _id: noteId }).select('_id title body parentFolder').exec();

        return res.status(HTTP_RESPONSE_CODE.OK).json({ success: true, 'msg': `Note ${APP_SUCCESS_MESSAGE.objectFound}`, 'data': note });

    } catch (error) {
        if (error.name === "CastError") return res.status(HTTP_RESPONSE_CODE.NOT_FOUND).json({ 'success': false, 'msg': `Note ${APP_ERROR_MESSAGE.notFound}`, 'data': [] });
        // Other generic error message
        return res.status(HTTP_RESPONSE_CODE.BAD_REQUEST).json({ 'success': false, 'msg': `Error: ${error}`, 'data': null });
    }

}

const deleteNote = async (req, res) => {
    const reqUser = await Users.findById(req.user.user_id);

    if (!reqUser)
        return res.status(HTTP_RESPONSE_CODE.BAD_REQUEST).json({ 'success': false, 'msg': APP_ERROR_MESSAGE.badRequest, 'data': null });

    try {

        const { noteId } = req.params;
        const note = await Notes.findOne({ user: reqUser._id, _id: noteId }).exec();
        if (note.parentFolder !== null) {
            const parentFolder = await Folders.findOne({ user: reqUser._id, _id: note.parentFolder }).exec();
            parentFolder.notes.pull(note._id);
            await parentFolder.save();
        }

        await Notes.findByIdAndDelete(note._id);

        return res.status(HTTP_RESPONSE_CODE.OK).json({ 'success': true, 'msg': `Note with ${noteId} Deleted successfully.`, 'data': [] });

    } catch(error) {
        if (error.name === "CastError") return res.status(HTTP_RESPONSE_CODE.NOT_FOUND).json({ 'success': false, 'msg': `Note ${APP_ERROR_MESSAGE.notFound}`, 'data': [] });
        return res.status(HTTP_RESPONSE_CODE.BAD_REQUEST).json({ 'success': false, 'msg': `Unknown error: ${error}`, 'data': null });
    }
}

const moveNote = async (req, res) => {
    const reqUser = await Users.findById(req.user.user_id);

    if (!reqUser)
        return res.status(HTTP_RESPONSE_CODE.BAD_REQUEST).json({ 'success': false, 'msg': APP_ERROR_MESSAGE.badRequest, 'data': null });

    let parentDoc = null;

    const { newParentId } = req.body;
    const { noteId } = req.params;
    const newParent = newParentId === 'null' || !newParentId ? null : newParentId;

    if (newParent) {
        parentDoc = await Folders.findById(newParentId).exec();
        if (!parentDoc) return res.status(HTTP_RESPONSE_CODE.NOT_FOUND).json({ 'success': false ,'msg': `folder ${APP_ERROR_MESSAGE.notFound}`, data: null});
    }

    try {
        const note = await Notes.findOne({ user: reqUser._id, _id: noteId }).select('_id title body parentFolder').exec();

        // if note was already inside a folder
        if (note.parentFolder) {
            const oldFolder = await Folders.findOne({ user: reqUser._id, _id: note.parentFolder }).exec();
            oldFolder.notes.pull(note._id);

            await oldFolder.save();
        }

        note.parentFolder = newParent;

        // if a parent folder id was given, move it there
        if (parentDoc) {
            parentDoc.notes.push(note._id);
            await parentDoc.save();
        }

        await note.save();

        return res.status(HTTP_RESPONSE_CODE.OK).json({ 'success': true, 'msg': `Note with ID ${noteId} moved to ${newParent}`, data: [] });

    } catch(error) {
        if (error.name === "CastError") return res.status(HTTP_RESPONSE_CODE.NOT_FOUND).json({ 'success': false, 'msg': `Note ${APP_ERROR_MESSAGE.notFound}`, 'data': [] });
        return res.status(HTTP_RESPONSE_CODE.BAD_REQUEST).json({ 'success': false, 'msg': `Error: ${error}`, 'data': null });
    }
}

// Update Title and body note fields, not the parent. it is the job of moveNote
const updateNote = async (req, res) => {

    const { title, body } = req.body;
    const { noteId } = req.params;

    const updates = {};

    const reqUser = await Users.findById(req.user.user_id);

    if (!reqUser)
        return res.status(HTTP_RESPONSE_CODE.BAD_REQUEST).json({ 'success': false, 'msg': APP_ERROR_MESSAGE.badRequest, 'data': null });

    if (title === undefined && body === undefined) return res.status(HTTP_RESPONSE_CODE.NO_CONTENT).json({'success': true, 'msg': 'Nothing to be updated.', data: []});

    try {
        // const note = await Notes.findOne({ user: reqUser._id, _id: noteId }).exec();
        if (title) updates.title = title.trim();
        if (body !== undefined) updates.body = body.trim();

        const updatedNote = await Notes.findOneAndUpdate(
            { user: reqUser._id, _id: noteId },
            { $set: updates },
            { new: true, runValidators: true }
        );

        return res.status(HTTP_RESPONSE_CODE.OK).json({success:true, 'msg': `Note with id ${updatedNote._id} ${APP_SUCCESS_MESSAGE.objectUpdated}`, data: updatedNote});

    } catch (error) {
        if (error.name === "CastError") return res.status(HTTP_RESPONSE_CODE.NOT_FOUND).json({ 'success': false, 'msg': `Note ${APP_ERROR_MESSAGE.notFound}`, 'data': [] });
    }

}

module.exports = { 
    createNote,
    getAllNotes,
    getNote,
    updateNote,
    deleteNote,
    moveNote
 };