angular.module('starter', ['ionic', 'starter.controllers', 'starter.services', "ngCordovaBeacon", "ngSanitize"])


/*
* Initialisation Application
*/
.run(function($ionicPlatform, NotificationService, $ionicLoading, $cordovaBeacon, $rootScope, BeaconService, $state) {
  $ionicPlatform.ready(function() {
    if (window.cordova && window.cordova.plugins && window.cordova.plugins.Keyboard) {
      cordova.plugins.Keyboard.hideKeyboardAccessoryBar(true);
      cordova.plugins.Keyboard.disableScroll(true);
      $cordovaBeacon.requestWhenInUseAuthorization();
      $cordovaBeacon.requestAlwaysAuthorization();
      NotificationService.init();
    }
    if (window.StatusBar) {
      StatusBar.styleDefault();
    }
  });
  /*
  * FOnction de déconnexion
  */
  $rootScope.logout = function(){
    $state.go('login', {}, {reload : true});
  }
})

/*
* Initialisation des routes
* Différentes vuesde l'appli : connexion, liste des messages, detail d'un message, profile
*/
.config(function($stateProvider, $urlRouterProvider) {

  $stateProvider
    .state('login', {
      url: '/login',
      templateUrl: 'templates/login.html',
      controller: 'LoginCtrl'
    })
    .state('messages', {
      url: '/messages',
      templateUrl: 'templates/list-message.html',
      controller: 'ListMessageCtrl'
    })
    .state('message-detail', {
      url: '/messages/:messageId',
      templateUrl: 'templates/message-detail.html',
      controller: 'MessageDetailCtrl'
    })
    .state('profile', {
      url: '/profile',
      templateUrl: 'templates/profile.html',
      controller: 'ProfileCtrl'
    });

  $urlRouterProvider.otherwise('/login');

});
