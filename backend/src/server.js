require("dotenv").config();
const express = require("express");
const cors = require("cors");
const helmet = require("helmet");
const morgan = require("morgan");
const swaggerUi = require("swagger-ui-express");
const swaggerSpec = require("./config/swagger");
const { connectDatabase } = require("./shared/database/connection");

const app = express();
const PORT = process.env.PORT || 5001;

// ==================== MIDDLEWARE ====================
// Helmet security headers - with custom CSP for mock-payment
app.use((req, res, next) => {
  if (req.path.startsWith("/mock-payment")) {
    // Relaxed CSP for mock payment page (allows inline scripts)
    helmet({
      contentSecurityPolicy: {
        directives: {
          defaultSrc: ["'self'"],
          scriptSrc: ["'self'", "'unsafe-inline'"],
          scriptSrcAttr: ["'unsafe-inline'"],
          styleSrc: ["'self'", "'unsafe-inline'"],
        },
      },
    })(req, res, next);
  } else {
    // Strict CSP for other routes
    helmet()(req, res, next);
  }
});

// CORS configuration - allow multiple origins
const allowedOrigins = [
  "http://localhost:3000",
  "https://ppl.vinmedia.my.id",
  process.env.FRONTEND_URL,
].filter(Boolean);

app.use(
  cors({
    origin: allowedOrigins,
    credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE", "PATCH", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
  })
);
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(morgan("dev")); // Logging

// Serve static files (mock payment gateway)
app.use("/mock-payment", express.static("public/mock-payment"));

// ==================== API DOCUMENTATION ====================
// Serve spec with cache busting
app.get("/api-docs.json", (req, res) => {
  res.setHeader(
    "Cache-Control",
    "no-store, no-cache, must-revalidate, proxy-revalidate"
  );
  res.setHeader("Pragma", "no-cache");
  res.setHeader("Expires", "0");
  res.json(swaggerSpec);
});

const swaggerOptions = {
  swaggerOptions: {
    url: `/api-docs.json?v=${Date.now()}`, // Cache busting with timestamp
    persistAuthorization: true,
  },
  customSiteTitle: "SkillConnect API Documentation",
};

// Disable caching for swagger endpoints
app.use(
  "/api-docs",
  (req, res, next) => {
    res.setHeader(
      "Cache-Control",
      "no-store, no-cache, must-revalidate, proxy-revalidate"
    );
    res.setHeader("Pragma", "no-cache");
    res.setHeader("Expires", "0");
    res.setHeader("Surrogate-Control", "no-store");
    next();
  },
  swaggerUi.serve,
  swaggerUi.setup(swaggerSpec, swaggerOptions)
);

// ==================== ROUTES ====================
// Health check
app.get("/", (req, res) => {
  res.json({
    message: "SkillConnect API is running",
    version: "1.0.0",
    timestamp: new Date().toISOString(),
  });
});

app.get("/health", async (req, res) => {
  const { sequelize } = require("./shared/database/connection");
  try {
    await sequelize.authenticate();
    res.json({
      status: "healthy",
      database: "connected",
      uptime: process.uptime(),
    });
  } catch (error) {
    res.status(500).json({
      status: "unhealthy",
      database: "disconnected",
      error: error.message,
    });
  }
});

// ==================== MODULE ROUTES ====================
// Import sequelize for dependencies
const { sequelize } = require("./shared/database/connection");

// expose ke app → dipakai taxonomy guard & middleware lain
app.set("sequelize", sequelize);

// Middleware
const authMiddleware = require("./shared/middleware/authMiddleware");
const adminMiddleware = require("./shared/middleware/adminMiddleware");

// ===== Modul 1: User Management =====
const userRoutes = require("./modules/user/presentation/routes/userRoutes");
app.use("/api/users", userRoutes);

// ===== Modul 1: Admin & Authentication =====
// Auth routes (public - untuk login)
const setupAuthDependencies = require("./modules/admin/config/authDependencies");
const { authController } = setupAuthDependencies(sequelize);
const authRoutes = require("./modules/admin/presentation/routes/authRoutes");
app.use("/api/auth", authRoutes(authController));

// Admin routes (protected)
const setupAdminDependencies = require("./modules/admin/config/adminDependencies");
const { adminController, adminLogController } =
  setupAdminDependencies(sequelize);
const adminRoutes = require("./modules/admin/presentation/routes/adminRoutes");
app.use(
  "/api/admin",
  authMiddleware,
  adminMiddleware,
  adminRoutes(adminController)
);

const adminLogRoutes = require("./modules/admin/presentation/routes/adminLogRoutes");
app.use(
  "/api/admin/logs",
  authMiddleware,
  adminMiddleware,
  adminLogRoutes(adminLogController)
);

// ===== Modul 2: Service Listing & Search =====
const setupServiceDependencies = require("./modules/service/config/serviceDependencies");
const { serviceController, kategoriController, subKategoriController } =
  setupServiceDependencies(sequelize);

const serviceRoutes = require("./modules/service/presentation/routes/serviceRoutes");
app.use("/api/services", serviceRoutes(serviceController));

const kategoriRoutes = require("./modules/service/presentation/routes/kategoriRoutes");
app.use("/api/kategori", kategoriRoutes(kategoriController));

