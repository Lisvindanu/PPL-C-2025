up: async (queryInterface, Sequelize) => {
  // Cek apakah kolom sudah ada
  const table = await queryInterface.describeTable('users');

  if (!table.google_id) {
    await queryInterface.addColumn('users', 'google_id', {
      type: Sequelize.STRING(255),
      allowNull: true,
      comment: 'Google OAuth user ID'
    });
  } else {
    console.log("Column 'google_id' already exists, skipping.");
  }

  // Password nullable
  await queryInterface.changeColumn('users', 'password', {
    type: Sequelize.STRING(255),
    allowNull: true
  });

  // Index google_id (try/catch)
  try {
    await queryInterface.addIndex('users', ['google_id'], {
      unique: true,
      name: 'users_google_id'
    });
  } catch (err) {
    console.log("Index already exists, skipping.");
  }
}
