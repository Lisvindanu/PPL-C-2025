"use strict";

/**
 * Abstraksi kontrak repository untuk Service (Layanan).
 * Implementasi konkret: SequelizeServiceRepository.
 */
class ServiceRepository {
  async create(service /* Service */) {
    throw new Error("Not implemented");
  }
  async findById(id) {
    throw new Error("Not implemented");
  }
  async findBySlug(slug) {
    throw new Error("Not implemented");
  }
  async findAll(filters = {}) {
    throw new Error("Not implemented");
  }
  async search(params = {}) {
    throw new Error("Not implemented");
  }

  async update(id, partial /* whitelist fields */) {
    throw new Error("Not implemented");
  }
  async updateStatus(id, status) {
    throw new Error("Not implemented");
  }

  async softDelete(id) {
    throw new Error("Not implemented");
  }

  async incrementView(id) {
    throw new Error("Not implemented");
  }
  async incrementOrderCount(id) {
    throw new Error("Not implemented");
  }

  async existsKategori(id) {
    throw new Error("Not implemented");
  }
  async existsFreelancer(id) {
    throw new Error("Not implemented");
  }

  async hasActiveOrders(id) {
    throw new Error("Not implemented");
  }
}

module.exports = ServiceRepository;
