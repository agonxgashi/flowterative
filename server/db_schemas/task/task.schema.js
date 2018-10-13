const mongoose = require('mongoose');
const Schema   = mongoose.Schema;

const CommentSchema = require('./comment.schema')
const StepSchema = require('./step.schema')

const TaskSchema = new Schema({
    ProjectId: { type: mongoose.Schema.Types.ObjectId },
    ListId: { type: mongoose.Schema.Types.ObjectId },
    Code: Number,
    Name: String,
    Description: String,
    Comments: [CommentSchema],
    DueDate: { type: Date, default: Date.now() },
    InsDate: { type: Date, default: Date.now() },
    Members: { type: [mongoose.Schema.Types.ObjectId] },
    Steps: [StepSchema],
    Tag: String
});

module.exports = TaskSchema;