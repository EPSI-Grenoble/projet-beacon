var mongoose = require('mongoose'),
  Schema = mongoose.Schema;

var GroupeSchema = new Schema({
  nom: {
    type: String,
    unique: true,
    required: true,
  }
});

mongoose.model('groupes', GroupeSchema);


