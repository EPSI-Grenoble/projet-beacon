angular.module('starter.controllers', [])

.controller('LoginCtrl', function($scope, $state, RequestsService) {
  //$state.go('tab.dash');
  $scope.signIn = function(user) {
    console.log('Sign-In', user);

    RequestsService.logIn(user.username, user.password).then(function(response){
      if(response.success){
        $state.go('messages');
        window.localStorage["api_token"] = response.token;
        $state.go('tab.dash');
      } else {
        $scope.messageError = response.msg
      }
    }, function(){
      $scope.messageError = "Une erreur est survenue."
    });
  };
})



.controller('ListMessageCtrl', function($scope, Messages) {

  $scope.messages = Messages.all();
  $scope.remove = function(message) {
    Messages.remove(message);
  };
})

.controller('MessageDetailCtrl', function($scope, $stateParams, Messages) {
  $scope.message = Messages.get($stateParams.messageId);
})

