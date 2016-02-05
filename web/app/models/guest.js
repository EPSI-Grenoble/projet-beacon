
var mongoose = require('mongoose'),
  Schema = mongoose.Schema;

var GuestSchema = new Schema({
  label: {
    type: String,
    required: true
  },
  code: {
    type: String,
    required: true,
    unique: true,
    lowercase : true
  },
  activate: {
    type: Boolean,
    required: true,
    default: false
  },
  device_token : {
    type: Array
  }
});


mongoose.model('guests', GuestSchema);
