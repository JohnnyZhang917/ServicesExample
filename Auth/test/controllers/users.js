require('../helper')
var request = require('supertest')
var Model = require('../../lib/models/user')
var app

describe('Users Controller', function() {

  beforeEach(function() {
    app = setupApp()
  })
  beforeEach(rebuildDb)
  beforeEach(function(done) {
    seedUsers({}, done)
  })


  it('GET /api/v1/users - returns all users', function(done) {
    request(app)
      .get('/api/v1/users')
      .expect('Content-Type', /json/)
      .expect(200)
      .end(function(err, res) {
        assert(!err)
        assert(res.body.users)
        assert(res.body.users[0].email)
        assert(res.body.users[0].first_name)
        assert(res.body.users[0].last_name)
        assert(res.body.users[0].auth_token)
        done()
      })
  })

  it('GET /users/:id - returns a single user', function(done) {
    request(app)
      .get('/api/v1/users/1')
      .expect('Content-Type', /json/)
      .expect(200)
      .end(function(err, res) {
        assert(!err)
        assert(res.body.user)
        assert(res.body.user.email)
        assert(res.body.user.first_name)
        assert(res.body.user.last_name)
        assert(res.body.user.auth_token)
        done()
      })
  })

  it('PATCH /users/:id - updates a user', function(done) {
    request(app)
      .patch('/api/v1/users/1')
      .send({first_name: 'PUT', email: 'PUT@test.com'})
      .expect('Content-Type', /json/)
      .expect(200)
      .end(function(err, res) {
        assert(!err)
        Model.find(1, function(err, user) {
          assert(user.first_name === 'PUT')
          assert(user.email === 'PUT@test.com')
          done()
        })
      })
  })

  it('DEL /api/v1/users/:id - deletes a user', function(done) {
    request(app)
      .delete('/api/v1/users/1')
      .expect('Content-Type', /json/)
      .expect(200)
      .end(function(err, res) {
        assert(!err)
        assert(!res.body.user)
        Model.find(1, function(err, user) {
          assert(!err)
          assert(!user)
          done()
        })
      })
  })

  it('POST /api/v1/users - creates users', function(done) {
    var attributes = {email: 'test@ted.com', first_name: 'ted', last_name: 'ted', password: 'ted123', password_confirmation: 'ted123'}
    request(app)
      .post('/api/v1/users')
      .send(attributes)
      .expect('Content-Type', /json/)
      .expect(200)
      .end(function(err, res) {
        assert(!err)
        assert(res.body.user.email === 'test@ted.com')
        assert(res.body.user.first_name === 'ted')
        assert(res.body.user.last_name === 'ted')
        done()
      })
  })

  it('POST /api/v1/users/authenticate - authenticates a user', function(done) {
    request(app)
      .post('/api/v1/users/authenticate')
      .send({email: 'test@test.com', password: 'ted123'})
      .expect('Content-Type', /json/)
      .expect(200)
      .end(function(err, res) {
        assert(!err)
        assert(res.body.user.email)
        assert(res.body.user.first_name)
        assert(res.body.user.last_name)
        assert(res.body.user.auth_token)
        done()
      })
  })

  it('GET /api/v1/users/authenticate/:token - authenticates with a token', function(done) {
    request(app)
      .get('/api/v1/users/authenticate/xxxxxx')
      .expect('Content-Type', /json/)
      .expect(200)
      .end(function(err, res) {
        assert(!err)
        assert(res.body.authenticated)
        done()
      })
  })

  it('DEL /api/v1/users/authenticate/:token - logs out the user', function(done) {
    request(app)
      .del('/api/v1/users/authenticate/xxxxxx')
      .expect('Content-Type', /json/)
      .expect(200)
      .end(function(err, res) {
        assert(!err)
        assert(res.body.logged_out)
        done()
      })
  })

})