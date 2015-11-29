var express = require('express'),
  router = express.Router(),
  mongoose = require('mongoose'),
  passport = require('passport'),
  BeaconModel = mongoose.model('beacons'),
  isUserLogIn = require('../services/utils');

module.exports = function (app) {
  app.use('/api/beacon', router);
};

router.get('/', isUserLogIn, function (req, res, next){
  BeaconModel.find(function(err, beacons){
    res.json(beacons)
  });
});

router.post('/', isUserLogIn , function (req, res, next){
  var beacon = new BeaconModel({
      "nom": req.body.nom,
      "UUID": req.body.uuid
  });
  beacon.save();
  res.send(200);
});


router.delete('/:id', isUserLogIn, function (req, res, next){
  console.log(req.params.id);
  BeaconModel.remove({_id : req.params.id}, function(err){
    res.send(200);
  });
});
