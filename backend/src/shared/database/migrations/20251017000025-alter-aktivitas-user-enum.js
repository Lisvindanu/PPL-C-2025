'use strict';

module.exports = {
    up: async (queryInterface, Sequelize) => {
        // MySQL: ALTER TABLE to modify ENUM column
        await queryInterface.sequelize.query(`
      ALTER TABLE aktivitas_user 
      MODIFY COLUMN tipe_aktivitas 
      ENUM('lihat_layanan', 'cari', 'tambah_favorit', 'buat_pesanan', 'hide') 
      NOT NULL 
      COMMENT 'Tipe aktivitas user';
    `);

        console.log('✅ Added "hide" to aktivitas_user.tipe_aktivitas enum');
    },

    down: async (queryInterface, Sequelize) => {
        // Rollback: hapus data 'hide' dulu, lalu kembalikan enum tanpa 'hide'
        await queryInterface.sequelize.query(`
      DELETE FROM aktivitas_user WHERE tipe_aktivitas = 'hide';
    `);

        await queryInterface.sequelize.query(`
      ALTER TABLE aktivitas_user 
      MODIFY COLUMN tipe_aktivitas 
      ENUM('lihat_layanan', 'cari', 'tambah_favorit', 'buat_pesanan') 
      NOT NULL 
      COMMENT 'Tipe aktivitas user';
    `);

        console.log('⚠️ Removed "hide" from enum and deleted all hide records');
    }
};