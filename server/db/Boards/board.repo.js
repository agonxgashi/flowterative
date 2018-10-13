const mongoose = require('mongoose');

const BoardSchema = require('./../../db_schemas/board/board.schema');
const BoardModel = mongoose.model('Board', BoardSchema);
module.exports = BoardModel;