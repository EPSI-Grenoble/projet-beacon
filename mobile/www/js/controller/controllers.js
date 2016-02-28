var app = angular.module('starter.controllers', []);

/**
 * Page de connexion
 */
app.controller('LoginCtrl', function($scope, $state, RequestsService, BeaconService,$ionicPopup, $rootScope) {

  $scope.user = {};
  $scope.user.username = "";
  $scope.user.password = "";
  if(window.localStorage['login'] != "undefined"){
    $scope.user.username = window.localStorage['login'];
  }

  if(window.localStorage['password'] != "undefined"){
    $scope.user.password = window.localStorage['password'];
  }

  /**
   * Envoi les informations à l'API de connexion
   * @param user
     */
  $scope.signIn = function(user) {
    RequestsService.logIn(user.username, user.password).then(function(response){
      if(response.success){
        window.localStorage["api_token"] = response.token;
        $rootScope.guest = false;
        BeaconService.init();
        $state.go('messages', {}, {reload : true});
        //$rootScope.refresh();
      } else {
        $scope.messageError = response.msg
      }
    }, function(){
      $scope.messageError = "Une erreur est survenue."
    });
  };

  /**
   * Affiche une pop pour se connecter en tant que guest
   */
  $scope.showPopup = function() {
    $scope.data = {};
    $ionicPopup.show({
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
                window.localStorage["api_token"] = response.token;
                $rootScope.guest = true;
                BeaconService.init();
                $state.go('messages', {}, {reload : true});
                $rootScope.refresh();
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
 };
});

/**
 * Page du profil
 */
app.controller('ProfileCtrl', function($scope,$ionicSideMenuDelegate){
  $scope.showMenu = function() {
    $ionicSideMenuDelegate.toggleLeft();
  };
});

/**
 * Page de la liste des messages
 */
app.controller('ListMessageCtrl', function($scope, Messages, $state, $ionicSideMenuDelegate, $rootScope) {
  $scope.moment = moment;
  $scope.displayMessages = $scope.allMessages = [];

  $scope.showMenu = function() {
    $ionicSideMenuDelegate.toggleLeft();
  };

  /**
   * Rafraichi la liste de messages
   */
  $rootScope.refresh = function() {
    Messages.all().then(function(response){
      $scope.allMessages = response;

      for (var i = 0; i < $scope.allMessages.length; i++) {
        if($scope.allMessages[i].typeMessage=="beacon"){
          $scope.allMessages[i].icon = "ion-ios-circle-filled";
        }else{
          $scope.allMessages[i].icon = "notifications";
        }
      }
      $scope.search()
    });


  };

  $rootScope.refresh();

  $scope.remove = function(message) {
    Messages.remove(message);
  };

  /**
   * Filtre les messages
   */
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
});

/**
 * Page de détail d'un message
 */
app.controller('MessageDetailCtrl', function($scope, $stateParams, Messages) {
  $scope.message = Messages.get($stateParams.messageId);
  $scope.moment = moment;
  Messages.get($stateParams.messageId).then(function(response){
    $scope.message = response;
    if($scope.message.typeMessage=="beacon"){
      $scope.message.icon = "ion-ios-circle-filled";
    }else{
      $scope.message.icon = "notifications";
    }
  }, function(){
    $state.go('login');
  });
});
