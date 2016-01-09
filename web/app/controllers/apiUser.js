var express = require('express'),
  router = express.Router(),
  mongoose = require('mongoose'),
  passport = require('passport'),
  md5 = require('md5'),
  UserModel = mongoose.model('users'),
  Utils = require("../services/utils");

module.exports = function (app) {
  app.use('/api/users', router);
};

router.get("/", Utils.isAuth, function (req, res, next) {
  UserModel.find().sort({lastName: 1}).exec(function (err, users) {
    users = users.map(function (user) {
      user = user.toObject();
      delete user.password;
      return user;
    });
    res.json(users);
  })
});

router.get("/groupes", Utils.isAuth, function (req, res, next) {
  UserModel.getGroupes(function (groupesList) {
    res.json(groupesList);
  })
});

router.post('/', Utils.isAuth, function (req, res, next) {
  if (req.body.password) {
    req.body.password = md5(req.body.password);
  }
  // Id existant alors on met à jour
  if (req.body._id) {
    UserModel.findOne({"_id": req.body._id}, function (err, user) {
      user.email = req.body.email;
      user.firstName = req.body.firstName;
      user.lastName = req.body.lastName;
      user.groupes = req.body.groupes;
      if (req.body.password) {
        user.password = req.body.password;
      }
      user.save(function(err){
        if (err) {
          res.status(400).send(err.errors);
        } else {
          delete req.body.password;
          res.send(req.body);
        }
      })
    });
    // Sinon en crée un user
  } else {
    var user = new UserModel(req.body);
    user.save(function (err) {
      if (err) {
        res.status(400).send(err.errors);
      } else {
        res.send(user);
      }
    });
  }
});

router.delete("/:id", Utils.isAuth, function (req, res, next) {
  UserModel.find({_id: req.params.id}).remove().exec(function (err) {
    res.send(200);
  })
});
