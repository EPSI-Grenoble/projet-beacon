var express = require('express'),
  router = express.Router(),
  passport = require('passport'),
  Utils = require("../services/utils"),
  GuestRepository = require("../repository/GuestRepository");

module.exports = function (app) {
  app.use('/api/guests', router);
};

router.get("/", Utils.isAuth, function(req, res ,next){
  GuestRepository.getAllGuest(function(err, groupesList){
    res.json(groupesList);
  })
});

router.post("/", Utils.isAuth, function(req, res ,next){
  GuestRepository.getAllGuest(function(err, groupesList){
    res.json(groupesList);
  })
});

router.post("/", Utils.isAuth, function(req, res ,next){
  GuestRepository.createGuest(req.body, function (err, groupeSaved) {
    res.json(groupeSaved);
  })
});

router.post("/:id", Utils.isAuth, function(req, res ,next){
  GuestRepository.updateGuest(req.params.id, req.body, function(err, groupeSaved){
    res.json(groupeSaved);
  });
});

router.delete("/:id", Utils.isAuth, function (req, res, next) {
  GuestRepository.removeGroupe(req.params.id, function (err) {
    if(err){
      res.status(500).send(err);
    }
    res.send(200);
  })
});
