const mongoose = require('mongoose');
const constants = require('../utils/constants');

const folderSchema = new mongoose.Schema({
    name: { type:String,required:true },
    children: [{ type: this }],
});

// I don't want to store email. User forgot password? I don't care
const UserSchema = new mongoose.Schema ({
    first_name: { type:String, required:true },
    last_name: { type:String, required:true },
    username: { 
        type:String, 
        required: true,
        unique: true,
        trim: true,
        lowercase: true,
    },
    password: { type:String, required: true},
    refreshToken: [{ type: String, default: 'empty' }],
    createdAt: { type:Date, default: Date.now() },
    tags: [{ 
        type: mongoose.Schema.Types.ObjectId, 
        ref: 'Tags' }],
    folders: [folderSchema],
});

module.exports = mongoose.model('Users', UserSchema);