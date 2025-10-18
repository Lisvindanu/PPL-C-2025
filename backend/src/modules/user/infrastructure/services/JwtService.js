const jwt = require('jsonwebtoken');

class JwtService {
  generate(userId, role) {
    return jwt.sign({ userId, role }, process.env.JWT_SECRET || 'dev_secret', { expiresIn: '7d' });
  }

  verify(token) {
    return jwt.verify(token, process.env.JWT_SECRET || 'dev_secret');
  }
}

module.exports = JwtService;


