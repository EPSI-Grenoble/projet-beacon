var expect = require("chai").expect;
var server = require("./serverMock"),
  mongoose = require('mongoose'),
  md5 = require('md5'),
  supertest = require("supertest");


describe("Test controllers", function () {

  var request;
  before(function (done) {
    this.timeout(10000);
    server.app(function (app) {
      request = supertest.agent(app);
      done();
    });
  });

  it("should create user", function (done) {
    this.timeout(10000);
    request
      .post('/api/users')
      .send({
        email: "test@testeur.com",
        password: "test",
        lastName: "Test",
        firstName: "App",
        isAdmin: true
      })
      .expect(200, done)
  });

  it("GET / (Not log-in)", function (done) {
    this.timeout(10000);
    request
      .get('/')
      .expect(302, done);
  });

  it("POST /login (Log-in)", function (done) {
    this.timeout(10000);
    request
      .post('/login')
      .send({
        'user': 'test@testeur.com',
        'password': 'test'
      })
      .expect(302, done);
  });

  it("GET /messages", function (done) {
    this.timeout(10000);
    request
      .get('/messages')
      .expect(200, done)
  });

  it("GET /users", function (done) {
    this.timeout(10000);
    request
      .get('/users')
      .expect(200, done);
  });

  it("GET /users/edit", function (done) {
    this.timeout(10000);
    request
      .get('/users/edit')
      .expect(200, done);
  });

  it("GET /users/edit/:idUser", function (done) {
    this.timeout(10000);
    request
      .get('/users/edit/123')
      .expect(200, done);
  });

  it("GET /groupes", function (done) {
    this.timeout(10000);
    request
      .get('/groupes')
      .expect(200, done);
  });

  it("GET /beacons", function (done) {
    this.timeout(10000);
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
