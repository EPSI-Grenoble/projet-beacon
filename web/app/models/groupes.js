
var mongoose = require('mongoose'),
  Schema = mongoose.Schema;

var GroupeSchema = new Schema({
  nom : {
  type : String,
  required : true
  }
});

mongoose.model('groupes', GroupeSchema);


