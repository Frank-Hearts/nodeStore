const mongoose = require('mongoose');

const tokenSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Types.ObjectId,
        require: true,
        ref: 'User'
    },
    code: {
        type: String,
        require: true
    },
    createdAt: {
        type: Date,
        default: Date.now,
        expires: 600
    }
});

module.exports = mongoose.model("Token", tokenSchema)