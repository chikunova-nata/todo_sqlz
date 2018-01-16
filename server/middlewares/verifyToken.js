const config = require('../config/config.json');
const jwt = require('jsonwebtoken');

function verifyToken(req, res, next) {
    const token = req.headers['x-access-token'];
    if (!token) return res.status(403).send({ message: 'No token provided.' });

    jwt.verify(token, config.secret, function(err, decoded) {
      if (err) return res.status(403).send({ message: 'Failed to authenticate token.' });
      next();
    });
  }
  module.exports = verifyToken;