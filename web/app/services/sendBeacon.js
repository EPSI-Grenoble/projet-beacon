"use strict";

var gcm = require('node-gcm'),
  mongoose = require('mongoose'),
  MessageModel = mongoose.model('messages'),
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
  }

  /**
   * Methode pour envoyer le message immédiatement
   * On récupère le message à partir de son ID puis on envoi la notif à tous les destinataires du messages
   * TODO pour l'insant on récupère pas les device_token du user, il faut donc récupèrer pour chaque user son device_token puis envoyer une notif
   */
  sendNow(){
    var device_tokens = [];
    var GCM = new gcm.Message();
    var sender = new gcm.Sender('AIzaSyD93SZYNCzkr_mdTN8A4jwdSGMn5V4Ni1U');
    GCM.addData('title', "EPSI");
    GCM.addData('message', this.message.titre);
    GCM.addData("messageID", this.message._id);

    GCM.collapseKey = 'testing';
    GCM.delayWhileIdle = true;
    GCM.timeToLive = 3;

    UserModel.findOne({ "_id" : this.destinataireID }, function(err, user){

      if(user.device_token) {
        device_tokens.push(user.device_token);
      }

      sender.send(GCM, device_tokens, 4, function(result){
        console.log(result);
        console.log(GCM);
      });

    });
  }

  /**
   * On veut envoyer un notif dans le futur
   * TODO il faudra donc mettre en place une cron et envoyer les notifs à ce moment là
   * @param dateToSend
     */
  sendOn(dateToSend){

  }

};
