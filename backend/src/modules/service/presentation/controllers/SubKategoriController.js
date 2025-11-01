class SubKategoriController {
  constructor(sequelize) {
    this.sequelize = sequelize;
  }

  async getAllSubKategori(req, res) {
    try {
      const { id_kategori } = req.query;

      let query = `
        SELECT sk.id, sk.id_kategori, sk.nama, sk.slug, sk.deskripsi, sk.icon,
               k.nama as nama_kategori, k.slug as kategori_slug
        FROM sub_kategori sk
        JOIN kategori k ON sk.id_kategori = k.id
        WHERE sk.is_active = true
      `;

      const params = [];
      if (id_kategori) {
        query += ' AND sk.id_kategori = ?';
        params.push(id_kategori);
      }

      query += ' ORDER BY k.nama ASC, sk.nama ASC';

      const [results] = await this.sequelize.query(query, {
        replacements: params
      });

      res.status(200).json({
        success: true,
        data: results
      });
    } catch (error) {
      console.error('Error fetching sub categories:', error);
      res.status(500).json({
        success: false,
        message: 'Failed to fetch sub categories',
        error: error.message
      });
    }
  }

  async getSubKategoriById(req, res) {
    try {
      const { id } = req.params;

      const [results] = await this.sequelize.query(
        `SELECT sk.id, sk.id_kategori, sk.nama, sk.slug, sk.deskripsi, sk.icon,
                k.nama as nama_kategori, k.slug as kategori_slug
         FROM sub_kategori sk
         JOIN kategori k ON sk.id_kategori = k.id
         WHERE sk.id = ? AND sk.is_active = true`,
        { replacements: [id] }
      );

      if (results.length === 0) {
        return res.status(404).json({
          success: false,
          message: 'Sub category not found'
        });
      }

      res.status(200).json({
        success: true,
        data: results[0]
      });
    } catch (error) {
      console.error('Error fetching sub category:', error);
      res.status(500).json({
        success: false,
        message: 'Failed to fetch sub category',
        error: error.message
      });
    }
  }
}

module.exports = SubKategoriController;
