/**
 * Service Repository Interface
 * Contract untuk service data access
 */

class ServiceRepository {
  async create(serviceData) {
    throw new Error('Method create() must be implemented');
  }

  async findById(id) {
    throw new Error('Method findById() must be implemented');
  }

  async findBySlug(slug) {
    throw new Error('Method findBySlug() must be implemented');
  }

  async findByUserId(userId, filters = {}) {
    throw new Error('Method findByUserId() must be implemented');
  }

  async findAll(filters = {}, pagination = {}) {
    throw new Error('Method findAll() must be implemented');
  }

  async update(id, serviceData) {
    throw new Error('Method update() must be implemented');
  }

  async delete(id) {
    throw new Error('Method delete() must be implemented');
  }

  async search(keyword, filters = {}, pagination = {}) {
    throw new Error('Method search() must be implemented');
  }

  async updateStatus(id, status, reason = null) {
    throw new Error('Method updateStatus() must be implemented');
  }

  async updateRating(id, newRating, reviewCount) {
    throw new Error('Method updateRating() must be implemented');
  }

  async incrementOrderCount(id) {
    throw new Error('Method incrementOrderCount() must be implemented');
  }
}

module.exports = ServiceRepository;
