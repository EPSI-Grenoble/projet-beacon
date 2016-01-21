'use strict';
var mongoose = require('mongoose'),
  md5 = require('md5'),
  UserModel = mongoose.model("users");

module.exports = {

  updateGroupe: function (oldName, newName) {
    UserModel
      .find({groupes: oldName})
      .exec(function (err, users) {
        users.forEach(function (user) {
          user.groupes.push(newName);
          user.groupes.splice(user.groupes.indexOf(oldName), 1);
          user.save();
        });
      })
  },

  deleteGroupe: function (groupName, callback) {
    UserModel
      .find({groupes: groupName})
      .exec(function (err, users) {
        users.forEach(function (user) {
          var index = user.groupes.indexOf(groupName);
          user.groupes.splice(index,1);
          user.save(function(){
            callback()
          });
        });
    });
  },

  createUser : function(form, callback){
    var user = new UserModel({
      email : form.email,
      firstName : form.firstName,
      lastName : form.lastName,
      groupes : form.groupes,
      password : md5(form.password),
      isAdmin : form.isAdmin,
      device_token : form.device_token,
      token : form.token
    });

    user.save(function (err, user) {
      callback(err, user)
    });
  },

  updateUser : function(form, callback){
    UserModel
      .findOne({"_id": form._id})
      .exec(function (err, user) {
        user.email = form.email;
        user.firstName = form.firstName;
        user.lastName = form.lastName;
        user.groupes = form.groupes;
        if (form.password) {
          user.password = md5(form.password);
        }
        user.isAdmin = form.isAdmin;
        user.save(function(err, userSaved){
            delete userSaved.password;
            callback(err, userSaved)
        })
      });
  },

  getAllUsers: function (callback) {
    UserModel
      .find({isAdmin: { $ne: true }})
      .sort({lastName: 1})
      .exec(function (err, users) {
        users = users.map(function (user) {
          user = user.toObject();
          delete user.password;
          return user;
        });
        callback(err, users);
      });
  },

  getAllAdmins: function (callback) {
    UserModel
      .find({isAdmin:true})
      .sort({lastName: 1})
      .exec(function (err, users) {
        users = users.map(function (user) {
          user = user.toObject();
          delete user.password;
          return user;
        });
        callback(err, users);
      });
  },

  removeUser : function(id, callback){
    UserModel
      .find({
        _id: id
      })
      .remove()
      .exec(function (err) {
        callback(err);
      })
  },

  getGroupes: function (callback) {
    UserModel
      .aggregate([
        {
          $unwind: "$groupes"
        },
        {
          $group: {
            _id: "$groupes",
            users: {$addToSet: {"_id": "$_id", "firstName": "$firstName", "lastName": "$lastName"}}
          }
        }
      ])
      .exec(function (err, result) {
        callback(err, result);
      });
  },

  connexion: function(login, password, callback){
    UserModel
      .findOne({
        email : login,
        password : md5(password)
      })
      .exec(function(err, user){
        callback(err, user);
      })
  }
};
