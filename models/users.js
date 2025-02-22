const mongoose = require('mongoose');
const constants = require('../utils/constants');

// Subdocuments for folders
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
        required: [true, 'Username is required'],
        unique: true,
        trim: true,
        lowercase: true,
        validate: [
            {
                validator: function(v) {
                    return v.length >= 6 && v.length <= 14;
                },
                message: 'Username must be between 6 and 14 characters long.'
            },
            {
                validator: function(v) {
                    return constants.RE_USER.test(v);
                },
                message: 'Username must start with a letter, be alphanumeric, and only use undescores between characters.'
            }
        ]
    },
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