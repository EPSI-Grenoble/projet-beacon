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

// Authentification qu'on délégue au composant passport
router.post('/login', passport.authenticate('local-login', { successRedirect: '/', failureRedirect: '/login' }));
