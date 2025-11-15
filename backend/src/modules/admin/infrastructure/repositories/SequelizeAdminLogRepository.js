const { v4: uuidv4 } = require('uuid');

class SequelizeAdminLogRepository {
  constructor(sequelize) {
    this.sequelize = sequelize;
  }

  create(log) {
    return this.save(log);
  }

  async save(log) {
    try {
      const logId = uuidv4();

      // ✅ Debug: Log input untuk melihat nilai yang diterima
      console.log('🔍 Admin Log Input:', JSON.stringify(log, null, 2));

      // ✅ Validasi input wajib
      if (!log.adminId) {
        throw new Error('adminId is required');
      }
      if (!log.action) {
        throw new Error('action is required');
      }
      if (!log.targetType) {
        throw new Error('targetType is required');
      }

      // ✅ Siapkan replacements dengan nilai yang aman
      const replacements = [
        logId,
        log.adminId,
        log.action,
        log.targetType,
        log.targetId || null,           // Pastikan null jika undefined
        JSON.stringify(log.detail || {}),
        log.ipAddress || null,          // Pastikan null jika undefined
        log.userAgent || null           // Pastikan null jika undefined
      ];

      // ✅ Debug: Log replacements untuk memastikan tidak ada undefined
      console.log('🔍 Replacements:', replacements);

      await this.sequelize.query(`
        INSERT INTO log_aktivitas_admin 
        (id, admin_id, aksi, target_type, target_id, detail, ip_address, user_agent, created_at)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, NOW())
      `, {
        replacements,
        type: this.sequelize.QueryTypes.INSERT
      });

      console.log('✅ Admin log saved successfully');

      return { ...log, id: logId };
    } catch (error) {
      console.error('❌ Error saving admin log:', error);
      throw new Error(`Failed to save log: ${error.message}`);
    }
  }

  async getLogs(filters = {}) {
    try {
      const limit = filters.limit || 50;
      const offset = filters.offset || 0;

      let query = `
        SELECT 
          l.id,
          l.admin_id,
          l.aksi,
          l.target_type,
          l.target_id,
          l.detail,
          l.ip_address,
          l.user_agent,
          l.created_at,
          u.email as admin_email,
          u.nama_depan as admin_name
        FROM log_aktivitas_admin l
        LEFT JOIN users u ON l.admin_id = u.id
      `;

      const conditions = [];
      const replacements = [];

      if (filters.adminId) {
        conditions.push('l.admin_id = ?');
        replacements.push(filters.adminId);
      }

      const whereClause = conditions.length > 0 ? ' WHERE ' + conditions.join(' AND ') : '';
      
      const countQuery = `SELECT COUNT(*) as total FROM log_aktivitas_admin l ${whereClause}`;
      const [countResult] = await this.sequelize.query(countQuery, {
        replacements: [...replacements],
        type: this.sequelize.QueryTypes.SELECT
      });

      query += whereClause + ' ORDER BY l.created_at DESC LIMIT ? OFFSET ?';
      replacements.push(limit, offset);

      const logs = await this.sequelize.query(query, {
        replacements,
        raw: true,
        type: this.sequelize.QueryTypes.SELECT
      });

      return {
        data: logs,
        total: countResult.total,
        limit,
        offset
      };
    } catch (error) {
      console.error('❌ getLogs error:', error);
      throw new Error(`Failed to get logs: ${error.message}`);
    }
  }

