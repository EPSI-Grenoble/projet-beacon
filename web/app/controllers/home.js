var express = require('express'),
  router = express.Router();
  mongoose = require('mongoose'),
  users = mongoose.model('users');

module.exports = function (app) {
  app.use('/', router);
};

router.get('/', function (req, res, next) {
    users.find( function(err, users) {
          console.log(users);
          res.render('index', {
             title: 'Index',
          })
        }
    )
});

router.get('/login', function (req, res, next) {
    res.render('login', {
        title: 'Login'
    });
});

router.post('/loggedIn', function (req, res) {
    users.findOne({username : req.body.user, password : req.body.password},
    function(err, users) {
        console.log(users);
        if (users) {
            res.render('loggedIn', {
                title: 'Vous êtes connécté',
                users: users
            })
        } else {
            res.render('notloggedIn', {
                title: 'Mauvais login ou mot de passe',
                error: 'NON C\'EST PAS CA !'
            })
        }
        // bite
    })
});
