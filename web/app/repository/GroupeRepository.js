/**
 * Created by mchoraine on 09/01/2016.
 */
var mongoose = require('mongoose'),
  UserRepository = require("./UserRepository"),
  GroupeModel = mongoose.model("groupes");

module.exports = {
  updateGroupe: function (idGroupe, nomGroupe, callback) {
    GroupeModel
      .findById(idGroupe)
      .exec(function (err, groupe) {
        var oldNom = groupe.nom;
        groupe.nom = nomGroupe;
        groupe.save(function (err, groupe) {
          callback(groupe);
        });
        UserRepository.updateGroupe(oldNom, nomGroupe);
      })
  }
};
