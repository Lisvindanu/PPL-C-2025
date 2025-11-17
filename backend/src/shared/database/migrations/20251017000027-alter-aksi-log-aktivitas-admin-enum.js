'use strict';

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.changeColumn('log_aktivitas_admin', 'aksi', {
      type: Sequelize.ENUM(
        // Nilai LAMA dari migration awal - JANGAN DIHAPUS
        'block_user',
        'unblock_user',
        'block_service',
        'unblock_service',
        'delete_review',        // ← Ini ketinggalan
        'approve_withdrawal',   // ← Ini ketinggalan
        'reject_withdrawal',    // ← Ini ketinggalan
        'update_user',          // ← Ini ketinggalan
        'export_report',

        // Nilai BARU yang mau ditambahkan
        'CREATE_KATEGORI',
        'UPDATE_KATEGORI',
        'DELETE_KATEGORI',
        'ACTIVATE_KATEGORI',
        'DEACTIVATE_KATEGORI',

        'CREATE_SUB_KATEGORI',
        'UPDATE_SUB_KATEGORI',
        'DELETE_SUB_KATEGORI',

        'VIEW_KATEGORI_STATISTIK',
        'EXPORT_KATEGORI_STATISTIK'
      ),
      allowNull: false
    });
  },

  async down(queryInterface, Sequelize) {
    // Rollback: kembalikan ke ENUM original lengkap
    await queryInterface.changeColumn('log_aktivitas_admin', 'aksi', {
      type: Sequelize.ENUM(
        'block_user',
        'unblock_user',
        'block_service',
        'unblock_service',
        'delete_review',
        'approve_withdrawal',
        'reject_withdrawal',
        'update_user',
        'export_report'
      ),
      allowNull: false
    });
  }
};