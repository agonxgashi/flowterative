const mongoose = require('mongoose');
const BlogPostSchema = require('./../../db_schemas/blog/blog.schema');

var BlogPostModel = mongoose.model('BlogPost', BlogPostSchema);

module.exports = BlogPostModel;