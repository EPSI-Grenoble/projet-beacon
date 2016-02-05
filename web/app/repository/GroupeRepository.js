'use strict';
var mongoose = require('mongoose'),
  UserRepository = require("./UserRepository"),
  GroupeModel = mongoose.model("groupes");

module.exports = {

  getAll : function(callback){
    GroupeModel
      .find()
      .sort({nom: -1})
      .exec(function(err, groupesList){
        callback(err, groupesList);
      })
  },

  createGroupe : function(form, callback){
    var groupe = new GroupeModel(form);
    groupe.save(function (err, groupeSaved) {
      callback(err, groupeSaved);
    })
  },

  removeGroupe : function(idGroupe, callback){
    GroupeModel
      .findById(idGroupe)
      .exec(function (err, groupe) {
        UserRepository.deleteGroupe(groupe.nom, function(){
          groupe.remove(function(){
            callback(err);
          })
        });
      });
  },

  updateGroupe: function (idGroupe, nomGroupe, callback) {
    GroupeModel
      .findById(idGroupe)
      .exec(function (err, groupe) {
        var oldNom = groupe.nom;
        groupe.nom = nomGroupe;
        groupe.save(function (err, groupe) {
          callback(err, groupe);
        });
        UserRepository.updateGroupe(oldNom, nomGroupe);
      })
  },

  getMembresGroupe: function (idGroupe, callback) {
    GroupeModel
      .findById(idGroupe)
      .exec(function (err, groupe) {
        UserRepository.getMembresGroupe(groupe.nom, callback);
      });
  },

  removeMembresGroupe: function (idGroupe, idUser, callback) {
    GroupeModel
      .findById(idGroupe)
      .exec(function (err, groupe) {
        UserRepository.removeFromGroupe(groupe.nom, idUser, callback);
      });
  },

  addUserToGroupe: function (idGroupe, userId, callback) {
    GroupeModel
      .findById(idGroupe)
      .exec(function (err, groupe) {
        UserRepository.addToGroupe(groupe.nom, userId, callback);
      });
  }

};
