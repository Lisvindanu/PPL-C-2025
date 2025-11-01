class KategoriController {
  constructor(sequelize) {
    this.sequelize = sequelize;
  }

  async getAllKategori(req, res) {
    try {
      const [results] = await this.sequelize.query(
        'SELECT id, nama, slug, deskripsi, icon FROM kategori WHERE is_active = true ORDER BY nama ASC'
      );

      res.status(200).json({
        success: true,
        data: results
      });
    } catch (error) {
      console.error('Error fetching categories:', error);
      res.status(500).json({
        success: false,
        message: 'Failed to fetch categories',
        error: error.message
      });
    }
  }
}

module.exports = KategoriController;
