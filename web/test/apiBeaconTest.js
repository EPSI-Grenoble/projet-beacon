var expect = require("chai").expect,
  server = require("./serverMock"),
  mongoose = require('mongoose'),
  md5 = require('md5'),
  supertest = require("supertest");


describe("Test Beacon API", function () {

  var request;

  before(function (done) {
    this.timeout(10000);
    server.app(function (app) {
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

  it("log user", function (done) {
    this.timeout(10000);
    request
      .post('/login')
      .send({
        'user': 'test@testeur.com',
        'password': 'test'
      })
      .expect(302, done)
  });

  it("Create invalid beacon", function (done) {
    this.timeout(10000);
    request
      .post('/api/beacons')
      .send({
        nom: "My beacon",
        uuid: "UUID_Pourri"
      })
      .end(function (err, res) {
        expect(res.statusCode).to.equal(400);
        expect(Object.keys(res.body).length).to.equal(1);
        done();
      });
  });

  it("Create beacon", function (done) {
    this.timeout(10000);
    request
      .post('/api/beacons')
      .send({
        nom: "My beacon",
        uuid: "110e8400-e29b-11d4-a716-446655440000"
      })
      .end(function (err, res) {
        expect(res.statusCode).to.equal(200);
        done();
      });
  });

  it("Get all beacon", function (done) {
    this.timeout(10000);
    request
      .get('/api/beacons')
      .end(function (err, res) {
        expect(res.statusCode).to.equal(200);
        expect(res.body.length).to.equal(1);
        done();
      });
  });


  after(function (done) {
    server.shutdown(function () {
      done()
    });
  })

});
