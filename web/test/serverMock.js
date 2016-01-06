process.env.NODE_ENV = "test";
var express = require('express'),
  config = require('../config/config'),
  glob = require('glob'),
  mockgoose = require('mockgoose'),
  md5 = require('md5'),
  mongoose = require('mongoose');

mockgoose(mongoose);
mongoose.connect(config.db);
var db = mongoose.connection;
db.on('error', function () {
  throw new Error('unable to connect to database at ' + config.db);
});

var models = glob.sync(config.root + '/app/models/*.js');
models.forEach(function (model) {
  require(model);
});
mockgoose.reset(function(){
});

var app = express();

require('../config/express')(app, config);

app.listen(config.port, function () {
  console.log('Express server listening on port ' + config.port);
});

module.exports = {
  app : app,
  createUser: function(callback){
    var UserModel = mongoose.model('users');
    var user = new UserModel({
      email : "test@testeur.com",
      password : md5("test"),
      lastName : "Test",
      firstName : "App"
    });
    user.save(function(){
      callback();
    });
  }
};
