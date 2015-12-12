angular.module('starter.services', [])

  .factory('Chats', function() {
    // Might use a resource here that returns a JSON array

    // Some fake testing data
    var chats = [{
      id: 0,
      name: 'Ben Sparrow',
      lastText: 'You on your way?',
      face: 'img/ben.png'
    }, {
      id: 1,
      name: 'Max Lynx',
      lastText: 'Hey, it\'s me',
      face: 'img/max.png'
    }, {
      id: 2,
      name: 'Adam Bradleyson',
      lastText: 'I should buy a boat',
      face: 'img/adam.jpg'
    }, {
      id: 3,
      name: 'Perry Governor',
      lastText: 'Look at my mukluks!',
      face: 'img/perry.png'
    }, {
      id: 4,
      name: 'Mike Harrington',
      lastText: 'This is wicked good ice cream.',
      face: 'img/mike.png'
    }];

    return {
      all: function() {
        return chats;
      },
      remove: function(chat) {
        chats.splice(chats.indexOf(chat), 1);
      },
      get: function(chatId) {
        for (var i = 0; i < chats.length; i++) {
          if (chats[i].id === parseInt(chatId)) {
            return chats[i];
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
      $ionicLoading.show();

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

      console.log("Generate device token");
      if(!window.localStorage['device_token']){
        $ionicLoading.show();
      }

      pushNotification = window.plugins.pushNotification;

      window.onNotification = function(e){

        switch(e.event){
          case 'registered':
            if(e.regid.length > 0){
              $ionicLoading.hide();
              var device_token = e.regid;
              console.log("Token generate "+device_token);
              window.localStorage['device_token'] = device_token;
            }
            break;

          case 'message':
            break;

          case 'error':
            break;

        }
      };


      window.errorHandler = function(error){
        alert('an error occured');
      };


      pushNotification.register(
        onNotification,
        errorHandler,
        {
          'badge': 'true',
          'sound': 'true',
          'alert': 'true',
          'senderID': '1018662230280',
          'ecb': 'onNotification'
        }
      );

    }

    return {init: init};

  }]);

