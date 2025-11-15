"use strict";

/**
 * Service Taxonomy Guard
 * Validasi kategori_id untuk modul Layanan.
 * Sumber sequelize:
 * 1) Prefer: req.app.get('sequelize') (jika diset di server.js)
 * 2) Fallback: require('../database/connection').sequelize
 */

function resolveSequelize(req) {
  // Prefer yang disuntik lewat app.set('sequelize', ...)
  const fromApp = req?.app?.get?.("sequelize");
  if (fromApp) return fromApp;

  // Fallback ke koneksi shared
  try {
    const { sequelize } = require("../database/connection");
    if (sequelize) return sequelize;
  } catch (_) {
    // noop
  }
  return null;
}

async function taxonomyValidateCreate(req, res, next) {
  try {
    const sequelize = resolveSequelize(req);
    if (!sequelize) {
      const err = new Error(
        "[taxonomy] Database connection is not initialized"
      );
      err.statusCode = 500;
      throw err;
    }

    const { kategori_id } = req.body || {};
    if (!kategori_id) {
      const err = new Error("kategori_id wajib diisi");
      err.statusCode = 400;
      throw err;
    }

    const [krows] = await sequelize.query(
      "SELECT id FROM kategori WHERE id = ? LIMIT 1",
      { replacements: [kategori_id] }
    );
    const krow = Array.isArray(krows) ? krows[0] : krows;
    if (!krow) {
      const err = new Error("kategori_id tidak ditemukan");
      err.statusCode = 400;
      throw err;
    }

    return next();
  } catch (err) {
    return next(err);
  }
}

async function taxonomyValidateUpdate(req, res, next) {
  try {
    const sequelize = resolveSequelize(req);
    if (!sequelize) {
      const err = new Error(
        "[taxonomy] Database connection is not initialized"
      );
      err.statusCode = 500;
      throw err;
    }

    const { kategori_id } = req.body || {};
    if (!kategori_id) return next(); // tidak update kategori → lanjut

    const [krows] = await sequelize.query(
      "SELECT id FROM kategori WHERE id = ? LIMIT 1",
      { replacements: [kategori_id] }
    );
    const krow = Array.isArray(krows) ? krows[0] : krows;
    if (!krow) {
      const err = new Error("kategori_id tidak ditemukan");
      err.statusCode = 400;
      throw err;
    }

    return next();
  } catch (err) {
    return next(err);
  }
}

module.exports = {
  taxonomyValidateCreate,
  taxonomyValidateUpdate,
};
