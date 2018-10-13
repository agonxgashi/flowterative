const mongoose   = require('mongoose');
const AppUserSchema = require('./../../db_schemas/auth/appUser.schema');

const AppUserModel = mongoose.model('AppUser', AppUserSchema);
module.exports = AppUserModel;