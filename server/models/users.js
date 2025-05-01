const mongoose = require('mongoose');

// I don't want to store email. User forgot password? I don't care(for now :D)
const UserSchema = new mongoose.Schema ({
    first_name: { type:String, required:true },
    last_name: { type:String, required:true },
    username: { type:String, required: true, unique: true, trim: true, lowercase: true },
    password: { type:String, required: true},
    refreshToken: [{ type: String, default: 'empty' }],
    createdAt: { type:Date, default: Date.now() },
    // notes: { type: mongoose.Schema.Types.ObjectId, ref: 'Notes' },
    // folders: { type: mongoose.Schema.Types.ObjectId, ref: 'Folders' }
}, { timestamps: true });

module.exports = mongoose.model('Users', UserSchema);