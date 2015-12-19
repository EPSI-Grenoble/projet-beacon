var express = require('express'),
  router = express.Router(),
  mongoose = require('mongoose'),
  passport = require('passport'),
  BeaconModel = mongoose.model('beacons'),
  MessageModel = mongoose.model('messages'),
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
  beacon.save();
  res.send(200);
});

/**
 * Supprimer un beacon
 */
router.delete('/:id', Utils.isAuth, function (req, res, next){
  console.log(req.params.id);
  BeaconModel.remove({_id : req.params.id}, function(err){
    res.send(200);
  });
});

/**
 * API pour récupèrer la liste des beacon à écouter pour recevoir des messages pour un user
 */
router.get('/user/', function (req, res, next){
  var token = req.session[req.query.token];
  console.log(req.session);
  if(token){
    var idUser = token.user;
    MessageModel.aggregate(
      { $match : {"destinataires": idUser, "typeMessage": "beacon"}},
      { $unwind : "$beacons" },
      { $project : {"beacons" : 1} },
      function(err, messages){
        res.json(messages);
      })
  } else {
    console.log("Non authentifié");
    res.send(401);
  }
});
