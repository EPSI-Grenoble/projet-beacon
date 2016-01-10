
var mongoose = require('mongoose'),
  Schema = mongoose.Schema;

var UserSchema = new Schema({
  email: {
    type: String,
    unique: true,
    required: true,
    validate: [/.+\@.+\..+/, 'Email n\'est pas valide']
  },
  password: {
    type: String,
    required: true
  },
  lastName: {
    type: String,
    required: true
  },
  firstName: {
    type: String,
    required: true
  },
  token: {
    type: String,
    unique: true,
    required: false,
    sparse: true
  },
  date_token: {
    type: Date
  },
  device_token: {
    type: String,
    unique: true,
    required: false,
    sparse: true
  },
  groupes: Array
});


mongoose.model('users', UserSchema);
