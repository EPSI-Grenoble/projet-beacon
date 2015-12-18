var express = require('express'),
  router = express.Router(),
  mongoose = require('mongoose'),
  passport = require('passport'),
  MessageModel = mongoose.model('messages'),
  Utils = require("../services/utils"),
  SendPush = require("../services/sendPush");

module.exports = function (app) {
  app.use('/api/messages', router);
};

router.post('/', Utils.isAuth, function (req, res, next){
  var message = new MessageModel({
      "titre": req.body.titre,
      "message": req.body.content,
      "fromDate": req.body.fromdate,
      "toDate": req.body.todate,
      "beacons" : req.body.beacons,
      "destinataires" : req.body.destinataires,
      "typeMessage" : req.body.type,
      "dateCreation" : new Date()
  });
  testvalidite(message);
  message.save(function(err){
    if(err) res.send(406);
    var sender = new SendPush(message._id);
    if(message.typeMessage == "push"){
      sender.sendNow();
    }
    res.send(message);
  });
});

router.get('/user/', function (req, res, next){
  var token = req.session[req.query.token];
  if(token){
    var idUser = token.user;
    MessageModel.find({"destinataires": idUser}).sort({"dateCreation" : -1}).exec(function(err, messages){
      res.json(messages);
    })
  } else {
    console.log("Non authentifié");
    res.send(401);
  }
});


router.get('/user/:idMessage', function (req, res, next){
  var token = req.session[req.query.token];
  if(token){
    MessageModel.findOne({"_id": req.params.idMessage}, function(err, message){
      res.json(message);
    })
  } else {
    console.log("Non authentifié");
    res.send(401);
  }
});

function testvalidite(message) {
//je suppose que les conditions testées ci-dessous sont véritablement nécéssaires à la creation d'un message

  if(message.destinataires == null)
  {
    return "Déstinataires invalides"
  }
  else if (message.message == null)
  {
    return "Méssage manquant"
  }
  else if (message.titre == null)
  {
    return "Titre manquant"
  }
  else if (message.dateCreation == null)
  {
    return "Date de creation invalide"
  }
});

