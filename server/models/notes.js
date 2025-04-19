const mongoose = require('mongoose');

const NotesSchema = new mongoose.Schema({
    title: { type:String, required:true, trim: true },
    body: { type:String, default: '' },
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'Users', required: true },
    parentFolder: {type: mongoose.Schema.Types.ObjectId, ref: 'Folders', default: null}
}, { timestamps: true });

module.exports = mongoose.model('Notes', NotesSchema);