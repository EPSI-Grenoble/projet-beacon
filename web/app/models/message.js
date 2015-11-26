
var mongoose = require('mongoose'),
  Schema = mongoose.Schema;

var MessageSchema = new Schema({
  titre: String,
  message: String,
  groupe: Array
});

mongoose.model('messages', MessageSchema);
