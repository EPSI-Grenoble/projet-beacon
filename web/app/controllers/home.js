var express = require('express'),
  router = express.Router(),
  mongoose = require('mongoose'),
  passport = require('passport'),
  AdminModel = mongoose.model('admins'),
  isUserLogIn = require('../services/utils');

module.exports = function (app) {
  app.use('/', router);
};

// Page d'accueil
router.get('/', isUserLogIn, function (req, res, next) {
  AdminModel.find( function(err, usersList) {
      res.render('index', {
        title: 'Liste des utilisateurs',
        user : req.user,
        users : usersList
      })
    }
  )
});

// Page de connexion
router.get('/login', function (req, res, next) {
  res.render('login', {
    title: 'Login',
    message: req.flash('loginMessage')
  });
});

// Page des messages
router.get('/messages', function (req, res, next) {
  res.render('messages/Messages', {
    title: 'les messages',
  });
});

// Page des messages
router.get('/messages/edit', function (req, res, next) {
  res.render('messages/editMessage', {
    title: 'Editer un message',
  });
});

// Authentification qu'on délégue au composant passport
router.post('/login', passport.authenticate('local-login', { successRedirect: '/', failureRedirect: '/login' }));

// Page de déconnexion
router.get('/logout', function(req, res){
  req.logout();
  res.redirect('/login');
});
