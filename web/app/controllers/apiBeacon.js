var express = require('express'),
  router = express.Router(),
  mongoose = require('mongoose'),
  passport = require('passport'),
  BeaconModel = mongoose.model('beacons'),
  Utils = require("../services/utils");

module.exports = function (app) {
  app.use('/api/beacons', router);
};

router.get('/', Utils.isAuth, function (req, res, next){
  BeaconModel.find(function(err, beacons){
    res.json(beacons)
  });
});

router.post('/', Utils.isAuth , function (req, res, next){
  var beacon = new BeaconModel({
      "nom": req.body.nom,
      "UUID": req.body.uuid
  });
  beacon.save();
  res.send(200);
});


router.delete('/:id', Utils.isAuth, function (req, res, next){
  console.log(req.params.id);
  BeaconModel.remove({_id : req.params.id}, function(err){
    res.send(200);
  });
});
