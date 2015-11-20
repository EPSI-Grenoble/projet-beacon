
var mongoose = require('mongoose'),
  Schema = mongoose.Schema;

var UsersSchema = new Schema({
  username: String,
  password: String
});

mongoose.model('users', UsersSchema);
