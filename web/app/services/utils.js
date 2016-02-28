// isUserLogIn permet de vérifier que l'utilisateur est connecté sinon on le redirige vers la page d'authentification
var env = process.env.NODE_ENV || 'development';
var UserRepository = require("../repository/UserRepository");
var GuestRepository = require("../repository/GuestRepository");

module.exports =  {

  /**
   * Middleware pour vérifier que l'user est connecté
   * @param req
   * @param res
   * @param next
   * @returns {*}
     */
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

  /**
   * Middleware pour vérifier que le token est fourni puis existe
   * @param req
   * @param res
   * @param next
     */
  isTokenValid : function(req, res, next){
    var isGuest = (req.query.guest === 'true');
    console.log(isGuest);
    if(isGuest && isGuest != undefined){
      GuestRepository.tokenValid(req.query.token, function(err, user){
        if(user){
          req.user = user;
          return next()
        } else {
          res.sendStatus(401);
        }
      });
    } else {
      UserRepository.tokenValid(req.query.token, function(err, user){
        if(user){
          req.user = user;
          return next()
        } else {
          res.status(401).send(err);
        }
      });
    }
  },

  /**
   * Retourne une liste de proximity inférieur à celui fourni
   * @param proximity
   * @returns {Array}
     */
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
