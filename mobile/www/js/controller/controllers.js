angular.module('starter.controllers', [])

.controller('LoginCtrl', function($scope, $state, RequestsService, BeaconService) {

  $scope.user = {};
  $scope.user.username = window.localStorage['login'];
  $scope.user.password = window.localStorage['password'];

  //$state.go('tab.dash');
  $scope.signIn = function(user) {
    console.log('Sign-In', user);

    RequestsService.logIn(user.username, user.password).then(function(response){
      if(response.success){
        $state.go('messages');
        window.localStorage["api_token"] = response.token;
        BeaconService.init();
      } else {
        $scope.messageError = response.msg
      }
    }, function(){
      $scope.messageError = "Une erreur est survenue."
    });
  };
})


.controller('ListMessageCtrl', function($scope, Messages, $state, $ionicSideMenuDelegate) {
  $scope.displayMessages = $scope.allMessages = [];

  $scope.showMenu = function() {
    $ionicSideMenuDelegate.toggleLeft();
  };

  Messages.all().then(function(response){
    $scope.displayMessages = $scope.allMessages = response;
  }, function(){
    $state.go('login');
  });

  $scope.remove = function(message) {
    Messages.remove(message);
  };

  $scope.search = function() {

    $scope.displayMessages = $scope.allMessages.filter(function (message) {
      var titre = message.titre.toLowerCase();
      return titre.indexOf($scope.search.query.toLowerCase()) > -1;
    });
  };
})

.controller('MessageDetailCtrl', function($scope, $stateParams, Messages) {
  $scope.message = Messages.get($stateParams.messageId);

  Messages.get($stateParams.messageId).then(function(response){
    $scope.message = response;
  }, function(){
    $state.go('login');
  });
});
