angular.module('starter.controllers', [])

.controller('MenuCtrl', function($rootScope) {

  $rootScope.signOut = function(){
      $state.go('login');
  }


});


.controller('LoginCtrl', function($scope, $state, RequestsService, BeaconService,$ionicPopup) {

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

  $scope.showPopup = function() {
    $scope.data = {};

    // An elaborate, custom popup
    var myPopup = $ionicPopup.show({
      template: '<input type="text" ng-model="data.guest">',
      title: 'Enter Guest Name',
      scope: $scope,
      buttons: [
        { text: 'Cancel' },
        {
          text: '<b>Sign-in</b>',
          type: 'button-positive',
          onTap: function(e) {
            if (!$scope.data.guest) {
              //don't allow the user to close unless he enters wifi password
              e.preventDefault();
            } else {
              return $scope.data.guest;
            }
          }
        }
      ]
  });

  myPopup.then(function(res) {
    console.log('Tapped!', res);
  });

 };
})


.controller('ListMessageCtrl', function($scope, Messages, $state, $ionicSideMenuDelegate) {
  $scope.displayMessages = $scope.allMessages = [];

  $scope.showMenu = function() {
    $ionicSideMenuDelegate.toggleLeft();
  };

  $scope.refresh = function() {
    $scope.displayMessages = $scope.allMessages = [];
    Messages.all().then(function(response){
      $scope.displayMessages = $scope.allMessages = response;
    }, function(){
      $state.go('login');
    });
  };

  $scope.refresh();
  

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
