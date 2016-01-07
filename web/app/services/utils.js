// isUserLogIn permet de vérifier que l'utilisateur est connecté sinon on le redirige vers la page d'authentification
var env = process.env.NODE_ENV || 'development';

module.exports =  {
  isAuth : function(req, res, next){
    if(req.isAuthenticated()){
      return next()
    } else {
      if(env === 'development') {
        return next()
      } else {
        res.redirect("/login");
      }
    }
  }
};
