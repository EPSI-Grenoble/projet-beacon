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

  var base_url = 'http://192.168.0.24:3000';

  function logIn(login, password){
    var deferred = $q.defer();
    $ionicLoading.show();

    console.log($rootScope.device_token);

    $http.post(base_url + '/api/auth', {'login': login, 'password' : password, 'device_token' :  $rootScope.device_token})
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

  function register(device_token){
    $rootScope.device_token = device_token;
  }


  return {
    logIn: logIn,
    register : register
  };


}]);
