class UnblockService {
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

    // Cek apakah service exists
    const service = await this.serviceRepository.findByPk(serviceId);
    if (!service) {
      throw new Error('Layanan tidak ditemukan');
    }

    // Update status jadi aktif
    await this.serviceRepository.update(
      { status: 'aktif' },
      { where: { id: serviceId } }
    );


    // Save log
    await this.adminLogRepository.save({
    adminId: adminId,          // camelCase sesuai repository
    action: 'unblock_service', // harus sesuai
    targetType: 'layanan',
    targetId: serviceId,
    detail: { reason },
    ipAddress: ipAddress,
    userAgent: userAgent
  });


    return service;
  }
}

module.exports = UnblockService;