var mongoose = require('mongoose'),
  Schema = mongoose.Schema,
  uniqueValidator = require('mongoose-unique-validator');


var BeaconSchema = new Schema({
  nom: {
    type: String,
    required : "Le code est obligatoire",
    unique : "Le code doit être unique"
  },
  UUID: {
    type: String,
    required : "L'UUID est obligatoire",
    unique : "L'UUID doit être unique",
    validate: [/[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}/, 'UUID n\'est pas valide']
  },
  dateCreation: {
    type: Date,
    required : true
  }
});

BeaconSchema.plugin(uniqueValidator);

mongoose.model('beacons', BeaconSchema);
