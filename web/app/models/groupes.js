
var mongoose = require('mongoose'),
  Schema = mongoose.Schema;

var GroupeSchema = new Schema({
  nom: String
});

mongoose.model('groupes', GroupeSchema);


