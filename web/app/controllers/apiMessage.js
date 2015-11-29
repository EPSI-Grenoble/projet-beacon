var express = require('express'),
  router = express.Router(),
  mongoose = require('mongoose'),
  passport = require('passport'),
  MessageModel = mongoose.model('messages'),
  isUserLogIn = require('../services/utils');

module.exports = function (app) {
  app.use('/api/message', router);
};

router.post('/', isUserLogIn, function (req, res, next){
  var message = new MessageModel({
      "titre": req.body.titre,
      "message": req.body.content,
      "fromDate": req.body.fromdate,
      "toDate": req.body.todate,
      "beacons" : req.body.beacons
  });
  message.save();
  res.send(200);
});
