var path = require('path'),
    rootPath = path.normalize(__dirname + '/..'),
    env = process.env.NODE_ENV || 'development';

var config = {
  development: {
    root: rootPath,
    app: {
      name: 'web'
    },
    port: 3000,
    db: 'mongodb://epsi:epsi@martin-choraine.fr:10443/beacon'
  },

  test: {
    root: rootPath,
    app: {
      name: 'web'
    },
    port: 3010,
    db: 'mongodb://localhost:27017/test-beacon'
  },

  preproduction: {
    root: rootPath,
    app: {
      name: 'web'
    },
    port: 3002,
    db: 'mongodb://epsi:epsi@martin-choraine.fr:10443/beacon'
  },

  production: {
    root: rootPath,
    app: {
      name: 'web'
    },
    port: 3002,
    db: 'mongodb://localhost:27017/beacon'
  }
};

module.exports = config[env];
