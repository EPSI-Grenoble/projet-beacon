'use strict';
var mongoose = require('mongoose'),
  UserRepository = require("./UserRepository"),
  GroupeModel = mongoose.model("groupes");

module.exports = {

  /**
   * Recupère tous les groupes
   * @param callback
     */
  getAll : function(callback){
    GroupeModel
      .find()
      .sort({nom: -1})
      .exec(function(err, groupesList){
        callback(err, groupesList);
      })
  },

  /**
   * Créer un groupe
   * @param form
   * @param callback
     */
  createGroupe : function(form, callback){
    var groupe = new GroupeModel(form);
    groupe.save(function (err, groupeSaved) {
      callback(err, groupeSaved);
    })
  },

  /**
   * Supprimer un groupe et supprimer le groupe dans le modèle user
   * @param idGroupe
   * @param callback
     */
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

  /**
   * Mettre à jour le nom du groupe
   * @param idGroupe
   * @param nomGroupe
   * @param callback
     */
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

  /**
   * Récupèrer les membres d'un groupe
   * @param idGroupe
   * @param callback
     */
  getMembresGroupe: function (idGroupe, callback) {
    GroupeModel
      .findById(idGroupe)
      .exec(function (err, groupe) {
        UserRepository.getMembresGroupe(groupe.nom, callback);
      });
  },

  /**
   * Supprimer un membre d'un groupe
   * @param idGroupe
   * @param idUser
   * @param callback
     */
  removeMembresGroupe: function (idGroupe, idUser, callback) {
    GroupeModel
      .findById(idGroupe)
      .exec(function (err, groupe) {
        UserRepository.removeFromGroupe(groupe.nom, idUser, callback);
      });
  },

  /**
   * Ajouter un membre dans un groupe
   * @param idGroupe
   * @param userId
   * @param callback
     */
  addUserToGroupe: function (idGroupe, userId, callback) {
    GroupeModel
      .findById(idGroupe)
      .exec(function (err, groupe) {
        UserRepository.addToGroupe(groupe.nom, userId, callback);
      });
  }

};
