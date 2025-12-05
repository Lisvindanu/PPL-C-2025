'use strict';

module.exports = {
  async up(queryInterface, Sequelize) {
    // Tambahkan nilai baru KE enum yang sudah ada, jangan hapus 'system'
    await queryInterface.changeColumn('log_aktivitas_admin', 'target_type', {
      type: Sequelize.ENUM(
        'user',
        'layanan',
        'ulasan',
        'pesanan',
        'pembayaran',
        'system',          // ← JANGAN DIHAPUS, ini dari migration awal
        'kategori',        // ← Tambahan baru
        'sub_kategori',    // ← Tambahan baru
        'rating'           // ← Tambahan baru
      ),
      allowNull: false
    });
  },

  async down(queryInterface, Sequelize) {
    // Rollback: kembalikan ke enum original (yang ada di create table)
    await queryInterface.changeColumn('log_aktivitas_admin', 'target_type', {
      type: Sequelize.ENUM(
        'user',
        'layanan',
        'ulasan',
        'pesanan',
        'pembayaran',
        'system'
      ),
      allowNull: false
    });
  }
};