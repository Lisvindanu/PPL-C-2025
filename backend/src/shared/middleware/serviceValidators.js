"use strict";

const { body, param, query, validationResult } = require("express-validator");

function handleValidation(req, res, next) {
  const result = validationResult(req);
  if (!result.isEmpty()) {
    const errors = result.array();
    // Format error message yang lebih user-friendly
    const message = errors
      .map((e) => {
        const field = e.param || e.path || 'Field';
        const msg = e.msg || 'Invalid value';
        return `${field}: ${msg}`;
      })
      .join(", ");
    const err = new Error(message);
    err.statusCode = 400;
    return next(err);
  }
  return next();
}

// DECIMAL diserialisasi sebagai string (aman untuk presisi)
const DECIMAL_PATTERN = /^\d{1,10}(\.\d{1,2})?$/;

const createServiceValidator = [
  body("judul")
    .isString()
    .withMessage("Judul harus berupa teks")
    .isLength({ min: 5, max: 255 })
    .withMessage("Judul harus antara 5-255 karakter"),

  body("deskripsi")
    .isString()
    .withMessage("Deskripsi harus berupa teks")
    .isLength({ min: 30 })
    .withMessage("Deskripsi minimal 30 karakter"),

  body("kategori_id")
    .isString()
    .withMessage("Kategori harus dipilih")
    .notEmpty()
    .withMessage("Kategori tidak boleh kosong"),

  body("harga")
    .matches(DECIMAL_PATTERN)
    .withMessage("Harga harus berupa angka (contoh: 100000 atau 100000.50). Maksimal 10 digit sebelum koma dan 2 digit setelah koma"),

  body("waktu_pengerjaan")
    .isInt({ min: 1 })
    .withMessage("Waktu pengerjaan harus berupa angka minimal 1 hari"),

  body("batas_revisi")
    .optional({ nullable: true })
    .isInt({ min: 0 })
    .withMessage("Batas revisi harus berupa angka minimal 0"),

  body("thumbnail")
    .optional({ nullable: true })
    .isString()
    .withMessage("Thumbnail harus berupa string"),

  body("gambar")
    .optional({ nullable: true })
    .isArray()
    .withMessage("Gambar harus berupa array"),

  body("gambar.*")
    .optional()
    .isString()
    .withMessage("Setiap gambar harus berupa string"),

  handleValidation,
];

const updateServiceValidator = [
  param("id")
    .notEmpty()
    .withMessage("ID layanan tidak boleh kosong"),

  body("judul")
    .optional()
    .isString()
    .withMessage("Judul harus berupa teks")
    .isLength({ min: 5, max: 255 })
    .withMessage("Judul harus antara 5-255 karakter"),

  body("deskripsi")
    .optional()
    .isString()
    .withMessage("Deskripsi harus berupa teks")
    .isLength({ min: 30 })
    .withMessage("Deskripsi minimal 30 karakter"),

  body("kategori_id")
    .optional()
    .isString()
    .withMessage("Kategori harus berupa string")
    .notEmpty()
    .withMessage("Kategori tidak boleh kosong"),

  body("harga")
    .optional()
    .matches(DECIMAL_PATTERN)
    .withMessage("Harga harus berupa angka (contoh: 100000 atau 100000.50)"),

  body("waktu_pengerjaan")
    .optional()
    .isInt({ min: 1 })
    .withMessage("Waktu pengerjaan harus berupa angka minimal 1 hari"),

  body("batas_revisi")
    .optional({ nullable: true })
    .isInt({ min: 0 })
    .withMessage("Batas revisi harus berupa angka minimal 0"),

  body("thumbnail")
    .optional({ nullable: true })
    .isString()
    .withMessage("Thumbnail harus berupa string"),

  body("gambar")
    .optional({ nullable: true })
    .custom((value) => {
      if (Array.isArray(value)) return true;
      if (typeof value === "string") return true;
      return false;
    })
    .withMessage("Gambar harus berupa array atau string"),

  body("gambar.*")
    .optional()
    .isString()
    .withMessage("Setiap gambar harus berupa string"),

  handleValidation,
];

