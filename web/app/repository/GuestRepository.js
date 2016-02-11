'use strict';
var mongoose = require('mongoose'),
  GuestModel = mongoose.model("guests");

module.exports = {

  tokenValid: function (token, callback) {
    GuestModel
      .findOne({token: token})
      .exec(function (err, userConnected) {
        callback(err, userConnected)
      })
  },

  findById : function(id, callback){
    GuestModel
      .findById(id)
      .exec(function (err, guest) {
        callback(err, guest)
      })
  },

  createGuest: function (form, callback) {
    var guest = new GuestModel({
      label: form.label,
      code: form.code
    });
    guest.save(function (err, guest) {
      callback(err, guest)
    });
  },

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

  getAllGuest: function (callback) {
    GuestModel
      .find()
      .sort({label: 1})
      .exec(function (err, guests) {
        callback(err, guests);
      });
  },

  removeGroupe: function (idGroupe, callback) {
    GuestModel
      .findById(idGroupe)
      .remove(function (err, groupe) {
        callback(err);
      });
  },

  checkCode: function (code, callback) {
    GuestModel
      .findOne({"code": code, "activate": true})
      .exec(function (err, guest) {
        callback(err, guest)
      });
  },

  findByIdInDestinataireList: function(destinatairesList, callback){
    GuestModel
      .find({"_id": {$in: destinatairesList}})
      .exec(function (err, guests) {
        callback(err, guests)
      });
  }
};
