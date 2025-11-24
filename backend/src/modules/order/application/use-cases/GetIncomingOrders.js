/**
 * GetIncomingOrders Use Case
 * Ambil daftar pesanan masuk untuk freelancer dengan filter, pencarian, dan sorting.
 */

class GetIncomingOrders {
  constructor(orderRepository) {
    this.orderRepository = orderRepository;
  }

  async execute(freelancerId, params = {}) {
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

    const result = await this.orderRepository.findByPenyediaId(freelancerId, filters);

    return {
      success: true,
      data: result.rows,
      pagination: {
        total: result.count,
        page,
        limit,
        totalPages: Math.ceil(result.count / limit)
      }
    };
  }
}

module.exports = GetIncomingOrders;