var expect = require("chai").expect;
var app = require('http'),
  server = require("./serverMock"),
  supertest = require("supertest"),
  request = supertest.agent(server);


describe("Test controllers", function(){

  it("GET / (Not log-in)", function(done){
    request
      .get('/')
      .expect(302, done);
  });

  it("POST /login (Log-in)", function(done){
    request
      .post('/login')
      .send({
        'user' : 'martin.choraine@epsi.fr',
        'password' : 'martin'
      })
      .expect(302, done);
  });

  it("GET /messages", function(done){
    request
      .get('/messages')
      .expect(200, done)
  });

  it("GET /users", function(done){
    request
      .get('/users')
      .expect(200, done);
  });

  it("GET /users/edit", function(done){
    request
      .get('/users/edit')
      .expect(200, done);
  });

  it("GET /users/edit/:idUser", function(done){
    request
      .get('/users/edit/123')
      .expect(200, done);
  });

  it("GET /groupes", function(done){
    request
      .get('/groupes')
      .expect(200, done);
  });

  it("GET /beacons", function(done){
    request
      .get('/beacons')
      .expect(200, done);
  });

});
