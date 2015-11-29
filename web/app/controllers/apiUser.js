var express = require('express'),
  router = express.Router(),
  mongoose = require('mongoose'),
  passport = require('passport'),
  UserModel = mongoose.model('users'),
  isUserLogIn = require('../services/utils');

module.exports = function (app) {
  app.use('/api/users', router);
};

router.get("/", isUserLogIn, function(req, res ,next){
  UserModel.find(function (err, users) {
    res.json(users);
  })
});
