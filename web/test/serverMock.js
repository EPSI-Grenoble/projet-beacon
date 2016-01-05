
var express = require('express'),
  config = require('../config/config'),
  glob = require('glob');
mongoose = require('mongoose');
var path = require('path'),
  rootPath = path.normalize(__dirname + '/..'),
  env = process.env.NODE_ENV || 'development';

var config = {
    root: rootPath,
    app: {
      name: 'web'
    },
    port: 3010,
    db: 'mongodb://epsi:epsi@martin-choraine.fr:10443/beacon'
};

//test
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

app.listen(config.port, function () {
  console.log('Express server listening on port ' + config.port);
});

module.exports = app;
