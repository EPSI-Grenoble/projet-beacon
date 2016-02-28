
var mongoose = require('mongoose'),
  Schema = mongoose.Schema;

/**
 * Modèle de guest
 * Son libelé
 * Son code
 * Activé ou non
 * Liste des device associé au compte invité
 * Jeton d'authentification
 */
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
