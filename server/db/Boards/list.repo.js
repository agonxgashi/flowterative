const mongoose = require('mongoose')

const ListSchema = require('./../../db_schemas/board/list.schema')
const ListModel = mongoose.model('List', ListSchema)
module.exports = ListModel
