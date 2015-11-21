// isUserLogIn permet de vérifier que l'utilisateur est connecté sinon on le redirige vers la page d'authentification
module.exports =  function(req, res, next){
  if(req.isAuthenticated()){
    return next()
  } else {
    res.redirect("/login");
  }
};
