angular.module('starter', ['ionic', 'starter.controllers', 'starter.services', "ngCordovaBeacon", "ngSanitize"])

.run(function($ionicPlatform, NotificationService, $ionicLoading, $cordovaBeacon, $rootScope, BeaconService) {
  $ionicPlatform.ready(function() {
    if (window.cordova && window.cordova.plugins && window.cordova.plugins.Keyboard) {
      cordova.plugins.Keyboard.hideKeyboardAccessoryBar(true);
      cordova.plugins.Keyboard.disableScroll(true);
    }
    if (window.StatusBar) {
      StatusBar.styleDefault();
    }

    NotificationService.init();

    $cordovaBeacon.requestWhenInUseAuthorization();

    $rootScope.$on("$cordovaBeacon:didRangeBeaconsInRegion", function(event, pluginResult) {
      var uniqueBeaconKey, beacons = {};
      for(var i = 0; i < pluginResult.beacons.length; i++) {
        BeaconService.isMessageExist(pluginResult.beacons[i].uuid)
      }
      console.log(beacons);

    });
  });
})

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
    });

  $urlRouterProvider.otherwise('/login');

});
