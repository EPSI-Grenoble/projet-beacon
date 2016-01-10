'use strict';
var mongoose = require('mongoose'),
  UserRepository = require("./UserRepository"),
  GroupeModel = mongoose.model("groupes");

module.exports = {

  getAll : function(callback){
    GroupeModel
      .find()
      .sort({nom: 1})
      .exec(function(err, groupesList){
        console.log(groupesList);
        callback(err, groupesList);
      })
  },

  createGroupe : function(form, callback){
    var groupe = new GroupeModel(form);
    groupe.save(function (err, groupeSaved) {
      callback(err, groupeSaved);
    })
  },

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
