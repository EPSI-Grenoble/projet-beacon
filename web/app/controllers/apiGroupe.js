var express = require('express'),
  router = express.Router(),
  mongoose = require('mongoose'),
  passport = require('passport'),
  UserModel = mongoose.model('users'),
  GroupeModel = mongoose.model('groupes'),
  Utils = require("../services/utils"),
  GroupeRepository = require("../repository/GroupeRepository");

module.exports = function (app) {
  app.use('/api/groupes', router);
};

router.get("/", Utils.isAuth, function(req, res ,next){
  GroupeModel.find().sort({nom: 1}).exec(function(err, groupesList){
    res.json(groupesList);
  })
});

router.post("/", Utils.isAuth, function(req, res ,next){
  var groupe = new GroupeModel(req.body);
  groupe.save(function (groupeSaved) {
    res.json(groupeSaved);
  })
});

router.post("/:id", Utils.isAuth, function(req, res ,next){
  GroupeRepository.updateGroupe(req.params.id, req.body.nom, function(err, groupeSaved){
    res.json(groupeSaved);
  });
});
