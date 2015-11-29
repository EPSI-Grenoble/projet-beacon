var mongoose = require('mongoose'),
  Schema = mongoose.Schema;

var BeaconSchema = new Schema({
  nom: String,
  UUID: String
});

mongoose.model('beacons', BeaconSchema);
