const mongoose = require('mongoose');

// I don't want to store email. User forgot password? I don't care
const UserSchema = new mongoose.Schema ({
    first_name: { type:String, required:true },
    last_name: { type:String, required:true },
    // might as well here add validator
    username: { type:String, minLength:5, maxLength: 30, required: true },
    // Later to add a damn validator here
    password: { type:String, minLength:8, required: true},
    createdAt: { type:Date, default: Date.now() },
    tags: [{ 
        type: mongoose.Schema.Types.ObjectId, 
        ref: 'Tags' }],
    folders: [{
        type: String,
        folderId: mongoose.Schema.Types.ObjectId
    }]
});

module.exports = mongoose.model('Users', UserSchema);