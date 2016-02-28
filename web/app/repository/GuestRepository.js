'use strict';
var mongoose = require('mongoose'),
  GuestModel = mongoose.model("guests");

module.exports = {

  /**
   * Vérifie que le token du guest est valide
   * @param token
   * @param callback
     */
  tokenValid: function (token, callback) {
    GuestModel
      .findOne({token: token})
      .exec(function (err, userConnected) {
        callback(err, userConnected)
      })
  },

  /**
   * Récupère un guest par son identifiant
   * @param id
   * @param callback
     */
  findById : function(id, callback){
    GuestModel
      .findById(id)
      .exec(function (err, guest) {
        callback(err, guest)
      })
  },

  /**
   * Créer un guest
   * @param form
   * @param callback
     */
  createGuest: function (form, callback) {
    var guest = new GuestModel({
      label: form.label,
      code: form.code
    });
    guest.save(function (err, guest) {
      callback(err, guest)
    });
  },

  /**
   * Modifier un guest
   * @param id
   * @param form
   * @param callback
     */
  updateGuest: function (id, form, callback) {
    GuestModel
      .findOne({"_id": id})
      .exec(function (err, guest) {
        guest.label = form.label;
        guest.code = form.code;
        guest.activate = form.activate;
        guest.save(function (err, guestSaved) {
          callback(err, guestSaved)
        })
      });
  },

  /**
   * Récupèrer tous les guests
   * @param callback
     */
  getAllGuest: function (callback) {
    GuestModel
      .find()
      .sort({label: 1})
      .exec(function (err, guests) {
        callback(err, guests);
      });
  },

  /**
   * Supprimer un guest
   * @param idGroupe
   * @param callback
     */
  removeGroupe: function (idGroupe, callback) {
    GuestModel
      .findById(idGroupe)
      .remove(function (err, groupe) {
        callback(err);
      });
  },

  /**
   * Vérifier que le code du guest est valide
   * @param code
   * @param callback
     */
  checkCode: function (code, callback) {
    GuestModel
      .findOne({"code": code, "activate": true})
      .exec(function (err, guest) {
        callback(err, guest)
      });
  },

  /**
   * Récupèrer les guests grâce à la liste d'identifians
   * @param destinatairesList liste d'identifiants de guest
   * @param callback
     */
  findByIdInDestinataireList: function(destinatairesList, callback){
    GuestModel
      .find({"_id": {$in: destinatairesList}})
      .exec(function (err, guests) {
        callback(err, guests)
      });
  }
};
