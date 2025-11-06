const AdminActivityLog = require('../../domain/entities/AdminActivityLog');

class BlockService {
  constructor(serviceRepository, adminLogRepository) {
    this.serviceRepository = serviceRepository;
    this.adminLogRepository = adminLogRepository;
  }

  async execute(adminId, serviceId, reason, ipAddress, userAgent) {

    if (!adminId || adminId === 'undefined' || adminId === 'admin') {
      throw new Error('Invalid admin ID');
    }

    if (!serviceId) {
      throw new Error('Service ID is required');
    }

    const service = await this.serviceRepository.findByPk(serviceId);
    if (!service) {
      throw new Error('Layanan tidak ditemukan');
    }

    await this.serviceRepository.update(
      { status: 'nonaktif' },
      { where: { id: serviceId } }
    );
    
await this.adminLogRepository.save({
  adminId: adminId,          // camelCase
  action: 'block_service',   // sesuai repository
  targetType: 'layanan',
  targetId: serviceId,
  detail: { reason },
  ipAddress: ipAddress,
  userAgent: userAgent
});


    return service;
  }
}

module.exports = BlockService;