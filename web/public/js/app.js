var app = angular.module("beacon", ["ckeditor", "ngSanitize", "ngSemantic", "checklist-model"]);

app.controller('AddMessageController', function($scope, $http){
  $http.get("/api/beacon").success(function(beacons){
    $scope.beaconList = beacons;
  });
  $http.get("/api/groupes").success(function(groupes){
    $scope.groupes = groupes;
  });
  $http.get("/api/users").success(function(users){
    $scope.users = users;
  });

  $scope.sauvegarder = function(){
    $http.post("/api/message", $scope.message).success(function(message){
      $scope.message = message;
    })
  };

  $scope.message = {
    destinataires : []
  };
  $scope.groupeSelected = [];

  $scope.selectUsers = function() {
    $scope.message.destinataires = [];
    angular.forEach($scope.groupes, function(groupe){
      if($scope.groupeSelected.indexOf(groupe._id) != -1){
        angular.forEach(groupe.users, function(user){
          $scope.message.destinataires.push(user._id);
        });
      }
    });
  };

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
  };

  $scope.delete = function(beacon){
    $http.delete("/api/beacon/"+beacon._id).then(function(){
      getBeacons();
    });
  }
});
