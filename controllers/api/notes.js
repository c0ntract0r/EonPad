const Notes = require('../../models/notes');
const Users = require('../../models/users');

const createNewNote = async (req, res) => {
    const { noteTitle, noteBody } = req.body;
    const foundUser = req.user.user_id;
    if (!noteTitle || !noteBody) res.json({msg: 'OOPSIE! YOU MADE A FUCKIE WUCKIE!'});
    try {
        const user = Users.findById(foundUser);
        if (!user) { res.json({ 'msg': 'No user was found!' }) };
        const note = new Notes({
            title: noteTitle,
            body: noteBody,
            user: foundUser
        });
        await note.save();
        res.status(201).json({ message: 'Note created!', note });
    } catch (err) {
        console.log(err);
    }
}

const getAllNotes = async (req, res) => {
    res.json({msg: 'WHY?'});
}

module.exports = { createNewNote, getAllNotes };