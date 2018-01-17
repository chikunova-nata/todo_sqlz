process.env.NODE_ENV = 'test';
const API_BASE = '127.0.0.1:8000';
const userModel = require('../models').User;
const faker = require('faker');
const app = require('../../app');
const chai = require('chai');
const chaiHttp = require('chai-http');
const should = chai.should();
chai.use(chaiHttp);

describe('Account', function() {

    const fakeUser = {
        fullName: faker.name.findName(),
        email: faker.internet.email(),
        password: faker.internet.password()
    }
    const fakeEmail = 'nata5@gmail.com';
    const fakeToken = 'bGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJkYXRhIjoibmF0YTVAZ21haWwuY29tIiwiaWF0IjoxNTE2MTM3NTYwLCJleHAiOjE1MTYyMjM5NjB9.zQtBKPtiQV7wBeWXPRXq_ZmouTB-rM1-GBwx7p6jenQ';

    it('should retrieve the token', () => {
        chai.request(app)
        .get('/auth/login')
        .query({email: fakeEmail})
        .end((err, res) => {
            res.should.have.status(200);
            res.body.should.be.a('object');
            res.body.should.have.property('token').not.be('undefined');
        });
    });
    
    it('should save new user account', () => {
        chai.request(app)
        .post('/auth/register')
        .send(fakeUser)
        .end((err, res) => {
            res.status.should.equal(201);
            res.type.should.equal('application/json');
            res.body.should.have.property('token').not.be('undefined');
            }
        )
    });
    
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

    

});