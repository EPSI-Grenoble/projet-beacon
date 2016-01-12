'use strict';
var mongoose = require('mongoose'),
  BeaconModel = mongoose.model("beacons");

module.exports = {

  getAll : function(callback){
    BeaconModel
      .find()
      .sort({nom: 1})
      .exec(function(err, beaconsList){
        callback(err, beaconsList);
      })
  },

  createBeacon : function(form, callback){
    var beacon = new BeaconModel({
      nom: form.nom,
      UUID: form.uuid
    });
    beacon.save(function (err, beaconSaved) {
      callback(err, beaconSaved);
    })
  },

  deleteBeaconById : function(id, callback){
    BeaconModel.remove({_id: id}, function (err) {
      callback(err);
    });
  }

};
