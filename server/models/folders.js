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

// ensure no folder to be with repeating name exist in the same level
FolderSchema.index({ name: 1, parentId: 1 }, { unique: true })

module.exports = mongoose.model('Folders', FolderSchema);
