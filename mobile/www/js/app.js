// Ionic Starter App

// angular.module is a global place for creating, registering and retrieving Angular modules
// 'starter' is the name of this angular module example (also set in a <body> attribute in index.html)
// the 2nd parameter is an array of 'requires'
// 'starter.services' is found in services.js
// 'starter.controllers' is found in controllers.js
angular.module('starter', ['ionic', 'starter.controllers', 'starter.services', "ngCordovaBeacon"])

.run(function($ionicPlatform, RequestsService, $ionicLoading, $cordovaBeacon, $rootScope) {
  $ionicPlatform.ready(function() {
    // Hide the accessory bar by default (remove this to show the accessory bar above the keyboard
    // for form inputs)
    if (window.cordova && window.cordova.plugins && window.cordova.plugins.Keyboard) {
      cordova.plugins.Keyboard.hideKeyboardAccessoryBar(true);
      cordova.plugins.Keyboard.disableScroll(true);
    }
    if (window.StatusBar) {
      // org.apache.cordova.statusbar required
      StatusBar.styleDefault();
    }

    if(!window.localStorage['device_token']){
      $ionicLoading.show();
    }

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

    pushNotification = window.plugins.pushNotification;

    window.onNotification = function(e){

      switch(e.event){
        case 'registered':
          if(e.regid.length > 0){
            $ionicLoading.hide();
            var device_token = e.regid;
            window.localStorage['device_token'] = device_token;
            RequestsService.register(device_token);
          }
          break;

        case 'message':
          break;

        case 'error':
          break;

      }
    };


    window.errorHandler = function(error){
      alert('an error occured');
    };


    pushNotification.register(
      onNotification,
      errorHandler,
      {
        'badge': 'true',
        'sound': 'true',
        'alert': 'true',
        'senderID': '1018662230280',
        'ecb': 'onNotification'
      }
    );
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
      //abstract: true,
      templateUrl: 'templates/login.html',
      controller: 'LoginCtrl'
    })


    // setup an abstract state for the tabs directive
    .state('tab', {
    url: '/tab',
    abstract: true,
    templateUrl: 'templates/tabs.html'
  })

  .state('tab.dash', {
    url: '/dash',
    views: {
      'tab-dash': {
        templateUrl: 'templates/tab-dash.html',
        controller: 'DashCtrl'
      }
    }
  })

  .state('tab.chats', {
      url: '/chats',
      views: {
        'tab-chats': {
          templateUrl: 'templates/tab-chats.html',
          controller: 'ChatsCtrl'
        }
      }
    })
    .state('tab.chat-detail', {
      url: '/chats/:chatId',
      views: {
        'tab-chats': {
          templateUrl: 'templates/chat-detail.html',
          controller: 'ChatDetailCtrl'
        }
      }
    })

  .state('tab.account', {
    url: '/account',
    views: {
      'tab-account': {
        templateUrl: 'templates/tab-account.html',
        controller: 'AccountCtrl'
      }
    }
  });


  // if none of the above states are matched, use this as the fallback
  $urlRouterProvider.otherwise('/login');

});
