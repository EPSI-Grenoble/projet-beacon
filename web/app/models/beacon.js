var mongoose = require('mongoose'),
  Schema = mongoose.Schema;

var BeaconSchema = new Schema({
  nom: {
    type: String,
    required : true
  },
  UUID: {
    type: String,
    required : true,
    unique : true,
    validate: [/[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}/, 'UUID n\'est pas valide']
  }
});

mongoose.model('beacons', BeaconSchema);
