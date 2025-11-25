/**
 * Order Validation Middleware
 * Validasi input untuk order endpoints menggunakan Joi
 */

const Joi = require('joi');

const orderValidation = {
  /**
   * Validasi untuk create order
   */
  createOrder: (req, res, next) => {
    const schema = Joi.object({
      layanan_id: Joi.string().uuid().required().messages({
        'string.empty': 'layanan_id tidak boleh kosong',
        'string.uuid': 'layanan_id harus berformat UUID',
        'any.required': 'layanan_id wajib diisi'
      }),
      paket_id: Joi.string().uuid().allow(null, '').optional().messages({
        'string.uuid': 'paket_id harus berformat UUID'
      }),
      catatan_client: Joi.string().max(1000).allow(null, '').optional().messages({
        'string.max': 'catatan_client maksimal 1000 karakter'
      })
    });

    const { error } = schema.validate(req.body, { abortEarly: false });

    if (error) {
      const errors = error.details.map(detail => ({
        field: detail.path[0],
        message: detail.message
      }));

      return res.status(400).json({
        success: false,
        message: 'Validasi gagal',
        errors
      });
    }

    next();
  },

  /**
   * Validasi untuk cancel order
   */
  cancelOrder: (req, res, next) => {
    const schema = Joi.object({
      reason: Joi.string().max(500).allow(null, '').optional().messages({
        'string.max': 'reason maksimal 500 karakter'
      })
    });

    const { error } = schema.validate(req.body, { abortEarly: false });

    if (error) {
      const errors = error.details.map(detail => ({
        field: detail.path[0],
        message: detail.message
      }));

      return res.status(400).json({
        success: false,
        message: 'Validasi gagal',
        errors
      });
    }

    next();
  },

  /**
   * Validasi query params untuk list orders
   */
  listOrders: (req, res, next) => {
    const schema = Joi.object({
      page: Joi.number().integer().min(1).default(1).messages({
        'number.base': 'page harus berupa angka',
        'number.integer': 'page harus berupa integer',
        'number.min': 'page minimal 1'
      }),
      limit: Joi.number().integer().min(1).max(100).default(10).messages({
        'number.base': 'limit harus berupa angka',
        'number.integer': 'limit harus berupa integer',
        'number.min': 'limit minimal 1',
        'number.max': 'limit maksimal 100'
      }),
      status: Joi.string().valid(
        'menunggu_pembayaran',
        'dibayar',
        'dikerjakan',
        'menunggu_review',
        'revisi',
        'selesai',
        'dispute',
        'dibatalkan',
        'refunded'
      ).optional().messages({
        'string.base': 'status harus berupa string',
        'any.only': 'status tidak valid'
      }),
      q: Joi.string().max(100).optional().messages({
        'string.max': 'q maksimal 100 karakter'
      }),
      created_from: Joi.date().iso().optional().messages({
        'date.base': 'created_from harus berupa tanggal',
        'date.format': 'created_from harus berformat ISO 8601'
      }),
      created_to: Joi.date().iso().optional().messages({
        'date.base': 'created_to harus berupa tanggal',
        'date.format': 'created_to harus berformat ISO 8601'
      }),
      sortBy: Joi.string().valid('created_at', 'total_bayar', 'harga', 'status', 'tenggat_waktu').default('created_at').optional(),
      sortOrder: Joi.string().valid('ASC', 'DESC', 'asc', 'desc').default('DESC').optional()
    });

    const { error, value } = schema.validate(req.query, { abortEarly: false });

    if (error) {
      const errors = error.details.map(detail => ({
        field: detail.path[0],
        message: detail.message
      }));

      return res.status(400).json({
        success: false,
        message: 'Validasi gagal',
        errors
      });
    }

    // Set validated values back to req.query
    req.query = value;
    next();
  },

  /**
   * Validasi UUID parameter
   */
  validateUUID: (req, res, next) => {
    const schema = Joi.object({
      id: Joi.string().uuid().required().messages({
        'string.empty': 'id tidak boleh kosong',
        'string.uuid': 'id harus berformat UUID',
        'any.required': 'id wajib diisi'
      })
    });

    const { error } = schema.validate(req.params, { abortEarly: false });

    if (error) {
      return res.status(400).json({
        success: false,
        message: 'ID tidak valid'
      });
    }

    next();
  }
};

module.exports = orderValidation;
