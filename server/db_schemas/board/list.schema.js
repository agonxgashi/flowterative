const mongoose = require('mongoose');
const Schema   = mongoose.Schema;

const ListSchema = new Schema({
    Name: String,
    OrderNo: Number
});

module.exports = ListSchema;