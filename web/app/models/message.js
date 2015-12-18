
var mongoose = require('mongoose'),
  Schema = mongoose.Schema,
  moment = require('moment');

var MessageSchema = new Schema({
  sender: String,
  titre: String,
  message: String,
  fromDate: Date,
  toDate: Date,
  destinataires: Array,
  typeMessage :  String,
  beacons : Array,
  dateCreation : Date
});

MessageSchema.virtual('getPeriod').get(function() {
  if(this.fromDate == null && this.toDate == null){
    return "Sans période"
  } else if(this.fromDate == null){
    return "Jusqu'au "+moment(this.toDate).format("DD/MM/YYYY");
  } else if(this.toDate == null){
    return "A partir du "+moment(this.fromDate).format("DD/MM/YYYY");
  } else {
    return "Du "+moment(this.fromDate).format("DD/MM/YYYY")+" au "+moment(this.toDate).format("DD/MM/YYYY");
  }
});

/*du code pour essayer (  Pierre Louis  )*/
MessageSchema.virtual('getValiditeMessage').get(function() {
//je suppose que les conditions testées ci-dessous sont véritablement nécéssaires à la creation d'un message

  if(this.destinataires == null)
  {
    return "Déstinataires invalides"
  }
  else if (this.message == null)
  {
    return "Méssage manquant"
  }
  else if (this.titre == null)
  {
    return "Titre manquant"
  }
  else if (this.dateCreation == null)
  {
    return "Date de creation manquante"
  }
});
mongoose.model('messages', MessageSchema);
