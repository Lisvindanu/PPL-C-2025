// presentation/controllers/admin/AdminKategoriController.js

const { CreateKategoriDto, UpdateKategoriDto, KategoriResponseDto } = require('../../application/dtos/KategoriDto');



class AdminKategoriController {
constructor(
  createKategoriUseCase,
  updateKategoriUseCase,
  toggleKategoriStatusUseCase,
  deleteKategoriUseCase,
  getAllKategoriUseCase,
) {
  this.createKategoriUseCase = createKategoriUseCase;
  this.updateKategoriUseCase = updateKategoriUseCase;
  this.toggleKategoriStatusUseCase = toggleKategoriStatusUseCase;
  this.deleteKategoriUseCase = deleteKategoriUseCase;
  this.getAllKategoriUseCase = getAllKategoriUseCase;
}


  /**
   * POST /api/admin/kategori
   * Create new kategori
   */
 async createKategori(req, res) {
    try {
      const { nama, deskripsi, icon } = req.body;
      
      const adminId = req.user?.id || req.user?.userId;
      
      if (!adminId) {
        return res.status(401).json({
          success: false,
          message: 'Admin ID tidak ditemukan. Silakan login kembali.'
        });
      }

      const ipAddress = req.ip || req.connection.remoteAddress;
      const userAgent = req.get('user-agent');

      // Panggil use case dengan adminId
      const result = await this.createKategoriUseCase.execute(
        adminId,
        { nama, deskripsi, icon },
        { ipAddress, userAgent }
      );

      res.status(201).json({
        success: true,
        message: 'Kategori berhasil dibuat',
        data: result
      });
    } catch (error) {
      console.error('Error creating kategori:', error);
      res.status(500).json({
        success: false,
        message: error.message || 'Terjadi kesalahan saat membuat kategori'
      });
    }
  }

  async updateKategori(req, res) {
    try {
      const { id } = req.params;
      const { nama, deskripsi, icon, is_active } = req.body;

      // ✅ Ambil adminId dari req.user
      const adminId = req.user?.id || req.user?.userId;

      if (!adminId) {
        return res.status(401).json({
          success: false,
          message: 'Admin ID tidak ditemukan. Silakan login kembali.'
        });
      }

      // ✅ Ambil IP dan User Agent
      const ipAddress = req.ip || req.connection.remoteAddress;
      const userAgent = req.get('user-agent');

      const result = await this.updateKategoriUseCase.execute(
        adminId,
        id,
        { nama, deskripsi, icon, is_active },
        { ipAddress, userAgent }
      );

      res.status(200).json({
        success: true,
        message: 'Kategori berhasil diupdate',
        data: result
      });
    } catch (error) {
      console.error('Error updating kategori:', error);
      res.status(500).json({
        success: false,
        message: error.message || 'Terjadi kesalahan saat mengupdate kategori'
      });
    }
  }

  /**
   * PATCH /api/admin/kategori/:id/toggle-status
   * Toggle kategori active status
   */
async toggleKategoriStatus(req, res) {
  try {
    // ✅ Debug SEMUA req.user
    console.log('🔍 FULL req.user:', JSON.stringify(req.user, null, 2));
    console.log('🔍 req.user.id:', req.user?.id);
    console.log('🔍 req.user.userId:', req.user?.userId);
    console.log('🔍 req.user.id_user:', req.user?.id_user);

    const { id } = req.params;
    const { is_active } = req.body;

    if (typeof is_active !== 'boolean') {
      return res.status(400).json({
        success: false,
        message: 'is_active harus berupa boolean'
      });
    }

    // ✅ Coba semua kemungkinan property
    const adminId = req.user?.id || req.user?.userId || req.user?.id_user;
    
    console.log('🔍 Final adminId:', adminId);

    if (!adminId) {
      return res.status(401).json({
        success: false,
        message: 'Admin ID tidak ditemukan. Silakan login kembali.'
      });
    }

    const ipAddress = req.ip || req.connection.remoteAddress;
    const userAgent = req.get('user-agent');

    const result = await this.toggleKategoriStatusUseCase.execute(
      adminId,
      id,
      is_active,
      { ipAddress, userAgent }
    );

    return res.status(200).json({
      success: true,
      message: is_active ? 'Kategori berhasil diaktifkan' : 'Kategori berhasil dinonaktifkan',
      data: result.kategori
    });
  } catch (error) {
    console.error('Error toggling kategori status:', error);

    if (error.message === 'Kategori tidak ditemukan') {
      return res.status(404).json({
        success: false,
        message: error.message
      });
    }

    return res.status(500).json({
      success: false,
      message: 'Terjadi kesalahan saat mengubah status kategori',
      error: error.message
    });
  }
}
  /**
   * DELETE /api/admin/kategori/:id
   * Delete kategori
   */
async deleteKategori(req, res) {
  try {
    const { id } = req.params;

    // ✅ Ambil adminId
    const adminId = req.user?.id || req.user?.userId;
    
    if (!adminId) {
      return res.status(401).json({
        success: false,
        message: 'Admin ID tidak ditemukan. Silakan login kembali.'
      });
    }

    // ✅ Ambah IP dan User Agent
    const ipAddress = req.ip || req.connection.remoteAddress;
    const userAgent = req.get('user-agent');

    // ✅ Execute use case dengan 3 parameter
    const result = await this.deleteKategoriUseCase.execute(
      adminId,
      id,
      { ipAddress, userAgent }
    );

    return res.status(200).json({
      success: true,
      message: result.message
    });
  } catch (error) {
    console.error('Error deleting kategori:', error);

    if (error.message === 'Kategori tidak ditemukan') {
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
      message: 'Terjadi kesalahan saat menghapus kategori',
      error: error.message
    });
  }
}

async getAllKategori(req, res) {
    try {
      const { status, search, sortBy, sortOrder } = req.query;

      const filters = {};

      // Parse status (bisa "1" atau "0" dari query string)
      if (status !== undefined) {
        filters.status = status === '1' || status === 'true';
      }

      if (search) {
        filters.search = search;
      }

      if (sortBy) {
        filters.sortBy = sortBy;
      }

      if (sortOrder) {
        filters.sortOrder = sortOrder.toUpperCase();
      }

      const result = await this.getAllKategoriUseCase.execute(filters);

      return res.status(200).json(result);
    } catch (error) {
      console.error('Error in getAllKategori controller:', error);
      return res.status(500).json({
        success: false,
        message: error.message
      });
    }
  }
}

module.exports = AdminKategoriController;