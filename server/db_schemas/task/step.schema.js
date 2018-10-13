const mongoose = require('mongoose');
const Schema   = mongoose.Schema;


const StepSchema = new Schema({
    Content: String,
    IsDone: Boolean
});

module.exports = StepSchema;