'use strict';
var app = angular.module("beacon", ["ckeditor", "ngSanitize", "ngSemantic", "checklist-model", "ngResource"]);

app.controller('AddMessageController', function ($scope, $http, GroupeAPI, BeaconAPI, UserAPI) {

  $scope.beaconList = BeaconAPI.get();

  $scope.groupes = UserAPI.getGroupes();

  $scope.users = UserAPI.get();

  $scope.sauvegarder = function () {
    $http.post("/api/messages", $scope.message).success(function (message) {
      $scope.message = message;
      $scope.error = null;
      notie.alert(1, 'Success!', 1.5);
    }).error(function (err) {
      $scope.error = err.data;
      console.log(err);
      notie.alert(3, 'Erreur', 1.5);
    })
  };

  $scope.message = {
    destinataires: []
  };
  $scope.groupeSelected = [];

  $scope.selectUsers = function () {
    $scope.message.destinataires = [];
    angular.forEach($scope.groupes, function (groupe) {
      if ($scope.groupeSelected.indexOf(groupe._id) != -1) {
        angular.forEach(groupe.users, function (user) {
          $scope.message.destinataires.push(user._id);
        });
      }
    });
  };

});


app.controller('AddUserController', function ($scope, GroupeAPI, UserAPI) {

  $scope.groupes = GroupeAPI.get();

  $scope.sauvegarder = function () {
    if ($scope.user.password == $scope.user.passwordRepeat || !$scope.editPassword) {
      if (!$scope.editPassword) {
        delete $scope.user.password;
        delete $scope.user.passwordRepeat;
      }
      UserAPI.save($scope.user, function (user) {
        $scope.user = user;
        $scope.error = null;
        notie.alert(1, 'Sauvegardé !', 1.5);
      }, function (err) {
        $scope.error = err.data;
        notie.alert(3, 'Erreur', 1.5);
      });
    } else {
      $scope.error = {
        "password": {
          "message": "Les mots de passe ne correspondent pas"
        }
      };
    }
  };
  $scope.user = {};
});

app.controller('ListeUserController', function ($scope, UserAPI) {

  $scope.remove = function (id) {
    UserAPI.delete({"id": id});
    $scope.users = UserAPI.get();
  };

});

app.controller('ListeGroupesController', function ($scope, GroupeAPI) {

  $scope.editMode = [];

  $scope.remove = function (id) {
    GroupeAPI.delete({"id": id}, function () {
      $scope.groupes = GroupeAPI.get();
    });
  };

  $scope.edit = function (idGroupe) {
    $scope.editMode[idGroupe] = true;
  };

  $scope.save = function (groupe) {
    $scope.editMode[groupe._id] = false;
    GroupeAPI.save({"id": groupe._id}, groupe)
  };

  $scope.sauvegarder = function () {
    console.log("save");
    GroupeAPI.save($scope.groupeToSave, function () {
      $scope.groupes = GroupeAPI.get();
    });
  }

});

app.controller('AddBeaconController', function ($scope, BeaconAPI) {

  function getBeacons() {
    $scope.beacons = BeaconAPI.get();
  }

  getBeacons();

  $scope.sauvegarder = function () {
    BeaconAPI.save($scope.beacon, function () {
      getBeacons();
    }, function (err) {
      $scope.error = err.data;
    });
  };

  $scope.delete = function (beacon) {
    notie.confirm('Etes vous sur de vouloir supprimer ce beacon ?', 'Oui', 'Non', function () {
      BeaconAPI.delete({"id": beacon._id});
      getBeacons();
      notie.alert(1, 'Supprimé', 1.5);
    });
  }
});


app.controller('ListeGuestController', function ($scope, GuestAPI) {

  $scope.editMode = [];

  $scope.remove = function (id) {
    notie.confirm('Etes vous sur de vouloir supprimer ce beacon ?', 'Oui', 'Non', function () {
      GuestAPI.delete({"id": id}, function () {
        $scope.guests = GuestAPI.get();
      });
      notie.alert(1, 'Supprimé', 1.5);
    });
  };

  $scope.edit = function (idGuest) {
    $scope.editMode[idGuest] = true;
  };

  $scope.modifier = function (guest) {
    $scope.editMode[guest._id] = false;
    GuestAPI.save({"id": guest._id}, guest)
  };

  $scope.activate = function (guest) {
    guest.activate = true;
    GuestAPI.save({"id": guest._id}, guest)
  };

  $scope.desactivate = function (guest) {
    guest.activate = false;
    GuestAPI.save({"id": guest._id}, guest)
  };

  $scope.sauvegarder = function () {
    GuestAPI.save($scope.guestToSave, function () {
      $scope.groupes = GuestAPI.get();
    });
  }

});
