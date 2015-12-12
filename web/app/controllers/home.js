var express = require('express'),
  router = express.Router(),
  mongoose = require('mongoose'),
  passport = require('passport'),
  UserModel = mongoose.model('users'),
  MessageModel = mongoose.model('messages'),
  BeaconModel = mongoose.model('beacons'),
  Utils = require("../services/utils");

module.exports = function (app) {
  app.use('/', router);
};

// Page d'accueil
router.get('/', Utils.isAuth , function (req, res, next) {
  UserModel.find( function(err, usersList) {
      res.render('index', {
        title: 'Liste des utilisateurs',
        user : req.user,
        users : usersList
      })
    }
  )
});

// Page des messages
router.get('/messages', Utils.isAuth, function (req, res, next) {
    MessageModel.find( function(err, toutLesMessage) {
      res.render('messages/listeMessages', {
        title: 'les messages',
        messages : toutLesMessage
      })
    })
});

// Page de l'edition de message
router.get('/messages/edit', Utils.isAuth, function (req, res, next) {
  UserModel.find( function(err, usersList) {
      res.render('messages/editMessage', {
        title: 'Editer un message',
        user : req.user
      });
  });
});


// Page des users
router.get('/users', Utils.isAuth, function (req, res, next) {
    UserModel.find( function(err, toutLesUser) {
      res.render('users/listeUsers', {
        title: 'Les utilisateurs',
        users : toutLesUser
      })
    })
});

// Page de l'edition de user
router.get('/users/edit', Utils.isAuth, function (req, res, next) {
    res.render('users/editUser', {
      title: 'Editer un utilisateur',
    });
});

// Page des beacons
router.get('/beacons', Utils.isAuth, function (req, res, next) {
    BeaconModel.find( function(err, toutlesBeacons) {
      res.render('beacons/addBeacon', {
        title: 'les beacons',
        beacons : toutlesBeacons
      })
    })
});

// Page de connexion
router.get('/login', function (req, res, next) {
  res.render('login', {
    title: 'Login',
    message: req.flash('loginMessage')
  });
});

// Authentification qu'on délégue au composant passport
router.post('/login', passport.authenticate('local-login', { successRedirect: '/', failureRedirect: '/login' }));

// Page de déconnexion
router.get('/logout', function(req, res){
  req.logout();
  res.redirect('/login');
});


//
//router.post('/register', function(req, res){
//  device_token = req.body.device_token;
//  console.log('device token received');
//  console.log(device_token);
//  res.send('ok');
//});
