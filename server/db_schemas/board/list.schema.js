const mongoose = require('mongoose');
const Schema   = mongoose.Schema;

const ListSchema = new Schema({
    Name: { type: String, default: 'Backlog' },
    OrderNo: Number,
    Tasks: [ { type: Schema.Types.ObjectId } ]
});

module.exports = ListSchema;