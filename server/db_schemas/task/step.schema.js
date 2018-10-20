const mongoose = require('mongoose');
const Schema   = mongoose.Schema;


const StepSchema = new Schema({
    Content: String,
    IsDone: { type: Boolean, default: false }
});

module.exports = StepSchema;