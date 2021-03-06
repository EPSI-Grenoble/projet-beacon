'use strict';
var app = angular.module("beacon", ["ckeditor", "ngSanitize", "ngSemantic", "checklist-model", "ngResource", 'ngDialog']);

app.controller('AddMessageController', function ($scope, $http, GroupeAPI, BeaconAPI, UserAPI, GuestAPI, ngDialog) {

  $scope.beaconList = BeaconAPI.get();

  $scope.groupes = UserAPI.getGroupes();

  $scope.guests = GuestAPI.get();
  console.log($scope.guests);

  $scope.users = UserAPI.get();

  $scope.sauvegarder = function () {
    $http.post("/api/messages", $scope.message).success(function (message) {
      $scope.message = message;
      $scope.error = null;
      notie.alert(1, 'Success!', 1.5);
      setTimeout(function() { window.location = "/messages";}, 1500);
    }).error(function (err) {
      $scope.error = err.errors;
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

  $scope.selectGuest = function(){
    angular.forEach($scope.guestSelected, function (guest) {
      $scope.message.destinataires.push(guest);
    });
  };

  $scope.userIsInSelectedGroup = function(id){
    console.log($scope.message.destinataires.indexOf(id));
    return $scope.message.destinataires.indexOf(id) != -1
  };

  $scope.openDestinaireList = function () {
    ngDialog.open({
      template: 'listeDestinatireTemplate',
      scope: $scope
    });
  };

});

app.controller('AddUserController', function ($scope, GroupeAPI, UserAPI) {

  $scope.groupes = GroupeAPI.get();
  $scope.user = {};

  $scope.sauvegarder = function () {
    if ($scope.user && $scope.editPassword && ($scope.user.password == "" || $scope.user.password == null)) {
      $scope.error = {
        "password": {
          "message": "Le mot de passe est obligatoire"
        }
      };
    } else if ($scope.user && ($scope.user.password == $scope.user.passwordRepeat || !$scope.editPassword)) {
      if (!$scope.editPassword) {
        delete $scope.user.password;
        delete $scope.user.passwordRepeat;
      }
      UserAPI.save($scope.user, function (user) {
        $scope.user = user;
        $scope.error = null;
        $scope.editPassword = false;
        notie.alert(1, 'Sauvegardé !', 1.5);
        setTimeout(function() { window.location = "/users";}, 1500);
      }, function (err) {
        $scope.error = err.data;
        notie.alert(3, 'Erreur', 1.5);
      });
    } else if ($scope.user) {
      $scope.error = {
        "password": {
          "message": "Les mots de passe ne correspondent pas"
        }
      };
    }
  };
  $scope.user = {};
});

app.controller('ListeMessageController', function ($scope, UserAPI, ngDialog) {
  $scope.openMessage = function (message, event) {
    event.preventDefault();
    $scope.message = message;
    $scope.destinataires = UserAPI.getUsersFromMessage({id: message._id});
    console.log($scope.destinataires);
    ngDialog.open({
      template: 'messageTemplate',
      scope: $scope,
      className: "ngdialog-theme-default message-detail"
    });
  };
});

app.controller('ListeUserController', function ($scope, UserAPI) {

  $scope.remove = function (id) {
        notie.confirm('Etes vous sur de vouloir supprimer ce User ?', 'Oui', 'Non', function () {
          UserAPI.delete({"id": id}, function () {
            $scope.users = UserAPI.get();
          });
          notie.alert(1, 'Supprimé', 1.5);
        });
      };

});

/*$scope.remove = function (id) {
      notie.confirm('Etes vous sur de vouloir supprimer ce guest ?', 'Oui', 'Non', function () {
        GuestAPI.delete({"id": id}, function () {
          $scope.guests = GuestAPI.get();
        });
        notie.alert(3, 'Supprimé', 1.5);
      });
    };*/

app.controller('ListeGroupesController', function ($scope, GroupeAPI, ngDialog) {

  $scope.editMode = [];

  $scope.remove = function (id) {
    notie.confirm('Etes vous sur de vouloir supprimer ce groupe ?', 'Oui', 'Non', function () {
      GroupeAPI.delete({"id": id}, function () {
        $scope.groupes = GroupeAPI.get();
      });
    });
  };

  $scope.edit = function (idGroupe) {
    $scope.editMode[idGroupe] = true;
  };

  $scope.save = function (groupe) {
    $scope.editMode[groupe._id] = false;
    GroupeAPI.save({"id": groupe._id}, groupe, function(){
      notie.alert(1, 'Sauvegardé !', 1.5);
    }, function(){
      notie.alert(3, 'Une erreur s\'est produite', 1.5);
    })
  };

  $scope.sauvegarder = function () {
    console.log("save");
    GroupeAPI.save($scope.groupeToSave, function () {
      $scope.groupes = GroupeAPI.get();
      notie.alert(1, 'Succes!', 1.5);
    }, function (err) {
      console.log(err.data.errors);
      $scope.error = err.data.errors;
      notie.alert(3, 'Erreur', 1.5);
    });
  };

  $scope.openMemberList = function (groupe) {
    ngDialog.open({
      template: 'listeMembreTemplate',
      controller: 'ListeMembresGroupesController',
      data: {
        "groupe": groupe
      }
    });
  };
//avec angular : transformation du err avec ajout dans l'arborescence de data --> err.data
});

app.controller('ListeMembresGroupesController', function ($scope, $filter, GroupeAPI, UserAPI) {
  $scope.groupe = $scope.ngDialogData.groupe;
  $scope.membres = GroupeAPI.getMembres({id: $scope.groupe._id}, function (membres) {
    UserAPI.get(function (users) {
      $scope.users = $filter('notMembers')(users, membres);
    });
  });

  $scope.removeUserFromGroupe = function (user, index) {
    notie.confirm('Etes vous sur de vouloir supprimer ce membre du groupe ?', 'Oui', 'Non', function () {
      GroupeAPI.removeMembres({id: $scope.groupe._id, user: user._id});
      $scope.membres.splice(index, 1);
      $scope.users = $filter('notMembers')($scope.users, $scope.membres);
    })
  };

  $scope.addUserToGroupe = function () {
    GroupeAPI.addToGroupe({id: $scope.groupe._id}, {user: $scope.userSelected}, function (userAdd) {
      $scope.membres.push(userAdd);
      $scope.users = $filter('notMembers')($scope.users, $scope.membres);
    });
    $scope.userSelected = null;
  }
});

app.controller('AddBeaconController', function ($scope, BeaconAPI, $timeout) {

  $scope.beacons = BeaconAPI.get();

  $scope.sauvegarder = function () {
    BeaconAPI.save($scope.beacon, function () {
      $scope.error = [];
      notie.alert(1, 'Sauvegardé !', 1.5);
      $timeout(function(){
        BeaconAPI.get(function(res){
          $scope.beacons = res;
        });
      }, 150)
    }, function (err) {
      $scope.error = err.data;
    });
  };

  $scope.remove = function (beacon) {
    notie.confirm('Etes vous sur de vouloir supprimer ce beacon ?', 'Oui', 'Non', function () {
      BeaconAPI.delete({"id": beacon._id});
      $timeout(function(){
        BeaconAPI.get(function(res){
          $scope.beacons = res;
        });
      }, 150);
      notie.alert(1, 'Supprimé', 1.5);
    });
  }
});


app.controller('ListeGuestController', function ($scope, GuestAPI) {

  $scope.editMode = [];
  $scope.editError = [];

  $scope.remove = function (id) {
    notie.confirm('Etes vous sur de vouloir supprimer ce guest ?', 'Oui', 'Non', function () {
      GuestAPI.delete({"id": id}, function () {
        $scope.guests = GuestAPI.get();
      });
      notie.alert(1, 'Supprimé', 1.5);
    });
  };

  $scope.edit = function (idGuest) {
    $scope.editMode[idGuest] = true;
  };

  $scope.modifier = function (guest, index) {
    GuestAPI.save({"id": guest._id}, guest, function(){
      notie.alert(1, 'Sauvegardé !', 1.5);
      $scope.editMode[guest._id] = false;
      $scope.guests = GuestAPI.get();
    }, function (err) {
      $scope.editError[index] = err.data.errors;
      notie.alert(3, 'Erreur', 1.5);
    });
  };

  $scope.activate = function (guest) {
    guest.activate = true;
    GuestAPI.save({"id": guest._id}, guest);
          notie.alert(1, 'Activé !', 1.5);
  };

  $scope.desactivate = function (guest) {
    guest.activate = false;
    GuestAPI.save({"id": guest._id}, guest);
          notie.alert(1, 'Désactivé !', 1.5);
  };

  $scope.sauvegarder = function () {
    GuestAPI.save($scope.guestToSave, function () {
      $scope.guests = GuestAPI.get();
            notie.alert(1, 'Sauvegardé !', 1.5);
    }, function (err) {
           console.log(err.data.errors);
           $scope.error = err.data.errors;
           notie.alert(3, 'Erreur', 1.5);
         });
  }
});

app.filter("notMembers", function () {
  return function (users, members) {
    members = members.map(function (member) {
      return member._id;
    });
    return users.filter(function (user) {
      return members.indexOf(user._id) == -1
    });
  };
});

