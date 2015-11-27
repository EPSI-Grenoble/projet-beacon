var express = require('express'),
  router = express.Router(),
  mongoose = require('mongoose'),
  passport = require('passport'),
  AdminModel = mongoose.model('admins'),
  isUserLogIn = require('../services/utils');

module.exports = function (app) {
  app.use('/api', router);
};

// route de test des id de connexion smartphone
router.post('/checkAuth', function (req, res, next) {

AdminModel.findOne(
        {email : req.body.username, password : req.body.password},
        function(err, user) {
          // S'l n'en existe pas on retourne un message d'erreur
          if(!user)
          {
            res.json({success:false, msg :"Erreur d'identifiant ou de mot de passe" });
          }
          else
          {
            res.json({success:true});
          }
        }
      );
    }
  );
