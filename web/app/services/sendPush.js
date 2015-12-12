"use strict";

var gcm = require('node-gcm'),
  mongoose = require('mongoose'),
  MessageModel = mongoose.model('messages'),
  UserModel = mongoose.model('users');

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
    var messageID = this.messageID;
      MessageModel.findById(messageID, function(err, message){
      GCM.addData('title', "EPSI");
      GCM.addData('message', message.titre);
      GCM.addData("messageID", messageID);

      GCM.collapseKey = 'testing';
      GCM.delayWhileIdle = true;
      GCM.timeToLive = 3;

      UserModel.find({ "_id" : { $in : message.destinataires } }, function(err, users){
        users.forEach(function(user){
          if(user.device_token) {
            device_tokens.push(user.device_token);
          }
        });

        sender.send(GCM, device_tokens, 4, function(result){
          console.log(result);
          console.log(GCM);
        });

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
