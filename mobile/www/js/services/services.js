var base_url = 'http://51.255.50.20';

angular.module('starter.services', [])
  /**
   * Service Messages
   * Appels API pour les différentes fonctions liés aux messages
   */
  .factory('Messages', function ($http, $q, $rootScope) {
    /**
    * Récupérer tous les messages
    */
    function getAll() {
      var deferred = $q.defer();
      //Appel de l'api
      $http.get(base_url + "/api/messages/user?token=" + window.localStorage["api_token"] + "&guest=" + $rootScope.guest)
        .success(function (response) {
          //Succès => convertion de la réponse en une liste de messages
          deferred.resolve(response);
        })
        .error(function (data, status) {
          //Erreur 401 => accès refusé
          if (status == 401) {
            //Log out de l'utilisateur => retour à la page login
            $rootScope.logout();
          }
          deferred.reject();
        });

      return deferred.promise;
    }
    /**
    * Récupérer un message par rapport à son id
    */
    function get(id) {
      var deferred = $q.defer();
      //Appel de l'api
      $http.get(base_url + "/api/messages/user/" + id + "?token=" + window.localStorage["api_token"] + "&guest=" + $rootScope.guest)
        .success(function (response) {
          //Succès => convertion de la réponse en un message
          deferred.resolve(response);
        })
        .error(function (data, status) {
          //Accès refusé
          if (status == 401) {
            //Deconnexion de l'utilisateur => retour à la page login
            $rootScope.logout();
          }
          deferred.reject();
        });

      return deferred.promise;
    }

    function remove(id) {

    }

    /**
    * Fonctions disponible dans le scope (dans les controllers)
    */
    return {
      all: getAll,
      get: get,
      remove: remove
    };
  })

  /**
   * Service Connexion
   * Appels API pour les différentes connexion d'un utilisateur (normal ou en mode invité)
   */
  .factory('RequestsService', ['$http', '$q', '$ionicLoading', '$rootScope', function ($http, $q, $ionicLoading, $rootScope) {
    /**
    * Connexion d'un utilisateur (en mode normal)
    */
    function logIn(login, password) {
      var deferred = $q.defer();
      //Afficher spinner de chargement
      $ionicLoading.show();
      //Appel API => Connexion utilisateur
      $http.post(base_url + '/api/auth', {
          'login': login,
          'password': password,
          'device_token': window.localStorage['device_token']
        })
        .success(function (response) {
          //on stocke le token renvoyé par l'api pour les futurs appels
          window.localStorage["api_token"] = response.token;
          if (window.localStorage['device_token']) {
            $http.post(base_url + "/api/auth/gcm-token?token=" + window.localStorage["api_token"] + "&guest=" + $rootScope.guest, {"gcm-token": window.localStorage['device_token']})
          }
          //On stocke le login et le mot de passe renseignés pour les futurs connexion
          window.localStorage['login'] = login;
          window.localStorage['password'] = password;
          //On récupère l'objet user renvoyé par l'api pour le détail de l'utilisateur connecté
          $rootScope.user = response.user;
          //Affichage des groupes de l'utilisateur connecté
          $rootScope.user.groupesLabel = "";
          for (var i = 0; i < $rootScope.user.groupes.length; i++) {
            $rootScope.user.groupesLabel = $rootScope.user.groupesLabel + $rootScope.user.groupes[i];
            if(i != $rootScope.user.groupes.length-1){
              $rootScope.user.groupesLabel = $rootScope.user.groupesLabel + ", ";
            }
          };
          //Icon de l'utilisateur : première lettre du prénom + première lettre du nom (Page profil)
          $rootScope.user.icon = response.user.firstName.charAt(0) + response.user.lastName.charAt(0);
          //Username de l'utilisateur (Utilisé dans le menu) : prénom + nom
          $rootScope.user.username = response.user.firstName + " " + response.user.lastName;
          //Masquer le spinner de chargement
          $ionicLoading.hide();
          deferred.resolve(response);
        })
        .error(function (data) {
          //La connexion de l'utilisateur à échouée 
          deferred.reject();
          //Masquer le spinner de chargement
          $ionicLoading.hide();
        });
      return deferred.promise;
    }

    /**
    * Connexion d'un utilisateur (en mode invité)
    */
    function logGuest(codeGuest) {
      var deferred = $q.defer();
      //Affichage spinner de chargement
      $ionicLoading.show();
      /*
      * Appel API (auth-guest)
      */
      $http({
        url: base_url + '/api/auth-guest',
        method: "POST",
        data: {
          'code': codeGuest,
          'device_token': window.localStorage['device_token']
        },
        cache: false
      })
        .success(function (response) {
          //Username de l'utilisateur (utilisé dans le header du menu) : Nom de l'invité
          $rootScope.username = response.user.firstName;
          //Masquer le spinner de chargement
          $ionicLoading.hide();
          deferred.resolve(response);
        })
        .error(function (data) {
          //Erreur lors de la connexion en mode invité
          deferred.reject();
          //Masquer le spinner de chargement
          $ionicLoading.hide();
        });
      return deferred.promise;
    }
    /*
    * Fonctions disponibles dans le scope (Controllers)
    */
    return {
      logIn: logIn,
      logGuest: logGuest
    };

  }])

  /**
   * Service de notifications
   * Services pour recevoir des notifications push
   */
  .factory('NotificationService', ['$ionicLoading', '$state', '$rootScope', function ($ionicLoading, $state, $rootScope) {
    //Initialisation du service
    function init() {

      console.log("Notification service init");
      //Initialisation de la bibliothèque en fonction du device
      var push = PushNotification.init({
        "android": {
          "senderID": "1018662230280"
        },
        "ios": {"alert": "true", "badge": "true", "sound": "true", "senderID": "1018662230280"},
        "windows": {}
      });
      //ENregistrement du device au service notifications
      push.on('registration', function (data) {
        window.localStorage['device_token'] = data.registrationId;
        if ($rootScope.username) {
          $http.post(base_url + "/api/auth/gcm-token?token=" + window.localStorage["api_token"], {"gcm-token": data.registrationId})
        }
      });
      //Notification reçue
      push.on('notification', function (data) {
        console.log(data);
        push.finish(function () {
          //La notification envoie vers la page de détail du message concernée (id contenu dans la notification)
          $state.go('message-detail', {messageId: data.additionalData.messageID});
          console.log('finish successfully called');
        });
      });

      push.on('error', function (e) {
        console.error(e);
      });

    }

    return {init: init};

  }])
  
  /**
   * Service Beacon
   * Services detection beacon
   */
  .factory('BeaconService', ['$http', '$q', '$ionicLoading', '$cordovaBeacon', '$interval', '$rootScope', function ($http, $q, $ionicLoading, $cordovaBeacon, $interval, $rootScope) {

    var intervalBeaconRequest;

    /**
     * Get a beacon list to ranging
     */
    var beaconToListen = function () {
      if (angular.isDefined(intervalBeaconRequest)) {
        $interval.cancel(intervalBeaconRequest);
        intervalBeaconRequest = undefined;
      }
      intervalBeaconRequest = $interval(function () {
        $http.get(base_url + "/api/beacons/user/?token=" + window.localStorage["api_token"] + "&guest=" + $rootScope.guest).success(function (beaconsToListen) {
          angular.forEach(beaconsToListen, function (beacon) {
            var beaconRegion = $cordovaBeacon.createBeaconRegion("ibeacon", beacon.beacons);
            $cordovaBeacon.startMonitoringForRegion(beaconRegion);
            $cordovaBeacon.startRangingBeaconsInRegion(beaconRegion);
          })
        });
      }, 1000);
    };

    /**
     * To send a message for the beacon monitored
     * @param beaconUUID
     * @param proximity
     */
    var isMessageExist = function (beaconUUID, proximity) {
      $http.get(base_url + "/api/messages/user/beacon/" + beaconUUID + "?proximity=" + proximity + "&token=" + window.localStorage["api_token"] + "&guest=" + $rootScope.guest).success(function (result) {
        $cordovaBeacon.stopMonitoringForRegion($cordovaBeacon.createBeaconRegion("ibeacon", beaconUUID));
        $cordovaBeacon.stopRangingBeaconsInRegion($cordovaBeacon.createBeaconRegion("ibeacon", beaconUUID));
      })
    };

    /**
     * Listen for beacon
     */
    $rootScope.$on("$cordovaBeacon:didRangeBeaconsInRegion", function (event, pluginResult) {
      for (var i = 0; i < pluginResult.beacons.length; i++) {
        isMessageExist(pluginResult.beacons[i].uuid, pluginResult.beacons[i].proximity)
      }
    });

    return {
      init: beaconToListen,
      isMessageExist: isMessageExist
    }
  }]);

