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

router.get("/", Utils.isAuth, function(req, res ,next){
  UserModel.find().sort({lastName: 1}).exec(function (err, users) {
    res.json(users);
  })
});

router.post('/', Utils.isAuth, function (req, res, next){
  req.body.password = md5(req.body.password);
  // Id existant alors on met à jour
  if(req.body._id){
    UserModel.update({"_id" : req.body._id}, req.body, { runValidators: true }, function (err, user){
      if(err){
        res.send(400, err.errors);
      } else {
        res.send(req.body);
      }
    });
  //Sinon en crée un user
  } else {
    var user = new UserModel(req.body);
    user.save(function(err){
      if(err){
        res.send(400, err.errors);
      } else {
        res.send(user);
      }
    });
  }
});

router.delete("/:id", Utils.isAuth, function(req, res ,next){
  UserModel.find({_id : req.params.id}).remove().exec(function (err) {
    res.send(200);
  })
});
