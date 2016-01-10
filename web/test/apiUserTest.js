var expect = require("chai").expect;
var server = require("./serverMock").app,
  mockgoose = require('mockgoose'),
  supertest = require("supertest");


describe("Test Users API", function () {
  var request = supertest.agent(server);

  before(function (done) {
    mockgoose.reset(function() {
      require("./serverMock").createUser(function () {
        request
          .post('/login')
          .send({
            'user': 'test@testeur.com',
            'password': 'test'
          })
          .expect(302, done)
      });
    })
  });

  it("Create user", function (done) {
    request
      .post('/api/users')
      .send({
        email: "test2@testeur.com",
        password: "test",
        lastName: "Test",
        firstName: "App",
        token: "jjfjjsj", // Obligatoire sinon ça plante...
        device_token: "fjkfjkfj" // Obligatoire sinon ça plante...
      })
      .end(function (err, res) {
        expect(res.statusCode).to.equal(200);
        done();
      });
  });

  it("Create user incomplet", function (done) {
    request
      .post('/api/users')
      .send({
        token: "jjfjjsj", // Obligatoire sinon ça plante...
        device_token: "fjkfjkfj" // Obligatoire sinon ça plante...
      })
      .end(function (err, res) {
        expect(res.statusCode).to.equal(400);
        expect(Object.keys(res.body).length).to.equal(4);
        done();
      });
  });

  it("Get all user", function (done) {
    request
      .get('/api/users')
      .end(function (err, res) {
        expect(res.statusCode).to.equal(200);
        expect(res.body.length).to.equal(2);
        done();
      });
  });

});
