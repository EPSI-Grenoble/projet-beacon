
var mongoose = require('mongoose'),
  Schema = mongoose.Schema;

var UserSchema = new Schema({
  email: String,
  password: String,
  firstName: String,
  lastName: String,
  groupes: Array
});

mongoose.model('users', UserSchema);
