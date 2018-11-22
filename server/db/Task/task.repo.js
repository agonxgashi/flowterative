const mongoose = require('mongoose')

const TaskSchema = require('./../../db_schemas/task/task.schema')
const TaskModel = mongoose.model('Task', TaskSchema)
module.exports = TaskModel
