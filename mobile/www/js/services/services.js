var base_url = 'https://beacon.martin-choraine.fr/';

angular.module('starter.services', [])

  .factory('Messages', function($http, $q) {
    function getAll(){
      var deferred = $q.defer();

      $http.get(base_url+"/api/messages/user?token="+window.localStorage["api_token"])
        .success(function(response){
          deferred.resolve(response);
        })
        .error(function(data){
          deferred.reject();
        });

      return deferred.promise;
    }

    function get(id){
      var deferred = $q.defer();

      $http.get(base_url+"/api/messages/user/"+id+"?token="+window.localStorage["api_token"])
        .success(function(response){
          deferred.resolve(response);
        })
        .error(function(data){
          deferred.reject();
        });

      return deferred.promise;
    }

    function remove(id){

    }

    return {
      all: getAll,
      get: get,
      remove: remove
    };
  })


  .factory('RequestsService', ['$http', '$q', '$ionicLoading', '$rootScope', function($http, $q, $ionicLoading) {

    function logIn(login, password){
      var deferred = $q.defer();
      $ionicLoading.show();

      $http.post(base_url + '/api/auth', {'login': login, 'password' : password, 'device_token' :  window.localStorage['device_token']})
        .success(function(response){
          window.localStorage['login'] = login;
          window.localStorage['password'] = password;
          $ionicLoading.hide();
          deferred.resolve(response);
        })
        .error(function(data){
          deferred.reject();
          $ionicLoading.hide();
        });
      return deferred.promise;
    }

    return {
      logIn: logIn
    };

  }])


  .factory('NotificationService', ['$ionicLoading','$state', function($ionicLoading, $state) {
    function init(){

      console.log("Notification service init");

      var push = PushNotification.init({
        "android": {
          "senderID": "1018662230280"
        },
        "ios": {"alert": "true", "badge": "true", "sound": "true", "senderID": "1018662230280"},
        "windows": {}
      });

      if(!window.localStorage['device_token']){
        $ionicLoading.show();
        push.unregister(function(ok){
          console.log(ok);
        });
      } else {
        console.log(window.localStorage['device_token']);
      }

      push.on('registration', function(data) {
        console.log(data);
        $ionicLoading.hide();
        window.localStorage['device_token'] = data.registrationId;
      });

      push.on('notification', function(data) {
        console.log(data);
        push.finish(function () {
          $state.go('message-detail', {messageId: data.additionalData.messageID});
          console.log('finish successfully called');
        });
      });

      push.on('error', function(e) {
        console.error(e);
        $ionicLoading.hide();
      });

    }

    return {init: init};

  }])

  .factory('BeaconService', ['$http', '$q', '$rootScope', '$cordovaBeacon', function($http, $q, $ionicLoading, $cordovaBeacon) {

    var beaconToListen = function(){
      $http.get(base_url+"/api/beacons/user/?token="+window.localStorage["api_token"]).success(function(beaconsToListen){
          angular.forEach(beaconsToListen, function(beacon){
            console.log(beacon);
            $cordovaBeacon.startRangingBeaconsInRegion($cordovaBeacon.createBeaconRegion("ibeacon", beacon.beacons));
          })
      });
    };

    var isMessageExist = function (beaconUUID, proximity) {
      $http.get(base_url+"/api/messages/user/beacon/"+beaconUUID+"?proximity="+proximity+"&token="+window.localStorage["api_token"]).success(function(result){
        $cordovaBeacon.stopRangingBeaconsInRegion($cordovaBeacon.createBeaconRegion("ibeacon", beaconUUID));

      })
    };

    return {
      init : beaconToListen,
      isMessageExist : isMessageExist
    }
  }]);

