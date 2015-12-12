angular.module('starter.services', [])

  .factory('Messages', function() {
    // Might use a resource here that returns a JSON array

    // Some fake testing data
    var messages = [{
      id: 'message1',
      titre: 'J\'aime le sexe',
      message: 'test 1',
      nom:"Edgard le grand",
      fromDate: '10/12/2015',
      toDate: '11/12/2015',
      photo: 'img/ben.png',
    },
    {id: 'message2',
      titre: 'J\'aime pas le sexe',
      message: 'test 2',
      fromDate: '10/12/2015',
      toDate: '11/12/2015',
      photo: 'img/ben.png',
    }];

    

    return {
      all: function() {
        return messages;
      },
      remove: function(message) {
        messages.splice(messages.indexOf(message), 1);
      },
      get: function(messageId) {
        for (var i = 0; i < messages.length; i++) {
          if (messages[i].id === messageId) {
            return messages[i];
          }
        }
        return null;
      }
    };
  })


  .factory('RequestsService', ['$http', '$q', '$ionicLoading', '$rootScope', function($http, $q, $ionicLoading, $rootScope) {

    var base_url = 'https://beacon.martin-choraine.fr';

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


  .factory('NotificationService', ['RequestsService', '$ionicLoading', function(RequestsService, $ionicLoading) {


    function init(){

      console.log("Notification service init");

      if(!window.localStorage['device_token']){
        //$ionicLoading.show();
      }

      var push = PushNotification.init({
        "android": {
          "senderID": "1018662230280"
        },
        "ios": {"alert": "true", "badge": "true", "sound": "true"},
        "windows": {}
      });

      push.on('registration', function(data) {
        console.log("registration event");
        console.log(data);
        window.localStorage['device_token'] = data.registrationId;
      });

      push.on('notification', function(data) {
        console.log("notification event");
        console.log(JSON.stringify(data));
        push.finish(function () {
          console.log('finish successfully called');
        });
      });

      push.on('error', function(e) {
        console.log("push error");
      });

    }

    return {init: init};

  }]);

