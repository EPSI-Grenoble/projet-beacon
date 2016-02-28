'use strict';
var mongoose = require('mongoose'),
  BeaconModel = mongoose.model("beacons");

module.exports = {

  /**
   * Récupère tous les beacons
   * @param callback
     */
  getAll : function(callback){
    BeaconModel
      .find()
      .sort({nom: 1})
      .exec(function(err, beaconsList){
        callback(err, beaconsList);
      })
  },

  /**
   * Créer un beacon
   * @param formulaire
   * @param callback
     */
  createBeacon : function(form, callback){
    var beacon = new BeaconModel({
      nom: form.nom,
      UUID: form.uuid,
      dateCreation: new Date()
    });
    beacon.save(function (err, beaconSaved) {
      callback(err, beaconSaved);
    })
  },

  /**
   * Supprimer un beacon
   * @param id du beacon
   * @param callback
     */
  deleteBeaconById : function(id, callback){
    BeaconModel.remove({_id: id}, function (err) {
      callback(err);
    });
  }

};
