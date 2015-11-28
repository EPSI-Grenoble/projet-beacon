
var mongoose = require('mongoose'),
  Schema = mongoose.Schema;

var MessageSchema = new Schema({
  titre: String,
  message: String,
  fromDate: Date,
  toDate: Date,
  groupe: Array,
  typeMessage :  String
  dateCreation : {type:Date , default :Date.now} 
});

mongoose.model('messages', MessageSchema);
