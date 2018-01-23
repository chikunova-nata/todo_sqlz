process.env.NODE_ENV = 'test';
const API_BASE = '127.0.0.1:8000';
const userModel = require('../models').User;
const faker = require('faker');
const app = require('../../app');
const sinon = require('sinon');
const chai = require('chai');
const chaiHttp = require('chai-http');
const should = chai.should();
const expect = chai.expect;
chai.use(chaiHttp);
const jwt = require('jsonwebtoken');

describe('App tests', () => {
    let server;
    const fakeUser = {
        fullName: faker.name.findName(),
        email: faker.internet.email(),
        password: faker.internet.password()
    };
    const sandbox = sinon.sandbox.create();

    before(done => {
        server = app.listen('8000');
        server.once('listening', () => done());

        sandbox.stub(jwt, 'verify').callsArgWith(2, null, {});
      });

    describe('Account', () => {
        it.only('Returns a 200 response if token is valid', () => {
            return chai.request(app)
                .get('/api/authenticate')
                .set('x-access-token', 'anything') 
                .send(fakeUser)
                .then(response => {
                    expect(response).to.have.status(200);
                })
        });

        it('Creates a user document in our DB', () => {
            return chai.request(app)
                .post('/auth/register')
                .send(fakeUser)
                .then(() => {
                    return userModel.findOne({ where: {email: fakeUser.email} });
                })
                .then(response => {        
                    const user = response.dataValues;
                    expect(user.fullName).to.be.equal(fakeUser.fullName);
                    expect(user.email).to.be.equal(fakeUser.email);
                })
        });

        describe('Create User', () => {
            it('Returns a 201 response', () => {
                return chai.request(app)
                    .post('/auth/register')
                    .send({
                        fullName: faker.name.findName(),
                        email: faker.internet.email(),
                        password: faker.internet.password()
                    })
                    .then(response => {
                        expect(response).to.have.status(201);
                    })
            });
        });
    });

    describe('Test API Route', () => {
        it('Returns a 200 response', (done) => {
            chai.request(app)
                .get('/api')
                .end((error, response) => {
                    if (error) done(error);
                    // Now let's check our response
                    expect(response).to.have.status(200);
                    expect(response.body).to.be.deep.equal({
                        message: 'Welcome to the Todos API!'
                    });
                    done();
                });
        });
    });

    /*
    it('should correctly update an existing account by the given id', () => {
    });

    it('should retrieve existing account when token is valid', () => {
        chai.request(app)
        .get('/api/profile')
        .query({email: fakeEmail})
        .set('x-access-token', fakeToken)
        .end((err, res) => {
            res.should.have.status(200);
            res.body.should.be.a('object');
            res.body.should.have.property('fullName').not.be('undefined');
            res.body.should.have.property('email').not.be('undefined');
        });
    });

    it('should return error when trying to save duplicate email', () => {
    });

    it('should return error when trying to save account without name', () => {
    });

    it('should return 403 error for non authorized user', () => {
        chai.request(app)
        .get('/api/profile')
        .query({email: fakeEmail})
        .end((err, res) => {
            err.should.have.status(403);
            err.body.should.be.a('object');
            err.body.should.have.property('message').eq('Failed to authenticate token.');
        });
    });

    it('should return 401 for protected routes when token is invalid', () => {
        chai.request(app)
        .get('/api/todos')
        .end((err, res) => {
            err.should.have.status(401);
            err.body.should.be.a('object');
            err.body.should.have.property('message').eq('Failed to authenticate token.');
        });
    });
    */

    after(done => {
        server.close(done);
        sandbox.restore();
    });
});