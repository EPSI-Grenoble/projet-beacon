var expect = require("chai").expect,
  server = require("./serverMock"),
  supertest = require("supertest");


describe("Test Beacon API", function () {

  var request;

  before(function (done) {
    server.app(function (app) {
      request = supertest.agent(app);
      done()
    });
  });

  it("log user", function (done) {
    request
      .post('/login')
      .send({
        'user': 'test@testeur.com',
        'password': 'test'
      })
      .expect(302, done)
  });

  it("Create invalid beacon", function (done) {
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
    request
      .get('/api/beacons')
      .end(function (err, res) {
        expect(res.statusCode).to.equal(200);
        expect(res.body.length).to.equal(1);
        done();
      });
  });


  after(function (done) {
    server.shutdown(function(){
      done()
    });
  })

});
