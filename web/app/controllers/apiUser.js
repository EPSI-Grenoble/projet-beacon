var express = require('express'),
  router = express.Router(),
  passport = require('passport'),
  UserRepository = require("../repository/UserRepository"),
  MessageRepository = require("../repository/MessageRepository"),
  Utils = require("../services/utils");

module.exports = function (app) {
  app.use('/api/users', router);
};

/**
 * API pour récupèrer tous les utilisateurs triés par nom
 */
router.get("/", Utils.isAuth, function (req, res, next) {
  UserRepository.getAllUsers(function (err, users) {
    res.json(users);
  })
});

/**
 * API pour récuperer la liste des groupes avec les utilisateurs
 */
router.get("/groupes", Utils.isAuth, function (req, res, next) {
  UserRepository.getGroupes(function (err, groupesList) {
    res.json(groupesList);
  })
});

/**
 * API pour créer un user ou pour modifier si un ID existe
 */
router.post('/', function (req, res, next) {
  if (!req.body.isAdmin) {
    req.body.isAdmin = false;
  }
  if (req.body._id) {
    UserRepository.updateUser(req.body, function(err, user){
      if (err) {
        res.status(400).send(err.errors);
      } else {
        res.send(req.body);
      }
    });
  } else {
    UserRepository.createUser(req.body, function (err, user) {
      if (err) {
        res.status(400).send(err.errors);
      } else {
        res.send(user);
      }
    });
  }
});

/**
 * API pour supprimer un utilisateur
 */
router.delete("/:id", Utils.isAuth, function (req, res, next) {
  UserRepository.removeUser(req.params.id, function (err) {
    if(err){
      res.status(500).send(err);
    }
    res.send(200);
  })
});

/**
 * API pour récupèrer tous les utilisateurs d'un message
 */
router.get("/message/:id", Utils.isAuth, function (req, res, next) {
  MessageRepository.getUsers(req.params.id, function (err, users) {
    res.json(users);
  })
});
