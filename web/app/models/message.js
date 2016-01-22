
var mongoose = require('mongoose'),
  Schema = mongoose.Schema,
  moment = require('moment');

var MessageSchema = new Schema({

  dateCreation : {
  type : Date
  },

  titre: {
  type : String,
  required: true
  },

  message: {
  type : String,
  required: true
  },

  sender: {
  type : String
  },

  fromDate: {
  type : Date,
  required: true
  },

  toDate: {
  type : Date,
  required: true
  },

  destinataires: {
  type : Array,
  required: true
  },

  typeMessage :  {
  type : String
  },

  beacons : {
  type : Array
  },

  beaconsProximity : {
  type : String
  },

  receiveBy : Array

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
