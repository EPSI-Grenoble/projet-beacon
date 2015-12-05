"use strict";

var gcm = require('node-gcm'),
  mongoose = require('mongoose'),
  MessageModel = mongoose.model('messages');

module.exports = class SendPush {
  constructor(messageID) {
    this.messageID = messageID;
  }

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

      device_tokens.push("APA91bG_clVw0w1D093U2k3yJTKwQKlQ8b7zKP2xbg7-_bIqRuTuX6TCLJVH2yYCSsOsyJwTtQDO4vXBPIuA9PV39U2s-YfRwLoPV2JVulajWVa_xZPNcPlkeQrt9yen381MJHJr3NWf7vG58yvb0Jwpd5kKOLUP7A");

      sender.send(GCM, device_tokens, 4, function(result){
        console.log(result);
      });
    });
  }

  sendOn(dateToSend){

  }

};
