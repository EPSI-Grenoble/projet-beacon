// isUserLogIn permet de vérifier que l'utilisateur est connecté sinon on le redirige vers la page d'authentification
module.exports =  {
  isAuth : function(req, res, next){
    if(req.isAuthenticated()){
      return next()
    } else {
      return next()
      //res.redirect("/login");
    }
  }
};
