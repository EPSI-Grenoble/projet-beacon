
var mongoose = require('mongoose'),
  Schema = mongoose.Schema;

var MessageSchema = new Schema({
  titre: String,
  message: String,
  groupe: Array,
  typeMessage :  String
});

mongoose.model('messages', MessageSchema);
