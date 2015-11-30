
var mongoose = require('mongoose'),
  Schema = mongoose.Schema;

var UserSchema = new Schema({
  email: String,
  password: String,
  lastName: String,
  firstName: String,
  token: String,
  date_token: Date,
  groupes: []
});

UserSchema.statics.getGroupes = function(callback){
  this.aggregate([
    { $unwind: "$groupes" },
    { $group: {
      _id: "$groupes",
      users: {$addToSet : { "_id":"$_id", "firstName" : "$firstName", "lastName": "$lastName"}}
    }}
  ], function (err, result) {
    if (err) {
      callback(err);
      return;
    }
    callback(result);
  });
};

mongoose.model('users', UserSchema);
