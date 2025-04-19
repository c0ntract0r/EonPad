const mongoose = require('mongoose');


const FolderSchema = new mongoose.Schema(
    {
        name: { type: String, required: true, trim: true },
        children: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Folders' }],
        notes: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Notes' }],
        parentId: { type: mongoose.Schema.Types.ObjectId, ref: 'Folders', default: null },
        user: { type: mongoose.Schema.Types.ObjectId, ref: 'Users', required: true }
    }, 
    { timestamps: true }
);

module.exports = mongoose.model('Folders', FolderSchema);
