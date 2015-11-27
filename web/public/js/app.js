var app = angular.module("beacon", ["ckeditor", "ngSanitize"]);

app.controller('AddMessageController', function($scope, $http){
  $http.get("/api/message").success(function(messages){
    $scope.messages = messages;
  })
  $scope.sauvegarder = function(){
    $http.post("/api/message", $scope.message)
  }
});

app.controller('AddBeaconController', function($scope, $http){
  $http.get("/api/beacon").success(function(beacons){
    $scope.beacons = beacons;
  })
  $scope.sauvegarder = function(){
    $http.post("/api/beacon", $scope.beacon)
  }
});
