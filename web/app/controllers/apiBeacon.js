var express = require('express'),
  router = express.Router(),
  passport = require('passport'),
  MessageRepository = require("../repository/MessageRepository"),
  BeaconRepository = require("../repository/BeaconRepository"),
  Utils = require("../services/utils");

module.exports = function (app) {
  app.use('/api/beacons', router);
};

/**
 * Récuperer tous les beacons
 */
router.get('/', Utils.isAuth, function (req, res) {
  BeaconRepository.getAll(function (err, beacons) {
    res.json(beacons)
  });
});

/**
 * Sauvegarder ou modifier un beacon
 */
router.post('/', Utils.isAuth, function (req, res) {
  BeaconRepository.createBeacon(req.body, function (err, beacon) {
    if (err) {
      res.status(400).send(err.errors);
    } else {
      res.send(beacon);
    }
  });
});

/**
 * Supprimer un beacon
 */
router.delete('/:id', Utils.isAuth, function (req, res) {
  BeaconRepository.deleteBeaconById(req.params.id, function (err) {
    if (err) {
      res.status(400).send(err);
    } else {
      res.send(200);
    }
  });
});

/**
 * API pour récupèrer la liste des beacon à écouter pour recevoir des messages pour un user
 */
router.get('/user/', Utils.isTokenValid, function (req, res) {
  MessageRepository.findBeaconToListenForUser(req.session[req.query.token].user, function (err, beacons) {
    if (err) {
      res.status(500).send(err);
    } else {
      res.json(beacons);
    }
  });
});
