const mongoose = require('mongoose');

const TagSchema = new mongoose.Schema({
    userName: { type: mongoose.Schema.Types.ObjectId, ref: "Users", required: true },
    tagName: { type: String, required: true },
    tagColor: { type: String, default: "#000000" }
});

module.exports = mongoose.model('Tags', TagSchema);