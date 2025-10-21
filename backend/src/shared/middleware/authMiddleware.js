const JwtService = require('../../modules/user/infrastructure/services/JwtService');

const jwtService = new JwtService();

const authMiddleware = (req, res, next) => {
  try {
    const header = req.headers.authorization || req.headers.Authorization;
    const token = header && header.split(' ')[1];

    if (!token) {
      return res.status(401).json({ success: false, message: 'No token provided' });
    }

    const decoded = jwtService.verify(token);
    req.user = decoded; // { userId, role }

    next();
  } catch (error) {
    return res.status(401).json({ success: false, message: 'Invalid or expired token' });
  }
};

module.exports = authMiddleware;
