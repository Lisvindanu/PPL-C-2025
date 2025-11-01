/**
 * Create Service Use Case
 * Business logic untuk membuat layanan baru
 */

class CreateService {
  constructor(serviceRepository) {
    this.serviceRepository = serviceRepository;
  }

  async execute(userId, serviceData) {
    // TODO: Implement service creation logic
    // 1. Validate input data
    // 2. Generate slug from judul
    // 3. Validate kategori and sub_kategori exists
    // 4. Set initial status (draft or pending)
    // 5. Save to database
    // 6. Return created service

    throw new Error('Not implemented yet - Create service will be added in future sprint');
  }
}

module.exports = CreateService;
