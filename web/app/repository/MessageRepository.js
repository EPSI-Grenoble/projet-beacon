'use strict';
var mongoose = require('mongoose'),
  Utils = require("../services/utils"),
  UserRepository = require("../repository/UserRepository"),
  MessageModel = mongoose.model("messages");

module.exports = {

  createMessage : function(body, callback){
    var message = new MessageModel({
      "titre": body.titre,
      "message": body.content,
      "fromDate": body.fromdate,
      "toDate": body.todate,
      "beacons": body.beacons,
      "beaconsProximity": body.beaconsProximity,
      "destinataires": body.destinataires,
      "typeMessage": body.type,
      "dateCreation": new Date()
    });
    message.save(function (err) {
          callback(err, message);
    });
  },

  findMessageForThisUserAndThisBeacon: function (idUser, idBeacon, proximity, callback) {
    MessageModel
      .find({
        beacons: idBeacon,
        destinataires: idUser,
        receiveBy: {$ne: idUser},
        beaconsProximity: {$in: Utils.getProximity(proximity)}
      })
      .exec(function (err, resultats) {
        callback(err, resultats);
      });
  },

  findMessageById: function (idMessage, callback) {
    MessageModel
      .findOne({"_id": idMessage})
      .exec(function (err, resultat) {
        callback(err, resultat);
      })
  },

  findMessageForThisUser: function (idUser, callback) {
    console.log(idUser);
    MessageModel
      .find({"destinataires": idUser.toString()})
      .sort({"dateCreation": -1})
      .exec(function (err, messages) {
        callback(err, messages)
      });
  },

  findBeaconToListenForUser: function (idUser, callback) {
    MessageModel
      .aggregate({
          $match: {
            destinataires: idUser._id.toString(),
            typeMessage: "beacon",
            receiveBy: {
              $not: {
                $in: [idUser._id.toString()]
              }
            }
          }
        },
        { $unwind: "$beacons"},
        { $project: {"beacons": 1} }
      )
      .exec(function (err, messages) {
        callback(err, messages);
      })
  },

  getUsers : function(messageID, callback){
    MessageModel
      .distinct("destinataires", {"_id": messageID})
      .exec(function (err, users) {
        console.log(users);
        UserRepository.getUsersFromIds(users, callback);
      })
  }
};