  async findWithFilters(filters = {}) {
    try {
      let query = `
        SELECT 
          l.id,
          l.admin_id,
          l.aksi,
          l.target_type,
          l.target_id,
          l.detail,
          l.ip_address,
          l.user_agent,
          l.created_at,
          u.email as admin_email,
          u.nama_depan as admin_name
        FROM log_aktivitas_admin l
        LEFT JOIN users u ON l.admin_id = u.id
      `;
      const replacements = [];
      const conditions = [];

      if (filters.adminId) {
        conditions.push('l.admin_id = ?');
        replacements.push(filters.adminId);
      }

      if (filters.action) {
        conditions.push('l.aksi = ?');
        replacements.push(filters.action);
      }

      if (filters.targetType) {
        conditions.push('l.target_type = ?');
        replacements.push(filters.targetType);
      }

      if (filters.startDate && filters.endDate) {
        conditions.push('l.created_at >= ? AND l.created_at <= ?');
        replacements.push(filters.startDate, filters.endDate);
      }

      if (conditions.length > 0) {
        query += ' WHERE ' + conditions.join(' AND ');
      }

      query += ' ORDER BY l.created_at DESC';

      const limit = filters.limit || 50;
      const offset = filters.offset || 0;
      query += ` LIMIT ? OFFSET ?`;
      replacements.push(limit, offset);

      const data = await this.sequelize.query(query, {
        replacements,
        raw: true,
        type: this.sequelize.QueryTypes.SELECT
      });

      return data;
    } catch (error) {
      throw new Error(`Failed to find logs with filters: ${error.message}`);
    }
  }

  async findById(id) {
    try {
      const data = await this.sequelize.query(`
        SELECT 
          l.id,
          l.admin_id,
          l.aksi,
          l.target_type,
          l.target_id,
          l.detail,
          l.ip_address,
          l.user_agent,
          l.created_at,
          u.email as admin_email,
          u.nama_depan as admin_name
        FROM log_aktivitas_admin l
        LEFT JOIN users u ON l.admin_id = u.id
        WHERE l.id = ?
      `, {
        replacements: [id],
        raw: true,
        type: this.sequelize.QueryTypes.SELECT
      });

      return data[0] || null;
    } catch (error) {
      throw new Error(`Failed to find log by id: ${error.message}`);
    }
  }

  async getLogsByAdmin(adminId, limit = 50) {
    try {
      const data = await this.sequelize.query(`
        SELECT 
          l.id,
          l.admin_id,
          l.aksi,
          l.target_type,
          l.target_id,
          l.detail,
          l.ip_address,
          l.user_agent,
          l.created_at,
          u.email as admin_email
        FROM log_aktivitas_admin l
        LEFT JOIN users u ON l.admin_id = u.id
        WHERE l.admin_id = ?
        ORDER BY l.created_at DESC 
        LIMIT ?
      `, {
        replacements: [adminId, limit],
        raw: true,
        type: this.sequelize.QueryTypes.SELECT
      });

      return data;
    } catch (error) {
      throw new Error(`Failed to get logs by admin: ${error.message}`);
    }
  }

  async findAll() {
    try {
      const logs = await this.sequelize.query(`
        SELECT 
          l.id,
          l.admin_id,
          l.aksi,
          l.target_type,
          l.target_id,
          l.detail,
          l.ip_address,
          l.user_agent,
          l.created_at,
          u.email as admin_email,
          u.nama_depan as admin_name
        FROM log_aktivitas_admin l
        LEFT JOIN users u ON l.admin_id = u.id
        ORDER BY l.created_at DESC
      `, {
        raw: true,
        type: this.sequelize.QueryTypes.SELECT
      });

      return logs;
    } catch (error) {
      console.error('❌ findAll error:', error);
      throw new Error(`Failed to get all logs: ${error.message}`);
    }
  }

  async toggleKategoriStatus(req, res) {
  try {
    const { id } = req.params;
    const { is_active } = req.body;

    // Validasi input
    if (typeof is_active !== 'boolean') {
      return res.status(400).json({
        success: false,
        message: 'is_active harus berupa boolean'
      });
    }

    const adminId = req.user?.id || req.user?.userId;

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

  async findByAdminId(adminId) {
    try {
      const data = await this.sequelize.query(`
        SELECT * FROM log_aktivitas_admin WHERE admin_id = ?
      `, {
        replacements: [adminId],
        raw: true,
        type: this.sequelize.QueryTypes.SELECT
      });

      return data;
    } catch (error) {
      throw new Error(`Failed to find logs by admin id: ${error.message}`);
    }
  }
}

module.exports = SequelizeAdminLogRepository;