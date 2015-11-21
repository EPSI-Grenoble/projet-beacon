var express = require('express'),
  router = express.Router(),
  mongoose = require('mongoose'),
  passport = require('passport'),
  UserModel = mongoose.model('users'),
  isUserLogIn = require('../services/utils');

module.exports = function (app) {
  app.use('/', router);
};

router.get('/', isUserLogIn, function (req, res, next) {
  UserModel.find( function(err, usersList) {
      res.render('index', {
        title: 'Liste des utilisateurs',
        user : req.user,
        users : usersList
      })
    }
  )
});

router.get('/login', function (req, res, next) {
  res.render('login', {
    title: 'Login',
    message: req.flash('loginMessage')
  });
});

router.post('/login', passport.authenticate('local-login', { successRedirect: '/', failureRedirect: '/login' }));
