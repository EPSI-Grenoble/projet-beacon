var expect = require("chai").expect;
var server = require("./serverMock").app,
  supertest = require("supertest");


describe("Test controllers", function () {

  var request = supertest.agent(server);

  before(function(done){
    require("./serverMock").createUser(function(){
      done()
    })
  });

  it("GET / (Not log-in)", function (done) {
    request
      .get('/')
      .expect(302, done);
  });

  it("POST /login (Log-in)", function (done) {
    request
      .post('/login')
      .send({
        'user': 'test@testeur.com',
        'password': 'test'
      })
      .expect(302, done);
  });

  it("GET /messages", function (done) {
    request
      .get('/messages')
      .expect(200, done)
  });

  it("GET /users", function (done) {
    request
      .get('/users')
      .expect(200, done);
  });

  it("GET /users/edit", function (done) {
    request
      .get('/users/edit')
      .expect(200, done);
  });

  it("GET /users/edit/:idUser", function (done) {
    request
      .get('/users/edit/123')
      .expect(200, done);
  });

  it("GET /groupes", function (done) {
    request
      .get('/groupes')
      .expect(200, done);
  });

  it("GET /beacons", function (done) {
    request
      .get('/beacons')
      .expect(200, done);
  });

});
