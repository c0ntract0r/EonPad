const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

// Subdocuments for folders
const folderSchema = new mongoose.Schema({
    name: { type:String,required:true },
    children: [{ type: this }],
});

// I don't want to store email. User forgot password? I don't care
const UserSchema = new mongoose.Schema ({
    first_name: { type:String, required:true },
    last_name: { type:String, required:true },
    // might as well here add validator
    username: { type:String, minLength:5, maxLength: 30, required: true, unique: true },
    // Later to add a damn validator here
    password: { type:String, required: true},
    // array here is good, so that we can enter from multiple devices
    refreshToken: [{ type: String, default: 'empty' }],
    createdAt: { type:Date, default: Date.now() },
    tags: [{ 
        type: mongoose.Schema.Types.ObjectId, 
        ref: 'Tags' }],
    folders: [folderSchema],
});

module.exports = mongoose.model('Users', UserSchema);