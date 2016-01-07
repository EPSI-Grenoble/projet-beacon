var expect = require("chai").expect;
var server = require("./serverMock").app,
  mockgoose = require('mockgoose'),
  supertest = require("supertest");


describe("Test Groupe API", function () {
  var request = supertest.agent(server);

  // Reset la base, crée un user puis authentification
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
    });
  });

  it("Create user with a groupe", function (done) {
    request
      .post('/api/users')
      .send({
        email: "group@testeur.com",
        password: "test",
        lastName: "Test",
        firstName: "App",
        groupes: ["groupe1", "groupe2"],
        token: "aaaaa", // Obligatoire sinon ça plante...
        device_token: "aaaaa" // Obligatoire sinon ça plante...
      })
      .end(function (err, res) {
        expect(res.statusCode).to.equal(200);
        done();
      });
  });

  it("Get all groupes", function (done) {
    request
      .get('/api/groupes')
      .end(function (err, res) {
        expect(res.statusCode).to.equal(200);
        expect(res.body.length).to.equal(2);
        expect(res.body[0]._id).to.equal("groupe2");
        done();
      });
  });

});