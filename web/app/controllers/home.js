var express = require('express'),
  router = express.Router(),
  mongoose = require('mongoose'),
  passport = require('passport'),
  UserModel = mongoose.model('users'),
  MessageModel = mongoose.model('messages'),
  GroupeModel = mongoose.model('groupes'),
  BeaconModel = mongoose.model('beacons'),
  Utils = require("../services/utils"),
  multer  =   require('multer'),
  Excel = require("exceljs"),
  UserRepository = require("../repository/UserRepository"),
  GuestRepository = require("../repository/GuestRepository"),
  md5 = require('md5'),
  upload = multer({ dest: 'uploads/' });

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
  );
  console.log(req.session);
});

// Page des messages
router.get('/messages', Utils.isAuth, function (req, res, next) {
    MessageModel.find().sort({"dateCreation" : -1}).exec(function(err, toutLesMessage) {


      res.render('messages/listeMessages', {
        title: 'Liste des messages envoyés',
        user : req.user,
        messages : toutLesMessage,

      })
    })
});

// Page de l'edition de message
router.get('/messages/edit', Utils.isAuth, function (req, res, next) {
  UserModel.find( function(err, usersList) {
  var type = req.query.type;
      res.render('messages/editMessage', {
        title: 'Envoyer un message',
        user : req.user,
        type : type
      });
  });
});

// Page du compte
router.get('/myaccount', Utils.isAuth, function (req, res, next) {
    res.render('users/myAccount', {
      subtitle: 'Vous êtes ici chez vous, bienvenue',
      title: 'Afficher mon compte',
      user : req.user
    });
});

// Page des users
router.get('/users', Utils.isAuth, function (req, res, next) {
  UserRepository.getAllUsers(function(err, toutLesUser) {
      toutLesUser = toutLesUser.map(function(user){
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

// Page d'import des users
router.get('/users/import', Utils.isAuth, function (req, res, next) {
    res.render('users/importUsers', {
      title: 'Importer des utilisateurs',
      user : req.user
    });
});

// Url import XLS
router.post('/users/sendXls', upload.single('usersXls'), function (req, res, next) {
  res.header("Content-Type", "application/json; charset=utf-8");
  var workbook = new Excel.Workbook();
  var options = {
    map: function(value, index) {
        return value;
    }
  }
  workbook.csv.readFile(req.file.path, options)
      .then(function(worksheet) {
        var counter = 0;
        // Pour chaque ligne, on crée un array de groupes avec les groupes, on crée un dict et on crée un user
        worksheet.eachRow(function(row, rowNumber) {
          counter += 1;
        });
        worksheet.eachRow(function(row, rowNumber) {
          var groupes = row.values[5].split(",");
          if (rowNumber != 0){
            var dict = {
              'firstName':row.values[1],
              'lastName':row.values[2],
              'email':row.values[3],
              'password':md5(row.values[4]),
              'groupes' : groupes
            }
            UserRepository.createUser(dict, function (err, user) {
              if (err) {
                if(counter == rowNumber){
                    res.status(406).send(err.errors);
                }
              }
              if (rowNumber == counter) {
                res.redirect('/users');
              }
            });
          }

        });
      });
})

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
router.get('/guest', Utils.isAuth, function (req, res, next) {
  GuestRepository.getAllGuest(function(err, guests) {
    res.render('guest/listeGuest', {
      title: 'Guest',
      subtitle: 'Liste des utilisateurs guests',
      guest : guests,
      user : req.user
    })
  })
});

// Page admin
router.get("/admin", Utils.isAuth, function (req, res, next) {

  UserRepository.getAllAdmins(function (err, users) {
    res.render('admins/viewAdmin',{
      title: 'Administrateurs',
      subtitle: 'Liste des utilisateurs administrateurs  ',
      users : users,
      user: req.user
    });
  })
});

// Page des beacons
router.get('/beacons', Utils.isAuth, function (req, res, next) {
    BeaconModel.find( function(err, toutlesBeacons) {
      res.render('beacons/addBeacon', {
        title: 'Administrer les beacons',
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

// Pade de compte
router.get("/monCompte", Utils.isAuth, function (req, res, next) {
    res.render('comptes/viewAccount',{
      title: 'Afficher mon compte',
      subtitle: 'Voici votre compte',
      user : req.user
    });
});

