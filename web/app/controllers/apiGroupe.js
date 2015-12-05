var express = require('express'),
  router = express.Router(),
  mongoose = require('mongoose'),
  passport = require('passport'),
  UserModel = mongoose.model('users'),
  Utils = require("../services/utils");

module.exports = function (app) {
  app.use('/api/groupes', router);
};

router.get("/", Utils.isAuth, function(req, res ,next){
  UserModel.getGroupes(function (groupesList) {
    res.json(groupesList);
  })
});

