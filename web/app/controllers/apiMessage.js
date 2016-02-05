var express = require('express'),
  router = express.Router(),
  passport = require('passport'),
  Utils = require("../services/utils"),
  SendPush = require("../services/sendPush"),
  SendBeacon = require("../services/sendBeacon"),
  MessageRepository = require("../repository/MessageRepository");

module.exports = function (app) {
  app.use('/api/messages', router);
};

/**
 * Créer et envoyer un message
 */
router.post('/', Utils.isAuth, function (req, res, next) {
  MessageRepository.createMessage(req.body, function(err, message) {
    if (err) {
    console.log(err);
      res.status(406).send(err);
    } else {
      if (message.typeMessage == "push") {
        var sender = new SendPush(message._id);
        sender.sendNow();
      }
      res.send(message);
    }
  });
});


/**
 * Retourne les messages de l'utilisateur
 */
router.get('/user/', Utils.isTokenValid, function (req, res, next) {
  var session = req.session[req.query.token];
  if(session.user){
    var idUser = req.session[req.query.token].user;
  } else if(session.guest){
    var idUser = req.session[req.query.token].guest;
  }

  MessageRepository.findMessageForThisUser(idUser, function (err, messages) {
    res.json(messages);
  })
});

/**
 * Retourne le contenu du message à partir de l'id
 */
router.get('/user/:idMessage', Utils.isTokenValid, function (req, res, next) {
  MessageRepository.findMessageById(req.params.idMessage, function (err, message) {
    res.json(message);
  })
});

/**
 * Cherche tous les messages pour l'utilisateur associé au beacon donné
 */
router.get('/user/beacon/:idBeacon', Utils.isTokenValid, function (req, res, next) {
  var proximity = req.query.proximity;
  var idBeacon = req.params.idBeacon;
  var idUser = req.session[req.query.token].user;
  MessageRepository.findMessageForThisUserAndThisBeacon(idUser, idBeacon, proximity, function (err, messages) {
    messages.forEach(function (message) {
      message.receiveBy.push(idUser);
      message.save();
      var sender = new SendBeacon(message, idUser);
      sender.sendNow();
    });
    res.json(200);
  })
});
