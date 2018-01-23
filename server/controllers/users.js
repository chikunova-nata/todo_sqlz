const User = require('../models').User;
const config = require('../config/config.json');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const salt = bcrypt.genSaltSync(50);

module.exports = {
    create(req, res) {
      if(!req.body.fullName || !req.body.email || !req.body.password) {
        return response.status(401).send("Invalid credentials.");
      } 

      //Match user
      User
      .findOne({ where: {email: req.query.email} })
      .then(user => {
        if (!user) {
          return User
          .create({
            fullName: req.body.fullName,
            email: req.body.email,
            password: bcrypt.hashSync(req.body.password, salt)
          })
          .then(user => {
            if (!user) return res.status(404).send('Registration failed.');
            
            const token = jwt.sign({ data: user.email }, config.secret, { expiresIn: '24h' });
            res.status(201).send({ token })
          }).catch(error => res.status(400).send(error));
        } else {
          res.status(201).send('User already exists.');
        }
        
      })
      .catch(error => res.status(400).send(error));
      
    },
    retrieve(req, res) {
      return User
      .findOne({ where: {email: req.query.email} })
      .then(user => {
        if (!user) return res.status(400).send({message: 'User Not Found'});
                 
        return res.status(200).send(user);
      })
      .catch(error => res.status(400).send(error));

    },
    authenticate(req, res) {
      const token = req.headers['x-access-token'];
      if (!token) return res.status(401).send({ message: 'An authorization header is required.' });
      
      jwt.verify(token, config.secret, function(err, decoded) {
        if (err) return res.status(401).send({ message: 'Invalid authorization token.' });   
        res.status(200).send({ expires: decoded.exp});
      });
    },
    login(req, res) {
      if(!req.query.email) {
        return response.status(400).send("User's email is required.");
      }

      // Match user
      return User
      .findOne({ where: {email: req.query.email} })
      .then(user => {
        if (!user) return res.status(400).send({message: 'User Not Found'});

        // Match password
        const hashedPassword = bcrypt.hashSync(req.query.password, salt); // hash with bcrypt
        const validPassword = bcrypt.compareSync(user.password, hashedPassword);//err, matched
        if(!validPassword) throw new Error('Password is invalid.')
          
        const token = jwt.sign({ data: user.email }, config.secret, { expiresIn: '24h' });
        return res.status(200).send({ token });
      })
      .catch(error => res.status(400).send(error));
    },
    logout(req, res) {
      res.status(200).send({ token: null });
    }
  };