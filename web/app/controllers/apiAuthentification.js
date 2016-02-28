var express = require('express'),
  router = express.Router(),
  passport = require('passport'),
  moment = require('moment'),
  UserRepository = require("../repository/UserRepository"),
  GuestRepository = require("../repository/GuestRepository"),
  uuid = require('node-uuid');

module.exports = function (app) {
  app.use('/api', router);
};

/**
 * API Authentification pour les aplications mobiles
 * Paramètres : login et password
 */
router.post('/auth', function (req, res) {
  UserRepository.connexion(req.body.login, req.body.password, function (err, user) {
      if (!user || err) {
        res.status(401).json({success: false, msg: "Erreur d'identifiant ou de mot de passe"});
      }
      else {
        var tokenGenerated = uuid.v4();
        user.token = tokenGenerated;
        user.device_token = req.body.device_token;
        user.save();
        res.json({success: true, token: tokenGenerated, user:user});
      }
    }
  );
});

/**
 * API d'authentification pour le mode guest sur les applications mobiles
 * Paramètres : code invité
 */
router.post('/auth-guest', function (req, res) {
  GuestRepository.checkCode(req.body.code, function (err, guest) {
    if (!guest || err) {
        res.json({success: false, msg: "Erreur d'identifiant ou de mot de passe"});
      }
      else {
      var tokenGenerated = uuid.v4();
        if(guest.device_token.indexOf(req.body.device_token) < 0 && req.body.device_token != null){
          guest.device_token.push(req.body.device_token);
        }
        guest.token = tokenGenerated;
        guest.save();
        res.json({success: true, token: tokenGenerated, user:{
          firstName : guest.label,
          lastName : ""
        }});
      }
    }
  );
});

/**
 * API pour enregistrer le token pour Google Cloud Messaging
 */
router.post('/auth/gcm-token', function (req, res) {
  UserRepository.connexion(req.body.login, req.body.password, function (err, user) {
      if (!user || err) {
        res.json({success: false, msg: "Erreur d'identifiant ou de mot de passe"});
      }
      else {
        var tokenGenerated = uuid.v4();
        req.session[tokenGenerated] = {
          user: user._id,
          expire: moment().add(5, 'days')
        };
        user.device_token = req.body.device_token;
        user.save();
        res.json({success: true, token: tokenGenerated, user:user});
      }
    }
  );
});
