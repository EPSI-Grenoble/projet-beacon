// isUserLogIn permet de vérifier que l'utilisateur est connecté sinon on le redirige vers la page d'authentification
var env = process.env.NODE_ENV || 'development';

module.exports =  {
  isAuth : function(req, res, next){
    if(req.isAuthenticated()){
      return next()
    } else {
      if(env === 'development') {
        req.user = {
          "email" : "dev@epsi.fr",
          "lastName" : "Dev",
          "firstName" : "User"
        };
        return next()
      } else {
        res.redirect("/login");
      }
    }
  },
  isTokenValid : function(req, res, next){
    if(req.session[req.query.token]){
      return next()
    } else {
      res.sendStatus(401);
    }
  },
  getProximity : function (proximity) {
    var proximityList = [];
    switch (proximity) {
      case "ProximityFar" :
        proximityList.push("ProximityFar");
        proximityList.push("ProximityUnknown");
        break;
      case "ProximityNear" :
        proximityList.push("ProximityFar");
        proximityList.push("ProximityNear");
        proximityList.push("ProximityUnknown");
        break;
      case "ProximityImmediate" :
        proximityList.push("ProximityFar");
        proximityList.push("ProximityNear");
        proximityList.push("ProximityImmediate");
        proximityList.push("ProximityUnknown");
        break;
    }
    return proximityList;
  }
};
