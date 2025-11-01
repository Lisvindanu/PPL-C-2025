/**
 * Approve Service Use Case (Admin Only)
 *
 * Ini buat admin approve/reject service yang baru dibuat.
 * Workflow nya: User bikin service -> status 'pending' -> Admin review -> approve/reject
 *
 * Steps:
 * 1. Validasi service exist dan status nya 'pending'
 * 2. Validasi user yang request adalah admin (di controller udah di-check middleware)
 * 3. Kalo approve: set status jadi 'active'
 * 4. Kalo reject: set status jadi 'rejected' + kasih alasan
 * 5. (Optional) Kirim email notifikasi ke penyedia
 * 6. Log action ke admin_logs
 */

class ApproveService {
  constructor(serviceRepository, emailService = null, adminLogRepository = null) {
    this.serviceRepository = serviceRepository;
    this.emailService = emailService;
    this.adminLogRepository = adminLogRepository;
  }

  async execute(serviceId, adminId, action, reason = null) {
    // action: 'approve' atau 'reject'

    // TODO: Validasi service exist
    // const service = await this.serviceRepository.findById(serviceId);
    // if (!service) {
    //   throw new Error('Service not found');
    // }

    // TODO: Validasi status harus pending
    // if (service.status !== 'pending') {
    //   throw new Error(`Service status ${service.status}, ga bisa di-approve/reject lagi`);
    // }

    // TODO: Update status berdasarkan action
    // let updateData = {};
    // if (action === 'approve') {
    //   updateData = {
    //     status: 'active',
    //     is_active: true,
    //     alasan_ditolak: null
    //   };
    // } else if (action === 'reject') {
    //   if (!reason) {
    //     throw new Error('Alasan penolakan wajib diisi, jangan asal reject anjir');
    //   }
    //   updateData = {
    //     status: 'rejected',
    //     is_active: false,
    //     alasan_ditolak: reason
    //   };
    // } else {
    //   throw new Error('Action cuma boleh approve atau reject, bego');
    // }

    // TODO: Update ke database
    // const updatedService = await this.serviceRepository.updateStatus(
    //   serviceId,
    //   updateData.status,
    //   updateData.alasan_ditolak
    // );

    // TODO: (Optional) Kirim email notifikasi ke penyedia
    // if (this.emailService && service.user_email) {
    //   if (action === 'approve') {
    //     await this.emailService.sendServiceApprovedEmail(service.user_email, service);
    //   } else {
    //     await this.emailService.sendServiceRejectedEmail(service.user_email, service, reason);
    //   }
    // }

    // TODO: Log ke admin_logs
    // if (this.adminLogRepository) {
    //   await this.adminLogRepository.create({
    //     admin_id: adminId,
    //     action: action === 'approve' ? 'APPROVE_SERVICE' : 'REJECT_SERVICE',
    //     target_type: 'SERVICE',
    //     target_id: serviceId,
    //     details: { reason }
    //   });
    // }

    // return updatedService;

    throw new Error('Not implemented yet - Tinggal sambungin ke database doang kok');
  }
}

module.exports = ApproveService;
