var express = require('express'),
  router = express.Router(),
  mongoose = require('mongoose'),
  passport = require('passport'),
  AdminModel = mongoose.model('admins'),
  uuid = require('node-uuid'),
  MessageModel = mongoose.model('messages'),
  isUserLogIn = require('../services/utils');
var session  = require('express-session');
var app = express();

module.exports = function (app) {
  app.use('/api', router);
};

app.use(session({ secret: "token" }));

// route de test des id de connexion smartphone
router.post('/checkAuth', function (req, res, next) {
var sess = req.session;
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
