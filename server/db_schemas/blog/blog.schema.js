const mongoose = require('mongoose');
const Schema   = mongoose.Schema;

const BlogPostSchema = new Schema({
    Title     : String,
    Content   : String,
    CreateDate: Date,
    CreatedBy : String
});

module.exports = BlogPostSchema;
