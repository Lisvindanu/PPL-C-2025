const AdminActivityLog = require('../../domain/entities/AdminActivityLog');

class BlockService {
  constructor(serviceRepository, adminLogRepository) {
    this.serviceRepository = serviceRepository;
    this.adminLogRepository = adminLogRepository;
  }

  async execute(adminId, serviceId, reason, ipAddress, userAgent) {
    console.log('BlockService - adminId:', adminId);
    console.log('BlockService - serviceId:', serviceId);

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

    console.log('Service found:', service);

    await this.serviceRepository.update(
      { status: 'nonaktif' },
      { where: { id: serviceId } }
    );

    console.log('Service status updated to nonaktif');

    const log = new AdminActivityLog({
      adminId: adminId,
      action: 'block_service',
      targetType: 'layanan',
      targetId: serviceId,
      detail: { reason },
      ipAddress: ipAddress,
      userAgent: userAgent,
    });

    console.log('AdminActivityLog created:', log);

    if (!log.isValid()) {
      throw new Error('Invalid activity log data');
    }

    console.log('Log is valid, saving...');

    await this.adminLogRepository.save(log);

    console.log('Log saved successfully');

    return service;
  }
}

module.exports = BlockService;