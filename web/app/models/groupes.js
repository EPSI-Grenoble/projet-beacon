var mongoose = require('mongoose'),
  Schema = mongoose.Schema;

/**
 * Modèle d'une liste de diffusion
 * Son nom
 */
var GroupeSchema = new Schema({
  nom: {
    type: String,
    unique: true,
    required: true
  }
});

mongoose.model('groupes', GroupeSchema);


