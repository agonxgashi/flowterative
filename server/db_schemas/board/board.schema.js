const mongoose = require('mongoose')
const Schema = mongoose.Schema

const ListSchema = require('./list.schema')

const BoardSchema = new Schema({
  Name: String,
  Description: String,
  Admins: { type: [mongoose.Schema.Types.ObjectId] },
  Members: [{ type: mongoose.Schema.Types.ObjectId, ref: 'AppUser' }],
  Color: { type: String, default: 'primary' },
  Backlog: ListSchema,
  Lists: [ListSchema],
  CreateDate: { type: Date, default: Date.now() },
  CreatedBy: mongoose.Schema.Types.ObjectId
})

module.exports = BoardSchema
