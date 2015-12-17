var app = angular.module("beacon", ["ckeditor", "ngSanitize", "ngSemantic", "checklist-model", "ngResource"]);

app.controller('AddMessageController', function($scope, $http, GroupeAPI, BeaconAPI, UserAPI){

  $scope.beaconList = BeaconAPI.get();

  $scope.groupes  = GroupeAPI.get();

  $scope.users = UserAPI.get();

  $scope.sauvegarder = function(){
    $http.post("/api/messages", $scope.message).success(function(message){
      $scope.message = message;
      notie.alert(1, 'Success!', 1.5);
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


app.controller('AddUserController', function($scope, $http){

  $http.get("/api/groupes").success(function(groupes){
    $scope.groupes = groupes;
  });

  $scope.sauvegarder = function(){
    $http.post("/api/users", $scope.user).success(function(user){
      $scope.user = user;
    })
  };
  $scope.user = {};
});

app.controller('AddBeaconController', function($scope, $http, BeaconAPI){

  function getBeacons(){
    $scope.beacons = BeaconAPI.get();
  }

  getBeacons();

  $scope.sauvegarder = function(){
      BeaconAPI.save($scope.beacon);
      getBeacons();
  };

  $scope.delete = function(beacon){
    BeaconAPI.delete({"id" : beacon._id});
    getBeacons();
  }
});
