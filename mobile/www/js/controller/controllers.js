var app = angular.module('starter.controllers', []);

/**
 * Page de connexion
 */
app.controller('LoginCtrl', function($scope, $state, RequestsService, BeaconService,$ionicPopup, $rootScope) {

  $scope.user = {};
  $scope.user.username = "";
  $scope.user.password = "";
  //si un utilisateur c'est déjà connecter à l'application 
  if(window.localStorage['login'] != "undefined"){
    //On récupère le login stocker auparavant
    $scope.user.username = window.localStorage['login'];
  }

  if(window.localStorage['password'] != "undefined"){
    //On récupère le mot de passe
    $scope.user.password = window.localStorage['password'];
  }

  /**
   * Envoi les informations à l'API de connexion
   * @param user
     */
  $scope.signIn = function(user) {
    RequestsService.logIn(user.username, user.password).then(function(response){
      //Si la connexion de l'utilisateur à réussi
      if(response.success){
        //On récupère le token pour questionner l'api
        window.localStorage["api_token"] = response.token;
        //L'utilisateur n'est pas en mode invité
        $rootScope.guest = false;
        //On initialise la détection des beacons
        BeaconService.init();
        //On affiche la liste des messages
        $state.go('messages', {}, {reload : true});
        //$rootScope.refresh();
      } else {
        //Sinon on affiche le message d'erreur envoyé par l'api
        $scope.messageError = response.msg
      }
    }, function(){
      //Problème serveur
      $scope.messageError = "Une erreur est survenue."
    });
  };

  /**
   * Affiche une pop pour se connecter en tant que guest
   */
  $scope.showPopup = function() {
    $scope.data = {};
    //Affichage de la pop up
    $ionicPopup.show({
      template: '<input type="text" ng-model="data.guest">',
      title: 'Entrer le code invité',
      scope: $scope,
      buttons: [
        { text: 'Retour' },
        {
          text: '<b>Se connecter</b>',
          type: 'button-positive',
          onTap: function(e) {
            RequestsService.logGuest($scope.data.guest).then(function(response){
              //si la connexion en mode invité a réussi
              if(response.success){
                e.preventDefault();
                //On récupère le token pour questionner l'api
                window.localStorage["api_token"] = response.token;
                //L'utilisateur est en mode invité
                $rootScope.guest = true;
                //Initialisation detection beacon
                BeaconService.init();
                //Affichage de la liste des messages
                $state.go('messages', {}, {reload : true});
                $rootScope.refresh();
              } else {
                $scope.messageError = response.msg
              }
            }, function(){
              //Connexion à échouée
              $scope.messageError = "Une erreur est survenue."
            });
          }
        }
      ]
  });
 };
});

/**
 * Page du profil
 */
app.controller('ProfileCtrl', function($scope,$ionicSideMenuDelegate){
  
  //Affichage du menu
  $scope.showMenu = function() {
    $ionicSideMenuDelegate.toggleLeft();
  };
});

/**
 * Page de la liste des messages
 */
app.controller('ListMessageCtrl', function($scope, Messages, $state, $ionicSideMenuDelegate, $rootScope) {
  //Utilisation de la library moment => affichage des date (Time Ago)
  $scope.moment = moment;
  //Initialisation liste message
  $scope.displayMessages = $scope.allMessages = [];

  //Affichage du menu
  $scope.showMenu = function() {
    $ionicSideMenuDelegate.toggleLeft();
  };

  /**
   * Rafraichi la liste de messages
   */
  $rootScope.refresh = function() {
    Messages.all().then(function(response){
      //Sauvegarde de la liste des messages reçu dans le scope
      $scope.allMessages = response;
      //Pour chaque message on modifie l'icone associé au message en fonction du type de message (beaccon ou push)
      for (var i = 0; i < $scope.allMessages.length; i++) {
        if($scope.allMessages[i].typeMessage=="beacon"){
          $scope.allMessages[i].icon = "ion-ios-circle-filled";
        }else{
          $scope.allMessages[i].icon = "notifications";
        }
      }
      //Initialisation de la recherche (pas de filtre)
      $scope.search()
    });


  };

  $rootScope.refresh();


  $scope.remove = function(message) {
    Messages.remove(message);
  };

  /**
   * Filtre les messages
   */
  $scope.search = function() {
    //Si la recherche n'est pas vide
    if($scope.search.query){
      //Filtre sur le titre du message
      $scope.displayMessages = $scope.allMessages.filter(function (message) {
        var titre = message.titre.toLowerCase();
        return titre.indexOf($scope.search.query.toLowerCase()) > -1;
      });
    } else {
      //Affichage de tous les messages
      $scope.displayMessages = $scope.allMessages;
    }
  };
});

/**
 * Page de détail d'un message
 */
app.controller('MessageDetailCtrl', function($scope, $stateParams, Messages) {
  //Récupération du message en fonction de l'id passé en paramètre
  $scope.message = Messages.get($stateParams.messageId);
  //initialisation librarie moment (affichage date (Time Ago))
  $scope.moment = moment;
  Messages.get($stateParams.messageId).then(function(response){
    //Récupération du message
    $scope.message = response;
    //Initialisation de l'icone du message en fonction du type (beacon ou push)
    if($scope.message.typeMessage=="beacon"){
      $scope.message.icon = "ion-ios-circle-filled";
    }else{
      $scope.message.icon = "notifications";
    }
  }, function(){
    //Fail => retour à la page login
    $state.go('login');
  });
});
