const mongoose = require('mongoose');
const Schema   = mongoose.Schema;

const ListSchema = new Schema({
    Name: { type: String, default: 'Backlog' },
    Wip: { type: Number, default: 0 },
    OrderNo: Number,
    Tasks: [ { type: Schema.Types.ObjectId } ]
});

module.exports = ListSchema;