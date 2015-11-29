var express = require('express'),
  router = express.Router(),
  mongoose = require('mongoose'),
  passport = require('passport'),
  AdminModel = mongoose.model('admins'),
  uuid = require('node-uuid'),
  MessageModel = mongoose.model('messages'),
  isUserLogIn = require('../services/utils');

module.exports = function (app) {
  app.use('/api', router);
};


// route de test des id de connexion smartphone
router.post('/checkAuth', function (req, res, next) {
AdminModel.findOne(
        {email : req.body.username, password : req.body.password},
        function(err, user) {
          // S'il n'en existe pas on retourne un message d'erreur
          if(!user)
          {
            res.json({success:false, msg :"Erreur d'identifiant ou de mot de passe" });
          }
          else
          {
              // Si l'utilisateur a déjà un token, on refresh seulement sa date, sinon on lui en crée un
              if (user.token == "" || user.token == null){
                var newtoken = uuid.v4();
                user.token = newtoken;
              }
              user.date_token = new Date();
              user.save();
              res.json({success:true, user: user});
          }
        }
      );
});

router.post('/message', function (req, res, next){
  var message = new MessageModel({
      "titre": req.body.titre,
      "message": req.body.content,
      "fromDate": req.body.fromdate,
      "toDate": req.body.todate,
  });
  message.save();
  res.send(200);
});
