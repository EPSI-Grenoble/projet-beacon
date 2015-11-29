var LocalStrategy = require("passport-local").Strategy;
var UserModel = mongoose.model('users');

module.exports = function(passport) {
  passport.serializeUser(function(user, done) {
    done(null, user);
  });
  passport.deserializeUser(function(id, done) {
    done(null, id);
  });
  passport.use(
    "local-login",
    // On donne au module le nom des chans du formulaire correspondant au login et password
    new LocalStrategy({
      usernameField: "user",
      passwordField: "password",
      passReqToCallback: true
    }, function(req, username, password, done) {
      //On cherche un utilisateur dans la base qui à ce login
      UserModel.findOne(
        {email : username},
        function(err, user) {
          // Si il en existe pas on retourne un message d'erreur
          if(!user){
            return done(null, false, req.flash("loginMessage", "L'utilisateur n'existe pas"));
          }
          // Si il existe un utilisateur avec le bon mot de passe alors on le connecte
          if(user.password == password){
            return done(null, user);
          }
          // Sinon on retourne un message d'erreur
          else {
            return done(null, false, req.flash("loginMessage", "Le mot de passe est incorrect"));
          }
        }
      );
    })
  );
};
