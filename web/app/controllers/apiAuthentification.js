var express = require('express'),
  router = express.Router(),
  mongoose = require('mongoose'),
  passport = require('passport'),
  moment = require('moment'),
  UserModel = mongoose.model('users'),
  md5 = require('md5'),
  uuid = require('node-uuid');

module.exports = function (app) {
  app.use('/api', router);
};

// route de test des id de connexion smartphone
router.post('/auth', function (req, res, next) {
  UserModel.findOne(
    {email : req.body.login, password : md5(req.body.password)},
    function(err, user) {
      // S'il n'en existe pas on retourne un message d'erreur
      if(!user)
      {
        res.json({success:false, msg :"Erreur d'identifiant ou de mot de passe" });
      }
      else
      {
        var tokenGenerated = uuid.v4();
          req.session[tokenGenerated] = {
          user : user._id,
          expire: moment().add(10, 'days')
        };
        user.device_token = req.body.device_token;
        user.save();
        res.json({success:true, token: tokenGenerated});
      }
    }
  );
});
