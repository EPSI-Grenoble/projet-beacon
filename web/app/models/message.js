var mongoose = require('mongoose'),
  Schema = mongoose.Schema,
  moment = require('moment');

var MessageSchema = new Schema({

  dateCreation: {
    type: Date
  },

  titre: {
    type: String,
    required: 'Le titre est requis'
  },

  message: {
    type: String,
    required: 'Le message est requis'
  },

  sender: {
    type: String
  },

  fromDate: {
    type: Date,
  },

  toDate: {
    type: Date
  },

  destinataires: {
    type: Array,
    required: 'Au moins un destinataire ou un invité'
  },

  typeMessage: {
    type: String,
    required: 'Le type est requis'
  },

  beacons: {
    type: Array
  },

  beaconsProximity: {
    type: String
  },

  receiveBy: Array

});

MessageSchema.virtual('getPeriod').get(function () {
  if (this.fromDate == null && this.toDate == null) {
    return "Sans période"
  } else if (this.fromDate == null) {
    return "Jusqu'au " + moment(this.toDate).format("DD/MM/YYYY");
  } else if (this.toDate == null) {
    return "A partir du " + moment(this.fromDate).format("DD/MM/YYYY");
  } else {
    return "Du " + moment(this.fromDate).format("DD/MM/YYYY") + " au " + moment(this.toDate).format("DD/MM/YYYY");
  }
});


mongoose.model('messages', MessageSchema);
