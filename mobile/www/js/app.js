angular.module('starter', ['ionic', 'starter.controllers', 'starter.services', "ngCordovaBeacon", "ngSanitize"])

.run(function($ionicPlatform, NotificationService, $ionicLoading, $cordovaBeacon, $rootScope, BeaconService, $state) {
  $ionicPlatform.ready(function() {
    if (window.cordova && window.cordova.plugins && window.cordova.plugins.Keyboard) {
      cordova.plugins.Keyboard.hideKeyboardAccessoryBar(true);
      cordova.plugins.Keyboard.disableScroll(true);
    }
    if (window.StatusBar) {
      StatusBar.styleDefault();
    }

    NotificationService.init();

    $cordovaBeacon.enableBluetooth();
    $cordovaBeacon.requestWhenInUseAuthorization();

    $rootScope.$on("$cordovaBeacon:didRangeBeaconsInRegion", function(event, pluginResult) {
      for(var i = 0; i < pluginResult.beacons.length; i++) {
        console.log(pluginResult.beacons[i]);
        BeaconService.isMessageExist(pluginResult.beacons[i].uuid, pluginResult.beacons[i].proximity)
      }
    });
  });


  $rootScope.logout = function(){
    $state.go('login', {}, {reload : true});
  }
})

.config(function($stateProvider, $urlRouterProvider) {

  $stateProvider
    .state('login', {
      url: '/login',
      templateUrl: 'templates/testLogin.html',
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
