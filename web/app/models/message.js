
var mongoose = require('mongoose'),
  Schema = mongoose.Schema,
  moment = require('moment');

var MessageSchema = new Schema({
  dateCreation : Date,
  titre: String,
  message: String,
  sender: String,
  fromDate: Date,
  toDate: Date,
  destinataires: Array,
  typeMessage :  String,
  beacons : Array,
  receiveBy: Array
});

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
