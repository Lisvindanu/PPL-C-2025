/**
 * GetMyOrders Use Case
 *
 * Ambil daftar pesanan user sebagai client (pembeli) dengan filter, pencarian, dan sorting.
 */

class GetMyOrders {
  constructor(orderRepository) {
    this.orderRepository = orderRepository;
  }

  async execute(clientId, params = {}) {
    const page = Math.max(parseInt(params.page || '1', 10), 1);
    const limit = Math.min(Math.max(parseInt(params.limit || '10', 10), 1), 100);

    const filters = {
      status: params.status || undefined,
      q: (params.q || '').trim() || undefined,
      created_from: params.created_from || undefined,
      created_to: params.created_to || undefined,
      sortBy: params.sortBy || 'created_at',
      sortOrder: (params.sortOrder || 'DESC').toString().toUpperCase() === 'ASC' ? 'ASC' : 'DESC',
      page,
      limit
    };

    const result = await this.orderRepository.findByUserId(clientId, filters);

    // Normalisasi rows ke plain object agar mudah diolah
    const rows = Array.isArray(result.rows)
      ? result.rows.map((row) => (row && typeof row.get === 'function' ? row.get({ plain: true }) : row))
      : [];

    // Ambil status pembayaran dari tabel pembayaran untuk semua order sekaligus
    const orderIds = rows.map((o) => o && o.id).filter(Boolean);
    let successByOrderId = new Set();

    if (orderIds.length > 0) {
      try {
        const PaymentModel = require('../../../payment/infrastructure/models/PaymentModel');
        const { Op } = require('sequelize');

        const successPayments = await PaymentModel.findAll({
          where: {
            pesanan_id: { [Op.in]: orderIds },
            status: ['berhasil', 'success', 'paid', 'settlement']
          },
          attributes: ['pesanan_id'],
          raw: true
        });

        successByOrderId = new Set(successPayments.map((p) => p.pesanan_id));
      } catch (err) {
        console.error('[GetMyOrders] Failed to fetch payment status for orders:', err);
      }
    }

    const adjustedRows = rows.map((order) => {
      if (!order) return order;

      if (order.status === 'menunggu_pembayaran' && successByOrderId.has(order.id)) {
        return { ...order, status: 'dibayar' };
      }

      return order;
    });

    return {
      success: true,
      data: adjustedRows,
      pagination: {
        total: result.count,
        page,
        limit,
        totalPages: Math.ceil(result.count / limit)
      }
    };
  }
}

module.exports = GetMyOrders;
