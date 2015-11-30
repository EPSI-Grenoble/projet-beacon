var express = require('express'),
  router = express.Router(),
  mongoose = require('mongoose'),
  passport = require('passport'),
  UserModel = mongoose.model('users'),
  uuid = require('node-uuid'),
  isUserLogIn = require('../services/utils');

module.exports = function (app) {
  app.use('/api', router);
};

// route de test des id de connexion smartphone
router.post('/auth', function (req, res, next) {
  var sess = req.session;
  UserModel.findOne(
    {email : req.body.login, password : req.body.password},
    function(err, user) {
      // S'il n'en existe pas on retourne un message d'erreur
      if(!user)
      {
        res.json({success:false, msg :"Erreur d'identifiant ou de mot de passe" });
      }
      else
      {
        if (!sess[user.email]){
          console.log("woup");
          var newtoken = uuid.v4();
          user.token = newtoken;
          sess[user.email] = user.token;
        }
        res.json({success:true, user: sess[user.email]});
      }
    }
  );
});
