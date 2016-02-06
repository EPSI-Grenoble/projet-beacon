/**
 * Ce fichier permet de mocker l'application pour executer les tests fonctionnels
 * On va utiliser une fausse base de données (en mémoire)
 * Puis on crée un utilisateur pour pouvoir se connecter
 */

'use strict';

process.env.NODE_ENV = "test";
var express = require('express'),
  config = require('../config/config'),
  glob = require('glob'),
  md5 = require('md5'),
  mongoose = require('mongoose');

mongoose.connect(config.db);
var db = mongoose.connection;
db.on('error', function () {
  throw new Error('unable to connect to database at ' + config.db);
});

var models = glob.sync(config.root + '/app/models/*.js');
models.forEach(function (model) {
  require(model);
});

var app = express();

require('../config/express')(app, config);

var server = app.listen(config.port, function () {
});

module.exports = {
  app: function (callback) {
    mongoose.connection.db.dropDatabase();
    var UserModel = mongoose.model('users');
    var user = new UserModel({
      email : "test@testeur.com",
      password : md5("test"),
      lastName : "Test",
      firstName : "App",
      isAdmin : true
    });
    user.save(function(){
      callback(app)
    });
  },
  shutdown: function(callback) {
    mongoose.connection.db.dropDatabase();
    server.close(function(){
      callback()
    })
  }
};
