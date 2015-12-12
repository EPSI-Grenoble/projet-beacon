var app = angular.module("beacon", ["ckeditor", "ngSanitize", "ngSemantic", "checklist-model"]);

app.controller('AddMessageController', function($scope, $http){
  $http.get("/api/beacons").success(function(beacons){
    $scope.beaconList = beacons;
  });
  $http.get("/api/groupes").success(function(groupes){
    $scope.groupes = groupes;
  });
  $http.get("/api/users").success(function(users){
    $scope.users = users;
  });

  $scope.sauvegarder = function(){
    console.log($scope.message);
    $http.post("/api/messages", $scope.message).success(function(message){
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
          console.log(user);
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
    console.log($scope.user);
    $http.post("/api/users", $scope.user).success(function(user){
      $scope.user = user;
    })
  };
  $scope.user = {};
});

app.controller('AddBeaconController', function($scope, $http){

  function getBeacons(){
    $http.get("/api/beacons").success(function(beacons){
      $scope.beacons = beacons;
    });
  }

  getBeacons();

  $scope.sauvegarder = function(){
    $http.post("/api/beacons", $scope.beacon).then(function(){
      getBeacons();
    });
  };

  $scope.delete = function(beacon){
    $http.delete("/api/beacons/"+beacon._id).then(function(){
      getBeacons();
    });
  }
});
