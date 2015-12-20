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


app.controller('AddUserController', function($scope, GroupeAPI, UserAPI){

  $scope.groupes  = GroupeAPI.get();

  $scope.sauvegarder = function(){
      UserAPI.save($scope.user, function(user){
        $scope.user = user;
        $scope.error = null;
        notie.alert(1, 'Sauvegardé !', 1.5);
      }, function(err){
        $scope.error = err.data;
        notie.alert(3, 'Erreur', 1.5);
      });
  };
  $scope.user = {};
});

app.controller('ListeUserController', function($scope, UserAPI){

  $scope.remove = function(id){
    UserAPI.delete({"id" : id});
    $scope.users = UserAPI.get();
  };

});

app.controller('ListeGroupeController', function($scope, UserAPI){

  $scope.remove = function(id){
    UserAPI.delete({"id" : id});
    $scope.users = UserAPI.get();
  };

});

app.controller('AddBeaconController', function($scope , BeaconAPI){

  function getBeacons(){
    $scope.beacons = BeaconAPI.get();
  }

  getBeacons();

  $scope.sauvegarder = function(){
      BeaconAPI.save($scope.beacon, function(){
        getBeacons();
      }, function(err){
        $scope.error = err.data;
      });
  };

  $scope.delete = function(beacon){
    notie.confirm('Etes vous sur de vouloir supprimer ce beacon ?', 'Oui', 'Non', function() {
      BeaconAPI.delete({"id" : beacon._id});
      getBeacons();
      notie.alert(1, 'Supprimé', 1.5);
    });
  }
});
