const mongoose = require('mongoose');
const config = require('../config.json');
const user = require('../model/user.model');
const ticket = require('../model/ticket.model');
const refreshtoken = require('../model/refresh-token.model');
const fileStorage = require('../model/file.model');

mongoose.connect(process.env.MONGODB_URI || config.connectionString);
mongoose.Promise = global.Promise;

function isValidId(id) {
  return mongoose.Types.ObjectId.isValid(id);
}

module.exports = {
  User: user,
  Ticket: ticket,
  RefreshToken: refreshtoken,
  FileStorage: fileStorage,
  isValidId,
};
