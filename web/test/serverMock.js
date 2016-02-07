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

 app.listen(config.port);

module.exports = {
  app: function (callback) {
    mongoose.connection.db.dropDatabase();
    callback(app)
  },
  shutdown: function(callback) {
    mongoose.connection.db.dropDatabase();
    callback()
  }
};
