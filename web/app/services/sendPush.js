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
    MessageModel.findById(this.messageID, function(err, message){
      GCM.addData('title', "EPSI");
      GCM.addData('message', message.titre);

      GCM.collapseKey = 'testing';
      GCM.delayWhileIdle = true;
      GCM.timeToLive = 3;

      message.destinataires.forEach(function(destinataire){
        if(destinataire.device_token) {
          device_tokens.push("APA91bG_clVw0w1D093U2k3yJTKwQKlQ8b7zKP2xbg7-_bIqRuTuX6TCLJVH2yYCSsOsyJwTtQDO4vXBPIuA9PV39U2s-YfRwLoPV2JVulajWVa_xZPNcPlkeQrt9yen381MJHJr3NWf7vG58yvb0Jwpd5kKOLUP7A");
        }
      });

      sender.send(GCM, device_tokens, 4, function(result){
        console.log(result);
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
