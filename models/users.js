const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

// Subdocuments for folders
const folderSchema = new mongoose.Schema({
    name: { type:String,required:true },
    children: [{ type: this }],
});

// subdocuments for refresh tokens
const RefreshTokenSchema = new mongoose.Schema({
    token: { type: String, required: true },
    expirationDate: { type:Date, required: true },
    createdAt: { type:Date, default: Date.now(),
    revoked: { type: Boolean, default: false }}
});

// I don't want to store email. User forgot password? I don't care
const UserSchema = new mongoose.Schema ({
    first_name: { type:String, required:true },
    last_name: { type:String, required:true },
    // might as well here add validator
    username: { type:String, minLength:5, maxLength: 30, required: true, unique: true },
    // Later to add a damn validator here
    password: { type:String, required: true},
    refreshTokenDocs: [RefreshTokenSchema],
    createdAt: { type:Date, default: Date.now() },
    tags: [{ 
        type: mongoose.Schema.Types.ObjectId, 
        ref: 'Tags' }],
    folders: [folderSchema],
});

UserSchema.pre('save', async function (next) {
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
    next();
})

UserSchema.methods.comparePassword = async function(candidatePassword){
    return await bcrypt.compare(candidatePassword, this.password);
}

module.exports = mongoose.model('Users', UserSchema);