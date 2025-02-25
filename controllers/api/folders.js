const Users = require('../../models/users');

const getAllFolders = async (req, res) => {

}

const createFolder = async (req, res) => {
    const { folderName } = req.body;
    const foundUser = req.user.name;
    const user = await Users.findOne({ username: foundUser });
    if (!user) { res.json({ 'msg': 'No user was found!' }) };
    if (!folderName) return res.sendStatus(404).json({ 'msg': 'Sorry,no folder name found.' });
    user.folders.push({ folderName });

    await user.save();
    return res.sendStatus(201);
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