const subKategoriRoutes = require("./modules/service/presentation/routes/subKategoriRoutes");
app.use("/api/sub-kategori", subKategoriRoutes(subKategoriController));

// ===== Modul 3: Order & Booking System =====
const setupOrderDependencies = require("./modules/order/config/orderDependencies");
const { orderController } = setupOrderDependencies(sequelize);
const orderRoutes = require("./modules/order/presentation/routes/orderRoutes");
app.use("/api/orders", orderRoutes(orderController));

// Modul 3: Bookmark (menggunakan storage favorites)
const BookmarkController = require("./modules/order/presentation/controllers/BookmarkController");
const bookmarkController = new BookmarkController();
const bookmarkRoutes = require("./modules/order/presentation/routes/bookmarkRoutes");
app.use("/api/bookmarks", bookmarkRoutes(bookmarkController));

// ===== Modul 4: Payment Gateway =====
const paymentRoutes = require("./modules/payment/presentation/routes/paymentRoutes");
app.use("/api/payments", paymentRoutes);

// ===== Modul 5: Review & Rating System (Dalam Pengembangan) =====
const ReviewController = require("./modules/review/presentation/controllers/ReviewController");
const reviewController = new ReviewController(sequelize);
const reviewRoutes = require("./modules/review/presentation/routes/reviewRoutes");
app.use("/api/reviews", reviewRoutes(reviewController));

// ===== Modul 6: Chat & Notification (Dalam Pengembangan) =====
const ChatController = require("./modules/chat/presentation/controllers/ChatController");
const chatController = new ChatController(sequelize);
const chatRoutes = require("./modules/chat/presentation/routes/chatRoutes");
app.use("/api/chat", chatRoutes(chatController));

// ===== Modul 7: DashboardAdmin) =====
const adminKategoriRoutes = require('./modules/admin/presentation/routes/adminKategoriRoutes');
app.use('/api/admin', adminKategoriRoutes);

// ===== Modul 8: Recommendation & Personalization (Dalam Pengembangan) =====
const RecommendationController = require("./modules/recommendation/presentation/controllers/RecommendationController");
const FavoriteController = require("./modules/recommendation/presentation/controllers/FavoriteController");
const recommendationController = new RecommendationController(sequelize);
const favoriteController = new FavoriteController(sequelize);
const recommendationRoutes = require("./modules/recommendation/presentation/routes/recommendationRoutes");
app.use(
  "/api/recommendations",
  recommendationRoutes(recommendationController, favoriteController)
);

// ==================== WEBHOOK PROXY ====================
// GitHub Webhook Proxy to WhatsApp Notifier
const axios = require("axios");

app.post("/webhook/github", async (req, res) => {
  try {
    // Forward the request to wa-notif service
    const response = await axios({
      method: "POST",
      url: "http://localhost:3002/webhook/github",
      data: req.body,
      headers: {
        "Content-Type": req.headers["content-type"] || "application/json",
        "X-GitHub-Event": req.headers["x-github-event"],
        "X-Hub-Signature-256": req.headers["x-hub-signature-256"],
        "X-GitHub-Delivery": req.headers["x-github-delivery"],
        "User-Agent": req.headers["user-agent"],
      },
    });

    res.status(response.status).json(response.data);
  } catch (error) {
    console.error(
      "[WEBHOOK PROXY] Error forwarding to wa-notif:",
      error.message
    );
    res.status(error.response?.status || 500).json({
      success: false,
      message: error.response?.data || error.message,
    });
  }
});

// Test notification endpoint proxy
app.post("/test/notification", async (req, res) => {
  try {
    const response = await axios({
      method: "POST",
      url: "http://localhost:3002/test/notification",
      data: req.body,
      headers: {
        "Content-Type": "application/json",
      },
    });

    res.status(response.status).json(response.data);
  } catch (error) {
    console.error("[TEST NOTIFICATION PROXY] Error:", error.message);
    res.status(error.response?.status || 500).json({
      success: false,
      message: error.response?.data || error.message,
    });
  }
});

// ==================== ERROR HANDLING ====================
// 404 Handler
app.use((req, res) => {
  res.status(404).json({
    success: false,
    message: "Endpoint not found",
  });
});

// Global Error Handler
app.use((err, req, res, next) => {
  console.error("Error:", err);

  res.status(err.statusCode || 500).json({
    success: false,
    message: err.message || "Internal server error",
    ...(process.env.NODE_ENV === "development" && { stack: err.stack }),
  });
});

// ==================== START SERVER ====================
connectDatabase()
  .then(() => {
    const server = app.listen(PORT, () => {
      console.log(`🚀 Server is running on http://localhost:${PORT}`);
      console.log(`📝 Environment: ${process.env.NODE_ENV || "development"}`);
      console.log(`📡 API Base URL: http://localhost:${PORT}/api`);
      console.log(`📚 API Documentation: http://localhost:${PORT}/api-docs`);
    });

    // Graceful shutdown
    process.on("SIGTERM", async () => {
      console.log("SIGTERM signal received: closing HTTP server");
      server.close(async () => {
        console.log("HTTP server closed");
        const { disconnectDatabase } = require("./shared/database/connection");
        await disconnectDatabase();
        process.exit(0);
      });
    });
  })
  .catch((error) => {
    console.error("Failed to start server:", error);
    process.exit(1);
  });

module.exports = app; // Export untuk testing
