angular.module('starter.controllers', [])

.controller('LoginCtrl', function($scope, $state, RequestsService) {
  //$state.go('tab.dash');
  $scope.signIn = function(user) {
    console.log('Sign-In', user);

    RequestsService.logIn(user.username, user.password).then(function(response){
      if(response.success){
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

.controller('DashCtrl', function($scope){})

.controller('ChatsCtrl', function($scope, Chats) {
  // With the new view caching in Ionic, Controllers are only called
  // when they are recreated or on app start, instead of every page change.
  // To listen for when this page is active (for example, to refresh data),
  // listen for the $ionicView.enter event:
  //
  //$scope.$on('$ionicView.enter', function(e) {
  //});

  $scope.chats = Chats.all();
  $scope.remove = function(chat) {
    Chats.remove(chat);
  };
})

.controller('ChatDetailCtrl', function($scope, $stateParams, Chats) {
  $scope.chat = Chats.get($stateParams.chatId);
})

.controller('AccountCtrl', function($scope) {
  $scope.settings = {
    enableFriends: true
  };
});
