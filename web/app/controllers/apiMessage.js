var express = require('express'),
  router = express.Router(),
  mongoose = require('mongoose'),
  passport = require('passport'),
  MessageModel = mongoose.model('messages'),
  Utils = require("../services/utils"),
  SendPush = require("../services/sendPush");

module.exports = function (app) {
  app.use('/api/message', router);
};

router.post('/', Utils.isAuth, function (req, res, next){
  var message = new MessageModel({
      "titre": req.body.titre,
      "message": req.body.content,
      "fromDate": req.body.fromdate,
      "toDate": req.body.todate,
      "beacons" : req.body.beacons,
      "destinataires" : req.body.destinataires
  });
  message.save(function(err){
    if(err) res.send(406);
    var sender = new SendPush(message._id);
    sender.sendNow();
    res.send(message);
  });
});

router.get('/user/', function (req, res, next){
  var token = req.session[req.query.token];
  if(token && token.expire > new Date()){
    var idUser = req.session[token].user;
    MessageModel.find({"_id": idUser}, function(err, messages){
      res.json(messages);
    })
  } else {
    console.log("Non authentifié");
    res.send(401);
  }
});



