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
 */
router.post('/auth', function (req, res) {
  UserRepository.connexion(req.body.login, req.body.password, function (err, user) {
      if (!user || err) {
        res.json({success: false, msg: "Erreur d'identifiant ou de mot de passe"});
      }
      else {
        var tokenGenerated = uuid.v4();
        req.session[tokenGenerated] = {
          user: user._id,
          expire: moment().add(10, 'days')
        };
        user.device_token = req.body.device_token;
        user.save();
        res.json({success: true, token: tokenGenerated, user:user});
      }
    }
  );
});


router.post('/auth-guest', function (req, res) {
  GuestRepository.checkCode(req.body.code, function (err, guest) {
      if (!guest || err) {
        res.json({success: false, msg: "Erreur d'identifiant ou de mot de passe"});
      }
      else {
        var tokenGenerated = uuid.v4();
        req.session[tokenGenerated] = {
          guest: guest._id,
          expire: moment().add(10, 'days')
        };
        guest.device_token.push(req.body.device_token);
        guest.save();
        res.json({success: true, token: tokenGenerated, user:{
          firstName : guest.label,
          lastName : ""
        }});
      }
    }
  );
});
