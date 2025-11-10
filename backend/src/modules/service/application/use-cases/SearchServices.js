"use strict";

class SearchServices {
  constructor(serviceRepository) {
    this.serviceRepository = serviceRepository;
  }

  async execute(filters = {}) {
    const page = parseInt(filters.page) || 1;
    const limit = parseInt(filters.limit) || 20;
    const sortBy = filters.sortBy || "created_at";
    const sortOrder = filters.sortOrder || "DESC";
    const status = filters.status || "aktif";

    const result = await this.serviceRepository.search({
      q: filters.q || "",
      kategori_id: filters.kategori_id,
      is_active: filters.is_active,
      status,
      page,
      limit,
      sortBy,
      sortOrder,
    });

    return {
      services: result.services,
      pagination: {
        total: result.total,
        page: result.page,
        limit: result.limit,
        totalPages: result.totalPages,
      },
    };
  }
}

module.exports = SearchServices;
