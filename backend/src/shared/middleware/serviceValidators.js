"use strict";

const { body, param, query, validationResult } = require("express-validator");

function handleValidation(req, res, next) {
  const result = validationResult(req);
  if (!result.isEmpty()) {
    const message = result
      .array()
      .map((e) => `${e.param}: ${e.msg}`)
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
  body("judul").isString().isLength({ min: 5, max: 255 }),
  body("deskripsi").isString().isLength({ min: 30 }),
  body("kategori_id").isString().notEmpty(),
  body("harga")
    .matches(DECIMAL_PATTERN)
    .withMessage("format DECIMAL(12,2) sebagai string"),
  body("waktu_pengerjaan").isInt({ min: 1 }),
  body("batas_revisi").optional({ nullable: true }).isInt({ min: 0 }),
  body("thumbnail").optional({ nullable: true }).isString(),
  body("gambar").optional({ nullable: true }).isArray(),
  body("gambar.*").optional().isString(),
  handleValidation,
];

const updateServiceValidator = [
  param("id").notEmpty(),
  body("judul").optional().isString().isLength({ min: 5, max: 255 }),
  body("deskripsi").optional().isString().isLength({ min: 30 }),
  body("kategori_id").optional().isString().notEmpty(),
  body("harga").optional().matches(DECIMAL_PATTERN),
  body("waktu_pengerjaan").optional().isInt({ min: 1 }),
  body("batas_revisi").optional({ nullable: true }).isInt({ min: 0 }),
  body("thumbnail").optional({ nullable: true }).isString(),
  body("gambar").optional({ nullable: true }).isArray(),
  body("gambar.*").optional().isString(),
  handleValidation,
];

const updateStatusValidator = [
  param("id").notEmpty(),
  body("action").isIn(["approve", "deactivate"]),
  handleValidation,
];

const listServicesQueryValidator = [
  query("kategori_id").optional().isString(),
  query("status").optional().isIn(["draft", "aktif", "nonaktif"]),
  query("harga_min").optional().matches(DECIMAL_PATTERN),
  query("harga_max").optional().matches(DECIMAL_PATTERN),
  query("page").optional().isInt({ min: 1 }),
  query("limit").optional().isInt({ min: 1, max: 100 }),
  query("sortBy")
    .optional()
    .isIn(["created_at", "harga", "rating_rata_rata", "total_pesanan"]),
  query("sortDir").optional().isIn(["asc", "desc"]),
  handleValidation,
];

const searchServicesQueryValidator = [
  query("q").isString().isLength({ min: 2 }),
  query("kategori_id").optional().isString(),
  query("status").optional().isIn(["draft", "aktif", "nonaktif"]),
  query("harga_min").optional().matches(DECIMAL_PATTERN),
  query("harga_max").optional().matches(DECIMAL_PATTERN),
  query("page").optional().isInt({ min: 1 }),
  query("limit").optional().isInt({ min: 1, max: 100 }),
  query("sortBy")
    .optional()
    .isIn(["created_at", "harga", "rating_rata_rata", "total_pesanan"]),
  query("sortDir").optional().isIn(["asc", "desc"]),
  handleValidation,
];

const myServicesQueryValidator = [
  query("status").optional().isIn(["draft", "aktif", "nonaktif"]),
  query("page").optional().isInt({ min: 1 }),
  query("limit").optional().isInt({ min: 1, max: 100 }),
  query("sortBy")
    .optional()
    .isIn([
      "created_at",
      "harga",
      "rating_rata_rata",
      "total_pesanan",
      "updated_at",
    ]),
  query("sortDir").optional().isIn(["asc", "desc"]),
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
