var express = require('express'),
  router = express.Router(),
  passport = require('passport'),
  Utils = require("../services/utils"),
  GroupeRepository = require("../repository/GroupeRepository");

module.exports = function (app) {
  app.use('/api/groupes', router);
};

router.get("/", Utils.isAuth, function (req, res, next) {
  GroupeRepository.getAll(function (err, groupesList) {
    res.json(groupesList);
  })
});

router.post("/", Utils.isAuth, function (req, res, next) {
  GroupeRepository.createGroupe(req.body, function (err, groupeSaved) {
    if (err) {
      res.status(400).send(err);
    }
    else {
      res.send(groupeSaved);
    }
  });
});

router.post("/:id", Utils.isAuth, function (req, res, next) {
  GroupeRepository.updateGroupe(req.params.id, req.body.nom, function (err, groupeSaved) {
    if (err) {
      res.status(400).send(err);
    }
    else {
      res.send(groupeSaved);
    }
  });
});

router.get("/:id/membres", Utils.isAuth, function (req, res, next) {
  GroupeRepository.getMembresGroupe(req.params.id, function (err, membresGroupeList) {
    res.json(membresGroupeList);
  })
});

router.delete("/:id/membres", Utils.isAuth, function (req, res, next) {
  GroupeRepository.removeMembresGroupe(req.params.id, req.query.user, function (err, membresGroupeList) {
    res.json(membresGroupeList);
  })
});

router.post("/:id/add", Utils.isAuth, function (req, res, next) {
  GroupeRepository.addUserToGroupe(req.params.id, req.body.user, function (err, membres) {
    res.json(membres);
  })
});

router.delete("/:id", Utils.isAuth, function (req, res, next) {
  GroupeRepository.removeGroupe(req.params.id, function (err) {
    if (err) {
      res.status(406).send(err);
    }
    res.sendStatus(200);
  })
});
