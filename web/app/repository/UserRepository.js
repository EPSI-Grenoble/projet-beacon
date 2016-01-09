/**
 * Created by mchoraine on 09/01/2016.
 */
var mongoose = require('mongoose'),
  UserModel = mongoose.model("users");

module.exports = {
  updateGroupe: function (oldName, newName) {
    console.log(oldName);
    UserModel
      .find({groupes : oldName})
      .exec(function (err, users) {
        users.forEach(function(user){
          user.groupes.push(newName);
          user.groupes.splice(user.groupes.indexOf(oldName),1);
          user.save();
        });
      })
  }
};
