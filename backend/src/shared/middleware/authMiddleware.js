const JwtService = require("../../modules/user/infrastructure/services/JwtService");

const jwtService = new JwtService();

/**
 * Auth middleware
 * - Ambil token dari header Authorization: Bearer <token>
 * - Verifikasi JWT
 * - Normalisasi req.user supaya selalu punya: { id, userId, role, email? }
 */
const authMiddleware = (req, res, next) => {
  try {
    const header = req.headers.authorization || req.headers.Authorization || ""; // antisipasi casing

    // Format: "Bearer <token>"
    const [scheme, rawToken] = String(header).split(" ");
    const token =
      scheme?.toLowerCase() === "bearer" ? rawToken : scheme || rawToken;

    if (!token) {
      return res
        .status(401)
        .json({ success: false, message: "No token provided" });
    }

    const decoded = jwtService.verify(token);
    // decoded bisa bermacam bentuk tergantung issuer:
    // contoh umum:
    // { userId, role, email, iat, exp }
    // { id, role, iat, exp }
    // { sub, data: { role } }
    // => normalisasi supaya downstream aman

    const id =
      decoded.id ||
      decoded.userId ||
      decoded.sub ||
      decoded.uid ||
      decoded.user_id ||
      null;

    const role =
      decoded.role || decoded?.data?.role || decoded?.claims?.role || null;

    const email =
      decoded.email || decoded?.data?.email || decoded?.claims?.email || null;

    // Tetapkan user object yang konsisten
    req.user = {
      id, // dipakai banyak controller: req.user?.id
      userId: id, // sebagian code pakai userId
      role: role || undefined,
      email: email || undefined,
      // simpan juga payload asli kalau butuh debug:
      _raw: decoded,
    };

    // Validasi minimal: harus punya id
    if (!req.user.id) {
      return res
        .status(401)
        .json({
          success: false,
          message: "Invalid token payload (missing user id)",
        });
    }

    next();
  } catch (error) {
    return res
      .status(401)
      .json({ success: false, message: "Invalid or expired token" });
  }
};

module.exports = authMiddleware;
