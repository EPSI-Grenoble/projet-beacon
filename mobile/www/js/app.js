angular.module('starter', ['ionic', 'starter.controllers', 'starter.services', "ngCordovaBeacon", "ngSanitize"])

.run(function($ionicPlatform, NotificationService, $ionicLoading, $cordovaBeacon, $rootScope) {
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
        uniqueBeaconKey = pluginResult.beacons[i].uuid + ":" + pluginResult.beacons[i].major + ":" + pluginResult.beacons[i].minor;
        beacons[uniqueBeaconKey] = pluginResult.beacons[i];
      }
      console.log(beacons);
    });

    $cordovaBeacon.startRangingBeaconsInRegion($cordovaBeacon.createBeaconRegion("ibeacon", "962ad966-e97f-44af-b069-c89f8d7b3aa2"));
  });
})

.config(function($stateProvider, $urlRouterProvider) {

  // Ionic uses AngularUI Router which uses the concept of states
  // Learn more here: https://github.com/angular-ui/ui-router
  // Set up the various states which the app can be in.
  // Each state's controller can be found in controllers.js
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



  // if none of the above states are matched, use this as the fallback
  $urlRouterProvider.otherwise('/login');

});
