var express = require('express'),
  router = express.Router(),
  mongoose = require('mongoose'),
  passport = require('passport'),
  UserModel = mongoose.model('users'),
  MessageModel = mongoose.model('messages'),
  GroupeModel = mongoose.model('groupes'),
  BeaconModel = mongoose.model('beacons'),
  UserRepository = require("../repository/UserRepository"),
  Utils = require("../services/utils");

module.exports = function (app) {
  app.use('/', router);
};

// Page d'accueil
router.get('/', Utils.isAuth , function (req, res, next) {
  UserModel.find( function(err, usersList) {
      res.render('index', {
        title: 'EPSI Contact',
        user : req.user,
        users : usersList
      })
    }
  )
});

// Page des messages
router.get('/messages', Utils.isAuth, function (req, res, next) {
    MessageModel.find().sort({"dateCreation" : -1}).exec(function(err, toutLesMessage) {
      res.render('messages/listeMessages', {
        title: 'Liste des messages envoyés',
        user : req.user,
        messages : toutLesMessage
      })
    })
});

// Page de l'edition de message
router.get('/messages/edit', Utils.isAuth, function (req, res, next) {
  UserModel.find( function(err, usersList) {
      res.render('messages/editMessage', {
        title: 'Envoyer un message',
        user : req.user
      });
  });
});

// Page du compte
router.get('/myaccount', Utils.isAuth, function (req, res, next) {
    res.render('users/myAccount', {
      subtitle: 'Vous êtes ici chez vous , bienvenue',
      title: 'Afficher mon compte',
      user : req.user
    });
});

// Page des users
router.get('/users', Utils.isAuth, function (req, res, next) {
    UserModel.find().sort({lastName: 1}).exec(function(err, toutLesUser) {
      toutLesUser = toutLesUser.map(function(user){
        user = user.toObject();
        delete user.password;
        return user;
      });
      res.render('users/listeUsers', {
        title: 'Les Utilisateurs',
        subtitle: 'Liste des utilisateurs',
        users : toutLesUser,
        user : req.user
      })
    })
});

// Page de l'edition de user
router.get('/users/edit', Utils.isAuth, function (req, res, next) {
    res.render('users/editUser', {
      title: 'Créer un utilisateur',
      user : req.user,
      newUser : null
    });
});

// Page de l'edition de user
router.get('/users/edit/:idUser', Utils.isAuth, function (req, res, next) {
  UserModel.findOne({"_id" : req.params.idUser}, function(err, user){
    if(user){
      user = user.toObject();
      delete user["password"];
    }
    res.render('users/editUser', {
      title: 'Modifier un utilisateur',
      newUser : user,
      user : req.user
    });
  });
});

// Page des groupes
router.get('/groupes', Utils.isAuth, function (req, res, next) {
  GroupeModel.find().sort({name: 1}).exec(function(err, toutLesGroupes) {
    res.render('groupes/listeGroup', {
      title: 'Listes de diffusion',
      subtitle: '',
      groupes : toutLesGroupes,
      user : req.user
    })
  })
});

// Page des beacons
router.get('/beacons', Utils.isAuth, function (req, res, next) {
    BeaconModel.find( function(err, toutlesBeacons) {
      res.render('beacons/addBeacon', {
        title: 'Administrer lLes beacons',
        beacons : toutlesBeacons,
        user : req.user
      })
    })
});

// Page de connexion
router.get('/login', function (req, res, next) {
  res.render('login', {
    title: 'Login',
    message: req.flash('loginMessage')
  });
});

// Authentification qu'on délégue au composant passport
router.post('/login', passport.authenticate('local-login', { successRedirect: '/', failureRedirect: '/login' }));

// Page de déconnexion
router.get('/logout', function(req, res){
  req.logout();
  res.redirect('/login');
});

// Pade de comptes
router.get("/monCompte", Utils.isAuth, function (req, res, next) {
    res.render('comptes/viewAccount',{
      title: 'Afficher mon comptes',
      subtitle: 'Voici votre comptes',
      user : req.user
    });
});
// Page admin
router.get("/viewAdmin", Utils.isAuth, function (req, res, next) {

  UserRepository.getAllAdmins(function (err, users) {
    res.render('admins/viewAdmin',{
      title: 'Afficher les admins',
      subtitle: 'Voici tous les admins',
      users : users,
      user: req.user
    });
  })
});
// Page user
router.get("/viewUser", Utils.isAuth, function (req, res, next) {

  UserRepository.getAllUserOnly(function (err, users) {
    res.render('admins/viewUser',{
      title: 'Afficher les users',
      subtitle: 'Voici tous les users',
      users : users,
      user: req.user
    });
  })
});

