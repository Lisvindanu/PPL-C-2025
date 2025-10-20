// ================================
// middleware/adminMiddleware.js
// ================================
const adminMiddleware = (req, res, next) => {
  try {
    // Pastikan sudah melalui authMiddleware
    if (!req.user) {
      return res.status(401).json({
        success: false,
        error: 'Not authenticated'
      });
    }

    // Cek apakah role = 'admin'
    if (req.user.role !== 'admin') {
      return res.status(403).json({
        success: false,
        error: 'Forbidden: Only admin can access this endpoint'
      });
    }

    next();
  } catch (error) {
    console.error('Admin Auth Error:', error.message);
    return res.status(403).json({
      success: false,
      error: 'Authorization failed'
    });
  }
};

module.exports = adminMiddleware;