var express = require('express'),
  router = express.Router(),
  mongoose = require('mongoose'),
  passport = require('passport'),
  BeaconModel = mongoose.model('beacons'),
  MessageModel = mongoose.model('messages'),
  Criteria = require("../services/criteria"),
  Utils = require("../services/utils");

module.exports = function (app) {
  app.use('/api/beacons', router);
};

/**
 * Récuperer tous les beacons
 */
router.get('/', Utils.isAuth, function (req, res, next){
  BeaconModel.find(function(err, beacons){
    res.json(beacons)
  });
});

/**
 * Sauvegarder ou modifier un beacon
 */
router.post('/', Utils.isAuth , function (req, res, next){
  var beacon = new BeaconModel({
      "nom": req.body.nom,
      "UUID": req.body.uuid
  });
  beacon.save(function(err){
    if(err){
      res.statys(400).send(err.errors);
    } else {
      res.send(req.body);
    }
  });
});

/**
 * Supprimer un beacon
 */
router.delete('/:id', Utils.isAuth, function (req, res, next){
  BeaconModel.remove({_id : req.params.id}, function(err){
    res.send(200);
  });
});

/**
 * API pour récupèrer la liste des beacon à écouter pour recevoir des messages pour un user
 */
router.get('/user/', function (req, res, next){
  var token = req.session[req.query.token];
  if(token){
    MessageModel.aggregate(
      { $match : Criteria.findBeaconToListenForUser(token.user)},
      { $unwind : "$beacons" },
      { $project : {"beacons" : 1} },
      function(err, messages){
        if(err){
          res.status(500).send(err);
        }
        res.json(messages);
      })
  } else {
    console.log("Non authentifié");
    res.send(401);
  }
});
