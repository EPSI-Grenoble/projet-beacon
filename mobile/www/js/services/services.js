var base_url = 'https://beacon.martin-choraine.fr';
//var base_url = 'http://192.168.0.24:3000';

angular.module('starter.services', [])

  .factory('Messages', function ($http, $q, $rootScope) {
    function getAll() {
      var deferred = $q.defer();

      $http.get(base_url + "/api/messages/user?token=" + window.localStorage["api_token"]+"&guest="+$rootScope.guest)
        .success(function (response) {
          deferred.resolve(response);
          console.log(response);
        })
        .error(function (data, status) {
          if(status == 401){
            $rootScope.logout();
          }
          deferred.reject();
        });

      return deferred.promise;
    }

    function get(id) {
      var deferred = $q.defer();

      $http.get(base_url + "/api/messages/user/" + id + "?token=" + window.localStorage["api_token"]+"&guest="+$rootScope.guest)
        .success(function (response) {
          deferred.resolve(response);
        })
        .error(function (data, status) {
          if(status == 401){
            $rootScope.logout();
          }
          deferred.reject();
        });

      return deferred.promise;
    }

    function remove(id) {

    }

    return {
      all: getAll,
      get: get,
      remove: remove
    };
  })


  .factory('RequestsService', ['$http', '$q', '$ionicLoading', '$rootScope', function ($http, $q, $ionicLoading,$rootScope) {

    function logIn(login, password) {
      var deferred = $q.defer();
      $ionicLoading.show();

      $http.post(base_url + '/api/auth', {
          'login': login,
          'password': password,
          'device_token': window.localStorage['device_token']
        })
        .success(function (response) {
          window.localStorage["api_token"] = response.token;
          if(window.localStorage['device_token']){
            $http.post(base_url + "/api/auth/gcm-token?token=" + window.localStorage["api_token"]+"&guest="+$rootScope.guest, {"gcm-token":window.localStorage['device_token']})
          }
          window.localStorage['login'] = login;
          window.localStorage['password'] = password;
          console.log(response.token);
          $rootScope.user = response.user;
          $rootScope.user.username = response.user.firstName +" "+response.user.lastName;
          $ionicLoading.hide();
          deferred.resolve(response);
        })
        .error(function (data) {
          deferred.reject();
          $ionicLoading.hide();
        });
      return deferred.promise;
    }

    function logGuest(codeGuest) {
      var deferred = $q.defer();
      $ionicLoading.show();

      $http({
        url : base_url + '/api/auth-guest',
        method : "POST",
        data: {
          'code': codeGuest,
          'device_token': window.localStorage['device_token']
        },
        cache: false
      })
        .success(function (response) {
          $rootScope.username = response.user.firstName;
          $ionicLoading.hide();
          deferred.resolve(response);
        })
        .error(function (data) {
          deferred.reject();
          $ionicLoading.hide();
        });
      return deferred.promise;
    }

    return {
      logIn: logIn,
      logGuest: logGuest
    };

  }])


  .factory('NotificationService', ['$ionicLoading', '$state', '$rootScope', function ($ionicLoading, $state, $rootScope) {
    function init() {

      console.log("Notification service init");

      var push = PushNotification.init({
        "android": {
          "senderID": "1018662230280"
        },
        "ios": {"alert": "true", "badge": "true", "sound": "true", "senderID": "1018662230280"},
        "windows": {}
      });

      //if (!window.localStorage['device_token']) {
      //  push.unregister(function (ok) {});
      //} else {
      //  console.log(window.localStorage['device_token']);
      //}

      push.on('registration', function (data) {
        window.localStorage['device_token'] = data.registrationId;
        if($rootScope.username){
          $http.post(base_url + "/api/auth/gcm-token?token=" + window.localStorage["api_token"], {"gcm-token":data.registrationId})
        }
      });

      push.on('notification', function (data) {
        console.log(data);
        push.finish(function () {
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

  .factory('BeaconService', ['$http', '$q', '$rootScope', '$cordovaBeacon', '$interval', '$rootScope', function ($http, $q, $ionicLoading, $cordovaBeacon, $interval, $rootScope) {

    var intervalBeaconRequest;

    var beaconToListen = function () {
      if (angular.isDefined(intervalBeaconRequest)) {
        $interval.cancel(intervalBeaconRequest);
        intervalBeaconRequest = undefined;
      }
      intervalBeaconRequest = $interval(function () {
        $http.get(base_url + "/api/beacons/user/?token=" + window.localStorage["api_token"]+"&guest="+$rootScope.guest).success(function (beaconsToListen) {
          angular.forEach(beaconsToListen, function (beacon) {
            console.log(beacon);
            $cordovaBeacon.startRangingBeaconsInRegion($cordovaBeacon.createBeaconRegion("ibeacon", beacon.beacons));
          })
        });
      }, 10000);
    };

    var isMessageExist = function (beaconUUID, proximity) {
      $http.get(base_url + "/api/messages/user/beacon/" + beaconUUID + "?proximity=" + proximity + "&token=" + window.localStorage["api_token"]+"&guest="+$rootScope.guest).success(function (result) {
        $cordovaBeacon.stopRangingBeaconsInRegion($cordovaBeacon.createBeaconRegion("ibeacon", beaconUUID));
      })
    };

    return {
      init: beaconToListen,
      isMessageExist: isMessageExist
    }
  }]);

