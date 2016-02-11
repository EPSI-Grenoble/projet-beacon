
var mongoose = require('mongoose'),
  Schema = mongoose.Schema;

var GuestSchema = new Schema({
  label: {
    type: String,
    required: "Le label est obligatoire"
  },
  code: {
    type: String,
    required: "Le code est obligatoire",
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
  },
  token : {
    type : String
  }
});

mongoose.model('guests', GuestSchema);
