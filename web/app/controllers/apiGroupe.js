var express = require('express'),
  router = express.Router(),
  passport = require('passport'),
  Utils = require("../services/utils"),
  GroupeRepository = require("../repository/GroupeRepository");

module.exports = function (app) {
  app.use('/api/groupes', router);
};

router.get("/", Utils.isAuth, function(req, res ,next){
  GroupeRepository.getAll(function(err, groupesList){
    res.json(groupesList);
  })
});

router.post("/", Utils.isAuth, function(req, res ,next){
  GroupeRepository.createGroupe(req.body, function (err, groupeSaved) {
    res.json(groupeSaved);
  })
});

router.post("/:id", Utils.isAuth, function(req, res ,next){
  GroupeRepository.updateGroupe(req.params.id, req.body.nom, function(err, groupeSaved){
    res.json(groupeSaved);
  });
});
