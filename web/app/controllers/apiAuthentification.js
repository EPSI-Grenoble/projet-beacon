var express = require('express'),
  router = express.Router(),
  passport = require('passport'),
  moment = require('moment'),
  UserRepository = require("../repository/UserRepository"),
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
        res.json({success: true, token: tokenGenerated});
      }
    }
  );
});
