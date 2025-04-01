const mongoose = require('mongoose');

const NotesSchema = new mongoose.Schema({
    title: { type:String, required:true },
    body: { type:String },
    createdAt: { type:Date, default: Date.now() },
    ModifiedAt: { type:Date, default: Date.now() },
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'Users', required: true },
    in_folder: { type: mongoose.Schema.Types.ObjectId, required: false },
    tags: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Tags' }],
});

module.exports = mongoose.model('Notes', NotesSchema);