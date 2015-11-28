
var mongoose = require('mongoose'),
  Schema = mongoose.Schema;

var UserSchema = new Schema({
  email: String,
  password: String,
  firstName: String,
  lastName: String,
  groupes: Array
});
//test comit
mongoose.model('users', UserSchema);
