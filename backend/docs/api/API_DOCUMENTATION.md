# SkillConnect API Documentation

## 📚 Auto-Generated API Documentation (Swagger/OpenAPI)

API documentation untuk backend SkillConnect telah dibuat menggunakan **Swagger/OpenAPI**, mirip dengan Laravel Scramble. Documentation ini secara otomatis di-generate dari kode dan JSDoc annotations.

## 🚀 Cara Mengakses API Documentation

### 1. Jalankan Server Development

```bash
cd backend
npm start
# atau
npm run dev
```

### 2. Akses Swagger UI

Buka browser dan navigasi ke:

**Development:**
```
http://localhost:5000/api-docs
```

**Production:**
```
https://ppl.vinmedia.my.id/api-docs
```

### 3. Export OpenAPI JSON

Jika ingin mendapatkan raw OpenAPI specification dalam format JSON:

```
http://localhost:5000/api-docs.json
```

## 📖 Fitur Documentation

### ✅ Interactive API Testing
- **Try it out**: Test API endpoints langsung dari browser
- **Authentication**: Support untuk JWT Bearer token
- **Request Examples**: Contoh request body dan parameters
- **Response Examples**: Contoh response untuk setiap status code

### ✅ Organized by Tags
Documentation dikelompokkan berdasarkan modul:
- **Health**: System health check endpoints
- **Authentication**: Login dan auth endpoints
- **Users**: User management (register, login, profile, dll)
- **Admin**: Admin panel endpoints (analytics, user management, reports)
- **Payments**: Payment processing
- **Escrow**: Escrow management
- **Withdrawals**: Withdrawal requests

### ✅ Detailed Schemas
- Request body schemas dengan validasi
- Response schemas untuk semua status codes
- Reusable components dan schemas

## 🔐 Testing dengan Authentication

Untuk endpoint yang memerlukan authentication:

1. **Login** melalui `/api/users/login` atau `/api/auth/login` (untuk admin)
2. Copy JWT token dari response
3. Klik tombol **"Authorize"** di pojok kanan atas Swagger UI
4. Paste token dengan format: `Bearer <your-token>`
5. Klik **"Authorize"** dan **"Close"**
6. Sekarang semua request akan include Authorization header

## 📝 Available Endpoints

### Health Check
- `GET /` - API root
- `GET /health` - Health check

### Users
- `POST /api/users/register` - Register user baru
- `POST /api/users/login` - Login user
- `GET /api/users/profile` - Get user profile (Auth required)
- `PUT /api/users/profile` - Update profile (Auth required)
- `POST /api/users/forgot-password` - Request password reset
- `POST /api/users/reset-password` - Reset password dengan token
- `POST /api/users/logout` - Logout user (Auth required)
- `PUT /api/users/role` - Change user role (Auth required)

### Authentication (Admin)
- `POST /api/auth/login` - Admin login

### Admin Panel
- `GET /api/admin/dashboard` - Dashboard statistics
- `GET /api/admin/users` - Get all users
- `PUT /api/admin/users/:id/block` - Block user
- `PUT /api/admin/users/:id/unblock` - Unblock user
- `GET /api/admin/analytics/users` - User analytics
- `GET /api/admin/analytics/users/status` - User status distribution
- `GET /api/admin/analytics/orders/trends` - Order trends
- `GET /api/admin/analytics/revenue` - Revenue analytics
- `GET /api/admin/analytics/orders` - Order analytics
- `GET /api/admin/services` - Get all services
- `PUT /api/admin/services/:id/block` - Block service
- `PUT /api/admin/services/:id/unblock` - Unblock service
- `DELETE /api/admin/reviews/:id` - Delete review
- `POST /api/admin/reports/export` - Export reports (CSV/Excel/PDF)
- `GET /api/admin/fraud-alerts` - Get fraud alerts
- `GET /api/admin/logs` - Get activity logs
- `GET /api/admin/logs/:id` - Get log detail
- `GET /api/admin/logs/admin/:adminId` - Get logs by admin

### Payments
- `POST /api/payments/create` - Create payment
- `POST /api/payments/webhook` - Payment gateway webhook
- `GET /api/payments/:id` - Get payment by ID
- `GET /api/payments/order/:orderId` - Get payment by order ID

### Escrow
- `POST /api/payments/escrow/release` - Release escrow funds
- `GET /api/payments/escrow/:id` - Get escrow by ID

### Withdrawals
- `POST /api/payments/withdraw` - Create withdrawal request
- `GET /api/payments/withdrawals/:id` - Get withdrawal by ID

### Mock Endpoints (Development Only)
- `POST /api/payments/mock/trigger-success` - Trigger payment success
- `POST /api/payments/mock/trigger-failure` - Trigger payment failure

## 🛠️ Development

### Menambahkan Endpoint Baru

Untuk menambahkan documentation ke endpoint baru:

1. Tambahkan JSDoc comment di atas route definition:

```javascript
/**
 * @swagger
 * /api/example:
 *   get:
 *     tags: [Example]
 *     summary: Short description
 *     description: Detailed description
 *     security:
 *       - bearerAuth: []  # Jika perlu auth
 *     parameters:
 *       - in: query
 *         name: param1
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Success response
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 */
router.get('/example', controller.example);
```

2. Restart server untuk melihat perubahan

### Update Schemas

Edit file `backend/src/config/swagger.js` untuk:
- Menambahkan schemas baru
- Update existing schemas
- Menambahkan tags baru
- Konfigurasi global lainnya

## 📦 Dependencies

- `swagger-jsdoc`: Generate OpenAPI spec from JSDoc comments
- `swagger-ui-express`: Serve Swagger UI

## 🎨 Customization

Swagger UI sudah dikustomisasi dengan:
- Hide topbar default
- Custom site title: "SkillConnect API Documentation"
- Support JWT Bearer authentication

## 📱 Import ke Postman/Insomnia

1. Download OpenAPI JSON dari `/api-docs.json`
2. Import ke Postman: File → Import → Upload file
3. Import ke Insomnia: Application → Preferences → Data → Import Data

## 🔗 Resources

- [OpenAPI Specification](https://swagger.io/specification/)
- [Swagger UI Documentation](https://swagger.io/tools/swagger-ui/)
- [swagger-jsdoc NPM](https://www.npmjs.com/package/swagger-jsdoc)

---

**Generated with Swagger/OpenAPI** - Auto-updated API Documentation 🚀
