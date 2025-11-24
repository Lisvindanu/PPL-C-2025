"use strict";

const express = require("express");
const router = express.Router();

const authMiddleware = require("../../../../shared/middleware/authMiddleware");
const adminMiddleware = require("../../../../shared/middleware/adminMiddleware");

const {
  createServiceValidator,
  updateServiceValidator,
  updateStatusValidator,
  listServicesQueryValidator,
  searchServicesQueryValidator,
  myServicesQueryValidator,
} = require("../../../../shared/middleware/serviceValidators");

const {
  taxonomyValidateCreate,
  taxonomyValidateUpdate,
} = require("../../../../shared/middleware/serviceTaxonomyGuard");

const serviceMediaUpload = require("../../infrastructure/upload/serviceMediaUpload");

// helper buat jaga-jaga handler undefined
function assertFn(fn, name) {
  if (typeof fn !== "function") {
    throw new Error(
      `[serviceRoutes] Missing or invalid middleware/handler: ${name}`
    );
  }
}

module.exports = (serviceController) => {
  assertFn(
    serviceController.getAllServices,
    "serviceController.getAllServices"
  );
  assertFn(
    serviceController.searchServices,
    "serviceController.searchServices"
  );
  assertFn(
    serviceController.getServiceById,
    "serviceController.getServiceById"
  );
  assertFn(
    serviceController.getServiceBySlug,
    "serviceController.getServiceBySlug"
  );
  assertFn(serviceController.getMyServices, "serviceController.getMyServices");
  assertFn(serviceController.createService, "serviceController.createService");
  assertFn(serviceController.updateService, "serviceController.updateService");
  assertFn(serviceController.deleteService, "serviceController.deleteService");
  assertFn(
    serviceController.updateServiceStatus,
    "serviceController.updateServiceStatus"
  );

  /**
   * @swagger
   * /api/services:
   *   get:
   *     tags: [Services]
   *     summary: List services (public, default hanya status aktif)
   *     parameters:
   *       - in: query
   *         name: kategori_id
   *         schema: { type: string, format: uuid }
   *       - in: query
   *         name: status
   *         schema: { type: string, enum: [draft, aktif, nonaktif] }
   *       - in: query
   *         name: harga_min
   *         description: Filter minimum harga (DECIMAL(12,2))
   *         schema: { type: string, pattern: '^\d{1,10}(\.\d{1,2})?$' }
   *       - in: query
   *         name: harga_max
   *         description: Filter maksimum harga (DECIMAL(12,2))
   *         schema: { type: string, pattern: '^\d{1,10}(\.\d{1,2})?$' }
   *       - in: query
   *         name: page
   *         schema: { type: integer, minimum: 1 }
   *       - in: query
   *         name: limit
   *         schema: { type: integer, minimum: 1, maximum: 100 }
   *       - in: query
   *         name: sortBy
   *         schema: { type: string, enum: [created_at, harga, rating_rata_rata, total_pesanan] }
   *       - in: query
   *         name: sortOrder
   *         schema: { type: string, enum: [ASC, DESC] }
   *     responses:
   *       200: { description: Success }
   */
  router.get("/", listServicesQueryValidator, serviceController.getAllServices);

  /**
   * @swagger
   * /api/services/search:
   *   get:
   *     tags: [Services]
   *     summary: Search services (public)
   *     parameters:
   *       - in: query
   *         name: q
   *         required: true
   *         schema: { type: string, minLength: 2 }
   *       - in: query
   *         name: kategori_id
   *         schema: { type: string, format: uuid }
   *       - in: query
   *         name: status
   *         schema: { type: string, enum: [draft, aktif, nonaktif] }
   *       - in: query
   *         name: harga_min
   *         description: Filter minimum harga (DECIMAL(12,2))
   *         schema: { type: string, pattern: '^\d{1,10}(\.\d{1,2})?$' }
   *       - in: query
   *         name: harga_max
   *         description: Filter maksimum harga (DECIMAL(12,2))
   *         schema: { type: string, pattern: '^\d{1,10}(\.\d{1,2})?$' }
   *       - in: query
   *         name: page
   *         schema: { type: integer, minimum: 1 }
   *       - in: query
   *         name: limit
   *         schema: { type: integer, minimum: 1, maximum: 100 }
   *       - in: query
   *         name: sortBy
   *         schema: { type: string, enum: [created_at, harga, rating_rata_rata, total_pesanan] }
   *       - in: query
   *         name: sortOrder
   *         schema: { type: string, enum: [ASC, DESC] }
   *     responses:
   *       200: { description: Success }
   *       400: { description: Bad request }
   */
  router.get(
    "/search",
    searchServicesQueryValidator,
    serviceController.searchServices
  );

  /**
   * @swagger
   * /api/services/my:
   *   get:
   *     tags: [Services]
   *     summary: List my services (freelancer, semua status)
   *     security: [{ bearerAuth: [] }]
   *     parameters:
   *       - in: query
   *         name: status
   *         schema: { type: string, enum: [draft, aktif, nonaktif] }
   *       - in: query
   *         name: page
   *         schema: { type: integer, minimum: 1 }
   *       - in: query
   *         name: limit
   *         schema: { type: integer, minimum: 1, maximum: 100 }
   *       - in: query
   *         name: sortBy
   *         schema: { type: string, enum: [created_at, harga, rating_rata_rata, total_pesanan, updated_at] }
   *       - in: query
   *         name: sortOrder
   *         schema: { type: string, enum: [ASC, DESC] }
   *     responses:
   *       200: { description: Success }
   *       403: { description: Forbidden }
   */
  router.get(
    "/my",
    authMiddleware,
    myServicesQueryValidator,
    serviceController.getMyServices
  );

  /**
   * @swagger
   * /api/services/slug/{slug}:
   *   get:
   *     tags: [Services]
   *     summary: Get service detail by slug (public, hanya aktif)
   *     parameters:
   *       - in: path
   *         name: slug
   *         required: true
   *         schema: { type: string }
   *     responses:
   *       200: { description: Success }
   *       404: { description: Not found }
   */
  router.get("/slug/:slug", serviceController.getServiceBySlug);

  /**
   * @swagger
   * /api/services/{id}:
   *   get:
   *     tags: [Services]
   *     summary: Get service detail by id (public, hanya aktif)
   *     parameters:
   *       - in: path
   *         name: id
   *         required: true
   *         schema: { type: string, format: uuid }
   *     responses:
   *       200: { description: Success }
   *       404: { description: Not found }
   */
  router.get("/:id", serviceController.getServiceById);

  /**
   * @swagger
   * /api/services:
   *   post:
   *     tags: [Services]
   *     summary: Create service (freelancer, status draft)
   *     security: [{ bearerAuth: [] }]
   *     requestBody:
   *       required: true
   *       content:
   *         multipart/form-data:
   *           schema:
   *             type: object
   *             required: [judul, deskripsi, kategori_id, harga, waktu_pengerjaan]
   *             properties:
   *               judul: { type: string, minLength: 5, maxLength: 255 }
   *               deskripsi: { type: string, minLength: 30 }
   *               kategori_id: { type: string, format: uuid }
   *               harga: { type: string, pattern: '^\d{1,10}(\.\d{1,2})?$', example: "149999.99" }
   *               waktu_pengerjaan: { type: integer, minimum: 1, description: 'dalam hari' }
   *               batas_revisi: { type: integer, minimum: 0, default: 1 }
   *               thumbnail: { type: string, format: binary }
   *               gambar: { type: array, items: { type: string, format: binary }, description: 'maks 5 file gambar' }
   *     responses:
   *       201: { description: Created (draft) }
   *       400: { description: Bad request }
   *       403: { description: Forbidden }
   */
  router.post(
    "/",
    authMiddleware,
    serviceMediaUpload,
    createServiceValidator,
    taxonomyValidateCreate,
    serviceController.createService
  );

  /**
   * @swagger
   * /api/services/{id}:
   *   put:
   *     tags: [Services]
   *     summary: Update service (freelancer, owner)
   *     security: [{ bearerAuth: [] }]
   *     parameters:
   *       - in: path
   *         name: id
   *         required: true
   *         schema: { type: string, format: uuid }
   *     requestBody:
   *       required: true
   *       content:
   *         multipart/form-data:
   *           schema:
   *             type: object
   *             properties:
   *               judul: { type: string, minLength: 5, maxLength: 255 }
   *               deskripsi: { type: string, minLength: 30 }
   *               kategori_id: { type: string, format: uuid }
   *               harga: { type: string, pattern: '^\d{1,10}(\.\d{1,2})?$' }
   *               waktu_pengerjaan: { type: integer, minimum: 1 }
   *               batas_revisi: { type: integer, minimum: 0 }
   *               thumbnail: { type: string, format: binary }
   *               gambar:
   *                 type: array
   *                 items: { type: string, format: binary }
   *                 description: 'maks 5 file gambar'
   *     responses:
   *       200: { description: Updated }
   *       403: { description: Forbidden }
   *       404: { description: Not found }
   */
  router.put(
    "/:id",
    authMiddleware,
    serviceMediaUpload,
    updateServiceValidator,
    taxonomyValidateUpdate,
    serviceController.updateService
  );

  /**
   * @swagger
   * /api/services/{id}:
   *   delete:
   *     tags: [Services]
   *     summary: Delete service (set nonaktif, freelancer owner)
   *     security: [{ bearerAuth: [] }]
   *     parameters:
   *       - in: path
   *         name: id
   *         required: true
   *         schema: { type: string, format: uuid }
   *     responses:
   *       200: { description: Deleted (nonaktif) }
   *       403: { description: Forbidden }
   *       404: { description: Not found }
   */
  router.delete("/:id", authMiddleware, serviceController.deleteService);

  /**
   * @swagger
   * /api/services/{id}/status:
   *   patch:
   *     tags: [Services]
   *     summary: Update service status (admin) → approve (aktif) / deactivate (nonaktif)
   *     security: [{ bearerAuth: [] }]
   *     parameters:
   *       - in: path
   *         name: id
   *         required: true
   *         schema: { type: string, format: uuid }
   *     requestBody:
   *       required: true
   *       content:
   *         application/json:
   *           schema:
   *             type: object
   *             required: [action]
   *             properties:
   *               action: { type: string, enum: [approve, deactivate] }
   *     responses:
   *       200: { description: Status updated }
   *       400: { description: Bad request }
   *       403: { description: Forbidden }
   *       404: { description: Not found }
   */
  router.patch(
    "/:id/status",
    authMiddleware,
    adminMiddleware,
    updateStatusValidator,
    serviceController.updateServiceStatus
  );

  return router;
};
