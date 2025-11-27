"use strict";

module.exports = {
  up: async (queryInterface, Sequelize) => {
    // Cek struktur tabel
    const table = await queryInterface.describeTable("users");

    // 1. Tambah kolom google_id jika belum ada
    if (!table.google_id) {
      console.log("Adding column google_id...");
      await queryInterface.addColumn("users", "google_id", {
        type: Sequelize.STRING(255),
        allowNull: true,
        comment: "Google OAuth user ID"
      });
    } else {
      console.log("Column 'google_id' already exists, skipping.");
    }

    // 2. Ubah kolom password menjadi nullable (jika belum)
    if (table.password && table.password.allowNull === false) {
      console.log("Updating password column to nullable...");
      await queryInterface.changeColumn("users", "password", {
        type: Sequelize.STRING(255),
        allowNull: true
      });
    } else {
      console.log("Password column already nullable or missing, skipping.");
    }

    // 3. Tambah index unik untuk google_id (try/catch agar aman)
    try {
      await queryInterface.addIndex("users", ["google_id"], {
        unique: true,
        name: "users_google_id"
      });
      console.log("Index users_google_id added.");
    } catch (err) {
      console.log("Index users_google_id already exists, skipping.");
    }
  },

  down: async (queryInterface) => {
    // Hapus index jika ada
    try {
      await queryInterface.removeIndex("users", "users_google_id");
    } catch {}

    // Hapus kolom google_id
    try {
      await queryInterface.removeColumn("users", "google_id");
    } catch {}
  }
};
