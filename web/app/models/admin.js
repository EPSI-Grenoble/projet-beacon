
var mongoose = require('mongoose'),
  Schema = mongoose.Schema;

var AdminSchema = new Schema({
  email: String,
  password: String,
  lastName: String,
  firstName: String,
  token: String,
  date_token: Date
});

mongoose.model('admins', AdminSchema);
