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
    db: 'mongodb://epsi:epsi@martin-choraine.fr:49153/beacon'
  },

  test: {
    root: rootPath,
    app: {
      name: 'web'
    },
    port: 3000,
    // db: 'mongodb://localhost/web-test'
  },

  production: {
    root: rootPath,
    app: {
      name: 'web'
    },
    port: 3000,
    // db: 'mongodb://localhost/web-production'
  }
};

module.exports = config[env];
