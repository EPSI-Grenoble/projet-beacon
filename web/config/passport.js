var LocalStrategy = require("passport-local").Strategy;
var UsersModel = mongoose.model('users');

//sha1 = require("sha1");

module.exports = function(passport) {
  passport.serializeUser(function(user, done) {
    done(null, user);
  });
  passport.deserializeUser(function(id, done) {
    done(null, id);
  });
  passport.use(
    "local-login",
    new LocalStrategy({
      usernameField: "user",
      passwordField: "password",
      passReqToCallback: true
    }, function(req, username, password, done) {
      var mdp;
      //mdp = sha1(password);
      UsersModel.findOne(
        {username : username},
        function(err, user) {
          if(!user){
            return done(null, false, req.flash("loginMessage", "L'utilisateur n'existe pas"));
          }
          if(user.password == password){
            return done(null, user);
          } else {
            return done(null, false, req.flash("loginMessage", "Le mot de passe est incorrect"));
          }
        }
      );
    })
  );
};
