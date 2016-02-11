"use strict";

var gcm = require('node-gcm'),
  mongoose = require('mongoose'),
  MessageModel = mongoose.model('messages'),
  GuestRepository = require("../repository/GuestRepository"),
  UserModel = mongoose.model('users');

/**
 * Une classe pour envoyer des notifications push grâce à Google Cloud Messaging (GCM)
 * @type {SendPush}
 */
module.exports = class SendBeacon {
  /**
   * On initialise la classe avec l'ID du message
   * @param messageID
   */
  constructor(message, destinataireID) {
    this.message = message;
    this.destinataireID = destinataireID;
    this.GCM = new gcm.Message();
  }

  /**
   * Methode pour envoyer le message immédiatement
   * On récupère le message à partir de son ID puis on envoi la notif à tous les destinataires du messages
   */
  sendNow() {
    var superThis = this;
    superThis.GCM.addData('title', "EPSI");
    superThis.GCM.addData('message', this.message.titre);
    superThis.GCM.addData("messageID", this.message._id);
    superThis.GCM.collapseKey = 'testing';
    superThis.GCM.delayWhileIdle = true;
    superThis.GCM.timeToLive = 3;

    UserModel.findOne({"_id": this.destinataireID}, function (err, user) {
      superThis.sendToEachItem(user);
    });

    GuestRepository.findById(this.destinataireID, function (err, guest) {
      superThis.sendToEachItem(guest);
    });
  }

  sendToEachItem(user, device_tokens, sender, GCM) {
    var device_tokens = [];
    var sender = new gcm.Sender('AIzaSyD93SZYNCzkr_mdTN8A4jwdSGMn5V4Ni1U');
    if(user && user.device_token){
      if (user.device_token instanceof Array) {
        device_tokens.push.apply(device_tokens, user.device_token);
      } else {
        device_tokens.push(user.device_token);
      }
    }
    sender.send(this.GCM, device_tokens, 4, function (result) {
    });
  }

};
