var base_url = 'http://192.168.0.24:3000';

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
     // $ionicLoading.show();

      $http.post(base_url + '/api/auth', {'login': login, 'password' : password, 'device_token' :  window.localStorage['device_token']})
        .success(function(response){
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

      if(!window.localStorage['device_token']){
        //$ionicLoading.show();
      }

      var push = PushNotification.init({
        "android": {
          "senderID": "1018662230280"
        },
        "ios": {"alert": "true", "badge": "true", "sound": "true", "senderID": "1018662230280"},
        "windows": {}
      });

      push.on('registration', function(data) {
        console.log(data);
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
        console.log("push error");
      });

    }

    return {init: init};

  }]);

