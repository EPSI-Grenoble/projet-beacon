'use strict';
var mongoose = require('mongoose'),
  Utils = require("../services/utils"),
  UserRepository = require("../repository/UserRepository"),
  MessageModel = mongoose.model("messages");

module.exports = {

  /**
   * Crer un message
   * @param body
   * @param callback
     */
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

  /**
   * Récupèrer un message attaché à un beacon pour un destinateire
   * @param idUser
   * @param idBeacon
   * @param proximity
   * @param callback
     */
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

  /**
   * Récupère un message par son identifiant
   * @param idMessage
   * @param callback
     */
  findMessageById: function (idMessage, callback) {
    MessageModel
      .findOne({"_id": idMessage})
      .exec(function (err, resultat) {
        callback(err, resultat);
      })
  },

  /**
   * Récupèrer un liste de message destiné à l'user
   * @param idUser
   * @param callback
     */
  findMessageForThisUser: function (idUser, callback) {
    MessageModel
      .find({"destinataires": idUser.toString()})
      .sort({"dateCreation": -1})
      .exec(function (err, messages) {
        callback(err, messages)
      });
  },

  /**
   * Récupère une liste de beacons à surveiller pour un user
   * @param idUser
   * @param callback
     */
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

  /**
   * Recupère les destinataires du messages
   * @param messageID
   * @param callback
     */
  getUsers : function(messageID, callback){
    MessageModel
      .distinct("destinataires", {"_id": messageID})
      .exec(function (err, users) {
        UserRepository.getUsersFromIds(users, callback);
      })
  }
};
