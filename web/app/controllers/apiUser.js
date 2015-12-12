var express = require('express'),
  router = express.Router(),
  mongoose = require('mongoose'),
  passport = require('passport'),
  UserModel = mongoose.model('users'),
  Utils = require("../services/utils");

module.exports = function (app) {
  app.use('/api/users', router);
};

router.get("/", Utils.isAuth, function(req, res ,next){
  UserModel.find(function (err, users) {
    res.json(users);
  })
});

router.post('/', Utils.isAuth, function (req, res, next){
  var user = new UserModel({
    "email": req.body.email,
    "password": req.body.password,
    "lastName": req.body.lastName,
    "firstName": req.body.firstName,
    "groupes": req.body.groupes
  });
  user.save();
  res.send(200);
});
