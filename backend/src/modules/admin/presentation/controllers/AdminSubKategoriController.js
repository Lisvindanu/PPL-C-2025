// presentation/controllers/AdminSubKategoriController.js

class AdminSubKategoriController {
  constructor(
    createSubKategoriUseCase,
    getAllSubKategoriUseCase,
    updateSubKategoriUseCase,
    deleteSubKategoriUseCase,
    toggleSubKategoriStatusUseCase
  ) {
    this.createSubKategoriUseCase = createSubKategoriUseCase;
    this.getAllSubKategoriUseCase = getAllSubKategoriUseCase;
    this.updateSubKategoriUseCase = updateSubKategoriUseCase;
    this.deleteSubKategoriUseCase = deleteSubKategoriUseCase;
    this.toggleSubKategoriStatusUseCase = toggleSubKategoriStatusUseCase;
  }

  async createSubKategori(req, res) {
    try {
      const adminId = req.user?.id;
      
      if (!adminId) {
        return res.status(401).json({
          success: false,
          message: 'Admin tidak terautentikasi'
        });
      }

      const { nama, deskripsi, icon, id_kategori } = req.body;

      const result = await this.createSubKategoriUseCase.execute(
        adminId,
        { nama, deskripsi, icon, id_kategori },
        {
          ipAddress: req.ip || req.connection.remoteAddress,
          userAgent: req.get('user-agent')
        }
      );

      return res.status(201).json({
        success: true,
        message: 'Sub kategori berhasil dibuat',
        data: result
      });
    } catch (error) {
      console.error('Error creating sub kategori:', error);
      return res.status(500).json({
        success: false,
        message: 'Terjadi kesalahan saat membuat sub kategori',
        error: error.message
      });
    }
  }

  async getAllSubKategori(req, res) {
    try {
      const { kategori_id, is_active } = req.query;

      const filters = {};
      
      if (kategori_id && kategori_id !== 'undefined' && kategori_id !== 'null') {
        filters.kategoriId = kategori_id;
      }
      
      if (is_active !== undefined && is_active !== 'undefined' && is_active !== 'null') {
        filters.isActive = is_active === 'true';
      }

      const result = await this.getAllSubKategoriUseCase.execute(filters);

      return res.status(200).json({
        success: true,
        message: 'Data sub kategori berhasil diambil',
        data: result
      });
    } catch (error) {
      console.error('Error in getAllSubKategori controller:', error);
      return res.status(500).json({
        success: false,
        message: 'Gagal mengambil data sub kategori',
        error: error.message
      });
    }
  }

  async updateSubKategori(req, res) {
    try {
      const adminId = req.user?.id;
      
      if (!adminId) {
        return res.status(401).json({
          success: false,
          message: 'Admin tidak terautentikasi'
        });
      }

      const { id } = req.params;
      const { nama, deskripsi, icon, id_kategori } = req.body;

      const result = await this.updateSubKategoriUseCase.execute(
        adminId,
        id,
        { nama, deskripsi, icon, id_kategori },
        {
          ipAddress: req.ip || req.connection.remoteAddress,
          userAgent: req.get('user-agent')
        }
      );

      return res.status(200).json({
        success: true,
        message: 'Sub kategori berhasil diupdate',
        data: result
      });
    } catch (error) {
      console.error('Error updating sub kategori:', error);
      return res.status(500).json({
        success: false,
        message: 'Terjadi kesalahan saat mengupdate sub kategori',
        error: error.message
      });
    }
  }

  async deleteSubKategori(req, res) {
    try {
      const adminId = req.user?.id;
      
      if (!adminId) {
        return res.status(401).json({
          success: false,
          message: 'Admin tidak terautentikasi'
        });
      }

      const { id } = req.params;

      await this.deleteSubKategoriUseCase.execute(
        adminId,
        id,
        {
          ipAddress: req.ip || req.connection.remoteAddress,
          userAgent: req.get('user-agent')
        }
      );

      return res.status(200).json({
        success: true,
        message: 'Sub kategori berhasil dihapus'
      });
    } catch (error) {
      console.error('Error deleting sub kategori:', error);
      return res.status(500).json({
        success: false,
        message: 'Terjadi kesalahan saat menghapus sub kategori',
        error: error.message
      });
    }
  }

   async toggleSubKategoriStatus(req, res) {
    try {
      const adminId = req.user?.id;
      
      if (!adminId) {
        return res.status(401).json({
          success: false,
          message: 'Admin tidak terautentikasi'
        });
      }

      const { id } = req.params;
      const { is_active } = req.body;

      console.log('🔄 Toggle status request:', { id, is_active, adminId });

      // Validasi input
      if (typeof is_active !== 'boolean') {
        return res.status(400).json({
          success: false,
          message: 'Status harus berupa boolean (true/false)'
        });
      }

      const result = await this.toggleSubKategoriStatusUseCase.execute(
        adminId,
        id,
        is_active,
        {
          ipAddress: req.ip || req.connection.remoteAddress,
          userAgent: req.get('user-agent')
        }
      );

      return res.status(200).json({
        success: true,
        message: `Sub kategori berhasil ${is_active ? 'diaktifkan' : 'dinonaktifkan'}`,
        data: result
      });
    } catch (error) {
      console.error('❌ Error toggling sub kategori status:', error);
      
      const statusCode = error.message.includes('tidak ditemukan') ? 404 : 500;
      
      return res.status(statusCode).json({
        success: false,
        message: error.message || 'Terjadi kesalahan saat mengubah status sub kategori',
        error: process.env.NODE_ENV === 'development' ? error.stack : undefined
      });
    }
  }
}

module.exports = AdminSubKategoriController;