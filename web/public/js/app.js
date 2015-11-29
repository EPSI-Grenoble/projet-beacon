var app = angular.module("beacon", ["ckeditor", "ngSanitize", "ngSemantic"]);

app.controller('AddMessageController', function($scope, $http){
  $http.get("/api/beacon").success(function(beacons){
    $scope.beaconList = beacons;
  });
  $scope.sauvegarder = function(){
    $http.post("/api/message", $scope.message)
  }
});

app.controller('AddBeaconController', function($scope, $http){
  function getBeacons(){
    $http.get("/api/beacon").success(function(beacons){
      $scope.beacons = beacons;
    });
  }
  getBeacons();
  $scope.sauvegarder = function(){
    $http.post("/api/beacon", $scope.beacon).then(function(){
      getBeacons();
    });
  }
});
