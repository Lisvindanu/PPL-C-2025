const swaggerJsdoc = require('swagger-jsdoc');

const options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'SkillConnect API Documentation',
      version: '1.0.0',
      description: 'Marketplace Jasa dan Skill Lokal - Auto-generated API Documentation',
      contact: {
        name: 'SkillConnect Team',
        email: 'support@skillconnect.com',
      },
    },
    servers: [
      {
        url: 'http://localhost:5000',
        description: 'Development Server',
      },
      {
        url: 'https://api-ppl.vinmedia.my.id',
        description: 'Production Server',
      },
    },
    components: {
      securitySchemes: {
        bearerAuth: {
          type: 'http',
          scheme: 'bearer',
          bearerFormat: 'JWT',
        },
      },
    },
    tags: [
      {
        name: 'Health',
        description: '🏥 System Core - Health check dan monitoring',
      },
      {
        name: 'Users',
        description: '👥 Modul 1: User Management - Registrasi, login, profil pengguna, role management',
      },
      {
        name: 'Services',
        description: '🛠️ Modul 2: Service Listing & Search - CRUD layanan, pencarian & filter 🚧 (Dalam Pengembangan)',
      },
      {
        name: 'Orders',
        description: '📦 Modul 3: Order & Booking System - Buat order, tracking status 🚧 (Dalam Pengembangan)',
      },
      {
        name: 'Payments',
        description: '💳 Modul 4: Payment Gateway - Pembayaran digital, escrow, withdrawal',
      },
      {
        name: 'Reviews',
        description: '⭐ Modul 5: Review & Rating System - Rating dan review layanan 🚧 (Dalam Pengembangan)',
      },
      {
        name: 'Chat',
        description: '💬 Modul 6: Chat & Notification - Real-time chat dan notifikasi 🚧 (Dalam Pengembangan)',
      },
      {
        name: 'Admin',
        description: '⚙️ Modul 7: Admin Dashboard & Analytics - Dashboard, analytics, reports',
      },
      {
        name: 'Recommendations',
        description: '🎯 Modul 8: Recommendation & Personalization - Personalized recommendations 🚧 (Dalam Pengembangan)',
      },
    ],
  },
  apis: ['./src/modules/*/presentation/routes/*.js', './src/server.js'],
};

module.exports = swaggerJsdoc(options);
