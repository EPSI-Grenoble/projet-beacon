angular.module('starter.controllers', [])

.controller('LoginCtrl', function($scope, $state, RequestsService, BeaconService,$ionicPopup) {

  $scope.user = {};
  //$scope.user.username = window.localStorage['login'];
  //$scope.user.password = window.localStorage['password'];

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

  $scope.showPopup = function() {
    $scope.data = {};

    // An elaborate, custom popup
    var myPopup = $ionicPopup.show({
      template: '<input type="text" ng-model="data.guest">',
      title: 'Entrer le code invité',
      scope: $scope,
      buttons: [
        { text: 'Retour' },
        {
          text: '<b>Se connecter</b>',
          type: 'button-positive',
          onTap: function(e) {
            RequestsService.logGuest($scope.data.guest).then(function(response){
              if(response.success){
                e.preventDefault();
                $state.go('messages');
                window.localStorage["api_token"] = response.token;
                window.localStorage["guest"] = true;
                BeaconService.init();
              } else {
                $scope.messageError = response.msg
              }
            }, function(){
              $scope.messageError = "Une erreur est survenue."
            });
          }
        }
      ]
  });

  myPopup.then(function(res) {
    console.log('Tapped!', res);
  });

 };
})

.controller('ProfileCtrl', function($scope,$ionicSideMenuDelegate){
  $scope.showMenu = function() {
    $ionicSideMenuDelegate.toggleLeft();
  };
})

.controller('ListMessageCtrl', function($scope, Messages, $state, $ionicSideMenuDelegate) {
  $scope.displayMessages = $scope.allMessages = [];

  $scope.showMenu = function() {
    $ionicSideMenuDelegate.toggleLeft();
  };

  $scope.refresh = function() {
    Messages.all().then(function(response){
      $scope.allMessages = response;
      $scope.search()
    });
  };

  $scope.refresh();


  $scope.remove = function(message) {
    Messages.remove(message);
  };

  $scope.search = function() {
    if($scope.search.query){
      $scope.displayMessages = $scope.allMessages.filter(function (message) {
        var titre = message.titre.toLowerCase();
        return titre.indexOf($scope.search.query.toLowerCase()) > -1;
      });
    } else {
      $scope.displayMessages = $scope.allMessages;
    }
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
