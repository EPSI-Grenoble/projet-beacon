var express = require('express'),
  router = express.Router(),
  mongoose = require('mongoose');

module.exports = function (app) {
  app.use('/api', router);
};



// Pour sauvegarder un objet
//var user = new UserModel({"email":"jeanmi", "password":"fdp"});
//user.save();
