var expect = require("chai").expect,
 server = require("./serverMock"),
  supertest = require("supertest");


describe("Test Groupe API", function () {
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

  it("Create a groupe", function (done) {
    request
      .post('/api/groupes')
      .send({
        nom: "groupe1"
      })
      .end(function (err, res) {
        expect(res.statusCode).to.equal(200);
        done();
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

  it("Get users groupes", function (done) {
    request
      .get('/api/users/groupes')
      .end(function (err, res) {
        expect(res.statusCode).to.equal(200);
        expect(res.body.length).to.equal(2);
        expect(res.body[0]._id).to.equal("groupe2");
        expect(res.body[1]._id).to.equal("groupe1");
        done();
      });
  });

  var idGroupe;
  it("Get all groupes", function (done) {
    request
      .get('/api/groupes')
      .end(function (err, res) {
        expect(res.statusCode).to.equal(200);
        expect(res.body[0].nom).to.equal("groupe1");
        idGroupe = res.body[0]._id;
        done();
      });
  });

  it("Update a groupe", function (done) {
    request
      .post('/api/groupes/' + idGroupe)
      .send({
        nom: "groupe3"
      })
      .end(function (err, res) {
        expect(res.statusCode).to.equal(200);
        done();
      });
  });

  it("Should update users groupes", function (done) {
    request
      .get('/api/users/groupes')
      .end(function (err, res) {
        expect(res.statusCode).to.equal(200);
        expect(res.body.length).to.equal(2);
        expect(res.body[0]._id).to.equal("groupe3");
        expect(res.body[1]._id).to.equal("groupe2");
        done();
      });
  });

  it("Delete groupe", function (done) {
    request
      .delete('/api/groupes/' + idGroupe)
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
        expect(res.body.length).to.equal(0);
        done();
      });
  });

  it("Get users groupes", function (done) {
    request
      .get('/api/users/groupes')
      .end(function (err, res) {
        expect(res.statusCode).to.equal(200);
        expect(res.body.length).to.equal(1);
        done();
      });
  });

  after(function (done) {
    server.shutdown();
    done()
  })

});
