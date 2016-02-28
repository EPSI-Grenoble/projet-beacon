"use strict";

var gcm = require('node-gcm'),
  mongoose = require('mongoose'),
  MessageModel = mongoose.model('messages'),
  UserModel = mongoose.model('users'),
  GuestRepository = require("../repository/GuestRepository");

/**
 * Une classe pour envoyer des notifications push grâce à Google Cloud Messaging (GCM)
 * @type {SendPush}
 */
module.exports = class SendPush {
  /**
   * On initialise la classe avec l'ID du message
   * @param messageID
   */
  constructor(messageID) {
    this.messageID = messageID;
    this.GCM = new gcm.Message();
  }

  /**
   * Methode pour envoyer le message immédiatement
   * On récupère le message à partir de son ID puis on envoi la notif à tous les destinataires du messages
   */
  sendNow() {
    var messageID = this.messageID;
    var superThis = this;

    MessageModel.findById(messageID, function (err, message) {
      superThis.GCM.addData('title', "EPSI");
      superThis.GCM.addData('message', message.titre);
      superThis.GCM.addData("messageID", messageID);
      superThis.GCM.collapseKey = 'testing';
      superThis.GCM.delayWhileIdle = true;
      superThis.GCM.timeToLive = 3;

      UserModel.find({"_id": {$in: message.destinataires}}, function (err, users) {
        superThis.sendToEachItem(users);
      });

      GuestRepository.findByIdInDestinataireList(message.destinataires, function (err, guests) {
        superThis.sendToEachItem(guests);
      });
    });
  }

  /**
   * On veut envoyer un notif dans le futur
   * TODO il faudra donc mettre en place une cron et envoyer les notifs à ce moment là
   * @param dateToSend
   */
  sendOn(dateToSend) {

  }

  /**
   * Envoi un message pour chaque user/guest
   * @param array
   * @param device_tokens
   * @param sender
     * @param GCM
     */
  sendToEachItem(array, device_tokens, sender, GCM) {
    var device_tokens = [];
    var sender = new gcm.Sender('AIzaSyD93SZYNCzkr_mdTN8A4jwdSGMn5V4Ni1U');

    array.forEach(function (item) {
      if (item.device_token) {
        if(item.device_token instanceof Array){
          device_tokens.push.apply(device_tokens, item.device_token);
        } else {
          device_tokens.push(item.device_token);
        }
      }
    });
    sender.send(this.GCM, device_tokens, 4, function (result) {});
  }

};