const updateStatusValidator = [
  param("id")
    .notEmpty()
    .withMessage("ID layanan tidak boleh kosong"),

  body("action")
    .isIn(["approve", "deactivate"])
    .withMessage("Action harus 'approve' atau 'deactivate'"),

  handleValidation,
];

const listServicesQueryValidator = [
  query("kategori_id")
    .optional()
    .isString()
    .withMessage("kategori_id harus berupa string"),

  query("status")
    .optional()
    .isIn(["draft", "aktif", "nonaktif"])
    .withMessage("Status harus 'draft', 'aktif', atau 'nonaktif'"),

  query("harga_min")
    .optional()
    .matches(DECIMAL_PATTERN)
    .withMessage("harga_min harus berupa angka valid"),

  query("harga_max")
    .optional()
    .matches(DECIMAL_PATTERN)
    .withMessage("harga_max harus berupa angka valid"),

  query("page")
    .optional()
    .isInt({ min: 1 })
    .withMessage("page harus berupa angka minimal 1"),

  query("limit")
    .optional()
    .isInt({ min: 1, max: 100 })
    .withMessage("limit harus berupa angka antara 1-100"),

  query("sortBy")
    .optional()
    .isIn(["created_at", "harga", "rating_rata_rata", "total_pesanan"])
    .withMessage("sortBy tidak valid"),

  query("sortDir")
    .optional()
    .isIn(["asc", "desc"])
    .withMessage("sortDir harus 'asc' atau 'desc'"),

  handleValidation,
];

const searchServicesQueryValidator = [
  query("q")
    .isString()
    .withMessage("Query pencarian harus berupa teks")
    .isLength({ min: 2 })
    .withMessage("Query pencarian minimal 2 karakter"),

  query("kategori_id")
    .optional()
    .isString()
    .withMessage("kategori_id harus berupa string"),

  query("status")
    .optional()
    .isIn(["draft", "aktif", "nonaktif"])
    .withMessage("Status harus 'draft', 'aktif', atau 'nonaktif'"),

  query("harga_min")
    .optional()
    .matches(DECIMAL_PATTERN)
    .withMessage("harga_min harus berupa angka valid"),

  query("harga_max")
    .optional()
    .matches(DECIMAL_PATTERN)
    .withMessage("harga_max harus berupa angka valid"),

  query("page")
    .optional()
    .isInt({ min: 1 })
    .withMessage("page harus berupa angka minimal 1"),

  query("limit")
    .optional()
    .isInt({ min: 1, max: 100 })
    .withMessage("limit harus berupa angka antara 1-100"),

  query("sortBy")
    .optional()
    .isIn(["created_at", "harga", "rating_rata_rata", "total_pesanan"])
    .withMessage("sortBy tidak valid"),

  query("sortDir")
    .optional()
    .isIn(["asc", "desc"])
    .withMessage("sortDir harus 'asc' atau 'desc'"),

  handleValidation,
];

const myServicesQueryValidator = [
  query("status")
    .optional()
    .isIn(["draft", "aktif", "nonaktif"])
    .withMessage("Status harus 'draft', 'aktif', atau 'nonaktif'"),

  query("page")
    .optional()
    .isInt({ min: 1 })
    .withMessage("page harus berupa angka minimal 1"),

  query("limit")
    .optional()
    .isInt({ min: 1, max: 100 })
    .withMessage("limit harus berupa angka antara 1-100"),

  query("sortBy")
    .optional()
    .isIn([
      "created_at",
      "harga",
      "rating_rata_rata",
      "total_pesanan",
      "updated_at",
    ])
    .withMessage("sortBy tidak valid"),

  query("sortDir")
    .optional()
    .isIn(["asc", "desc"])
    .withMessage("sortDir harus 'asc' atau 'desc'"),

  handleValidation,
];

module.exports = {
  createServiceValidator,
  updateServiceValidator,
  updateStatusValidator,
  listServicesQueryValidator,
  searchServicesQueryValidator,
  myServicesQueryValidator,
  handleValidation,
};
