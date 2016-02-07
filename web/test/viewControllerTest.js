var expect = require("chai").expect;
var server = require("./serverMock"),
  mongoose = require('mongoose'),
  md5 = require('md5'),
  supertest = require("supertest");


describe("Test controllers", function () {

  var request;

  before(function (done) {
    this.timeout(5000);
    server.app(function(app) {
      request = supertest.agent(app);
      var UserModel = mongoose.model('users');
      var user = new UserModel({
        email: "test@testeur.com",
        password: md5("test"),
        lastName: "Test",
        firstName: "App",
        isAdmin: true
      });
      user.save(function () {
        done()
      });
    });
  });

  it("GET / (Not log-in)", function (done) {
    this.timeout(5000);
    request
      .get('/')
      .expect(302, done);
  });

  it("POST /login (Log-in)", function (done) {
    this.timeout(5000);
    request
      .post('/login')
      .send({
        'user': 'test@testeur.com',
        'password': 'test'
      })
      .expect(302, done);
  });

  it("GET /messages", function (done) {
    this.timeout(5000);
    request
      .get('/messages')
      .expect(200, done)
  });

  it("GET /users", function (done) {
    this.timeout(5000);
    request
      .get('/users')
      .expect(200, done);
  });

  it("GET /users/edit", function (done) {
    this.timeout(5000);
    request
      .get('/users/edit')
      .expect(200, done);
  });

  it("GET /users/edit/:idUser", function (done) {
    this.timeout(5000);
    request
      .get('/users/edit/123')
      .expect(200, done);
  });

  it("GET /groupes", function (done) {
    this.timeout(5000);
    request
      .get('/groupes')
      .expect(200, done);
  });

  it("GET /beacons", function (done) {
    this.timeout(5000);
    request
      .get('/beacons')
      .expect(200, done);
  });

  after(function (done) {
    server.shutdown(function(){
      done()
    });
  })

});
