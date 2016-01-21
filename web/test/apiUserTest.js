var expect = require("chai").expect;
var server = require("./serverMock"),
  supertest = require("supertest");


describe("Test Users API", function () {
  var request;

  before(function (done) {
    server.app(function(app) {
      request = supertest.agent(app);
      done();
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
        expect(res.statusCode).to.equal(406);
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

  after(function (done) {
    server.shutdown();
    done()
  })

});
