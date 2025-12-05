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
      const adminId = req.user?.id || req.user?.userId;
      
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
      console.error('❌ Error creating sub kategori:', error);
      return res.status(500).json({
        success: false,
        message: error.message || 'Terjadi kesalahan saat membuat sub kategori'
      });
    }
  }

  /**
   * ✅ PERBAIKAN UTAMA: Gunakan 'status' bukan 'is_active'
   * GET /api/admin/sub-kategori?search=xxx&status=active
   */
  async getAllSubKategori(req, res) {
    try {
      // ✅ Ubah dari is_active → status (sama dengan kategori controller)
      const { kategori_id, status, search, sortBy, sortOrder } = req.query;

      console.log("🔵 SUB-KATEGORI CONTROLLER - Query params:", { 
        kategori_id, status, search, sortBy, sortOrder 
      });

      const filters = {};
      
      // Filter by kategori induk
      if (kategori_id && kategori_id !== 'undefined' && kategori_id !== 'null') {
        filters.kategoriId = kategori_id;
      }
      
      // ✅ PERBAIKAN: Status filter langsung gunakan nilai 'status'
      if (status !== undefined && status !== 'undefined' && status !== 'null') {
        filters.status = status; // ✅ Langsung assign seperti kategori
      }

      // Search filter
      if (search && search.trim()) {
        filters.search = search.trim();
      }

      // Sorting
      if (sortBy) {
        filters.sortBy = sortBy;
      }

      if (sortOrder) {
        filters.sortOrder = sortOrder.toUpperCase();
      }

      console.log("🟢 SUB-KATEGORI CONTROLLER - Filters to use case:", filters);

      const result = await this.getAllSubKategoriUseCase.execute(filters);

      return res.status(200).json({
        success: true,
        message: 'Data sub kategori berhasil diambil',
        data: result
      });
    } catch (error) {
      console.error('❌ Error in getAllSubKategori controller:', error);
      return res.status(500).json({
        success: false,
        message: 'Gagal mengambil data sub kategori',
        error: error.message
      });
    }
  }

  async updateSubKategori(req, res) {
    try {
      const adminId = req.user?.id || req.user?.userId;
      
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
      console.error('❌ Error updating sub kategori:', error);
      
      if (error.message === 'Sub kategori tidak ditemukan') {
        return res.status(404).json({
          success: false,
          message: error.message
        });
      }

      return res.status(500).json({
        success: false,
        message: error.message || 'Terjadi kesalahan saat mengupdate sub kategori'
      });
    }
  }

  async deleteSubKategori(req, res) {
    try {
      const adminId = req.user?.id || req.user?.userId;
      
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
      console.error('❌ Error deleting sub kategori:', error);

      if (error.message === 'Sub kategori tidak ditemukan') {
        return res.status(404).json({
          success: false,
          message: error.message
        });
      }

      if (error.message.includes('Tidak dapat menghapus')) {
        return res.status(400).json({
          success: false,
          message: error.message
        });
      }

      return res.status(500).json({
        success: false,
        message: error.message || 'Terjadi kesalahan saat menghapus sub kategori'
      });
    }
  }

  async toggleSubKategoriStatus(req, res) {
    try {
      const adminId = req.user?.id || req.user?.userId;
      
      if (!adminId) {
        return res.status(401).json({
          success: false,
          message: 'Admin tidak terautentikasi'
        });
      }

      const { id } = req.params;
      const { is_active } = req.body;

      console.log('🔄 Toggle status request:', { id, is_active, adminId });

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