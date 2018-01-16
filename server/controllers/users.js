const User = require('../models').User;
const config = require('../config/config.json');
const jwt = require('jsonwebtoken');

module.exports = {
    create(req, res) {
      return User
      .create({
        fullName: req.body.fullName,
        email: req.body.email,
        password: req.body.password
      })
      .then(user => {
        if (!user) return res.status(400).send("There was a problem registering the user.");
        
        const token = jwt.sign({ data: user.email }, config.secret, { expiresIn: '24h' });
        res.status(201).send({ token })
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
      if (!token) return res.status(401).send({ message: 'No token provided.' });
      
      jwt.verify(token, config.secret, function(err, decoded) {
        if (err) return res.status(401).send({ message: 'Failed to authenticate token.' });   
        res.status(200).send({ expires: decoded.exp});
      });
    },
    login(req, res) {
      return User
      .findOne({ where: {email: req.query.email} })
      .then(user => {
        if (!user) return res.status(400).send({message: 'User Not Found'});
          
        const token = jwt.sign({ data: user.email }, config.secret, { expiresIn: '24h' });
        res.status(200).send({ token });
        return res.status(200).send(user);
      })
      .catch(error => res.status(400).send(error));
    },
    logout(req, res) {
      res.status(200).send({ token: null });
    }
  };