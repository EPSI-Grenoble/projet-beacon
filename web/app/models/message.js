
var mongoose = require('mongoose'),
  Schema = mongoose.Schema,
  moment = require('moment');

var MessageSchema = new Schema({
  titre: String,
  message: String,
  fromDate: Date,
  toDate: Date,
  groupe: Array,
  typeMessage :  String
  dateCreation : {type:Date , default :Date.now} 
});
//test
MessageSchema.virtual('getPeriod').get(function() {
  if(this.fromDate == null && this.toDate == null){
    return "Sans période"
  } else if(this.fromDate == null){
    return "Jusqu'au "+moment(this.toDate).format("DD/MM/YYYY");
  } else if(this.toDate == null){
    return "A partir du "+moment(this.fromDate).format("DD/MM/YYYY");
  } else {
    return "Du "+moment(this.fromDate).format("DD/MM/YYYY")+" au "+moment(this.toDate).format("DD/MM/YYYY");
  }
});

mongoose.model('messages', MessageSchema);
