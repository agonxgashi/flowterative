const mongoose = require('mongoose');
const Schema   = mongoose.Schema;


const CommentSchema = new Schema({
    Content: String,
    CreatedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'AppUser' },
    CreateDate: { type: Date, default: Date.now() }
});

module.exports = CommentSchema;