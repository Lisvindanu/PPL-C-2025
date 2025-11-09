const { v4: uuidv4 } = require('uuid');

class SequelizeAdminLogRepository {
  constructor(sequelize) {
    this.sequelize = sequelize;
  }

  async save(log) {
    try {
      const logId = uuidv4(); // Generate UUID di JavaScript
      
      // Map property names from AdminActivityLog entity to database column names
      const adminId = log.adminId || log.admin_id;
      const action = log.action || log.aksi;
      const targetType = log.targetType || log.target_type;
      const targetId = log.targetId || log.target_id || null;
      const detail = log.detail || {};
      const ipAddress = log.ipAddress || log.ip_address || null;
      const userAgent = log.userAgent || log.user_agent || null;
      
      // Validate required fields
      if (!adminId) {
        throw new Error('adminId is required');
      }
      if (!action) {
        throw new Error('action is required');
      }
      if (!targetType) {
        throw new Error('targetType is required');
      }
      
      // Verify admin_id exists in users table before inserting
      // This prevents foreign key constraint errors
      const userCheck = await this.sequelize.query(`
        SELECT id FROM users WHERE id = ? LIMIT 1
      `, {
        replacements: [adminId],
        raw: true,
        type: this.sequelize.QueryTypes.SELECT
      });
      
      if (!userCheck || userCheck.length === 0) {
        console.warn(Admin ID ${adminId} not found in users table. Skipping log entry.);
        // Return a mock result instead of throwing error
        // This allows the report export to continue even if logging fails
        return { success: false, message: 'Admin user not found, log not saved' };
      }
      
      const result = await this.sequelize.query(`
        INSERT INTO log_aktivitas_admin 
        (id, admin_id, aksi, target_type, target_id, detail, ip_address, user_agent, created_at)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, NOW())
      `, {
        replacements: [
          logId,              // 1. id
          adminId,            // 2. admin_id
          action,             // 3. aksi
          targetType,         // 4. target_type
          targetId,           // 5. target_id
          JSON.stringify(detail), // 6. detail
          ipAddress,          // 7. ip_address
          userAgent           // 8. user_agent
        ]
      });
      
      return { ...log, id: logId };
    } catch (error) {
      // If it's a foreign key constraint error, log warning but don't fail the operation
      if (error.message && error.message.includes('foreign key constraint')) {
        console.warn(Failed to save log due to foreign key constraint: ${error.message});
        return { success: false, message: 'Log not saved due to foreign key constraint', error: error.message };
      }
      console.error('Error saving admin log:', error);
      throw new Error(Failed to save log: ${error.message});
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
      query += whereClause + ' ORDER BY l.created_at DESC LIMIT ? OFFSET ?';
      replacements.push(limit, offset);

      const logs = await this.sequelize.query(query, {
        replacements,
        raw: true,
        type: this.sequelize.QueryTypes.SELECT
      });

      return logs;
    } catch (error) {
      console.error('❌ getLogs error:', error);
      throw new Error(Failed to get logs: ${error.message});
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
      throw new Error(Failed to find logs with filters: ${error.message});
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
      throw new Error(Failed to find log by id: ${error.message});
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
      throw new Error(Failed to get logs by admin: ${error.message});
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
      throw new Error(Failed to get all logs: ${error.message});
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
      throw new Error(Failed to find logs by admin id: ${error.message});
    }
  }

  async getBlockLogByUserId(userId) {
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
          u.nama_depan as admin_nama_depan,
          u.nama_belakang as admin_nama_belakang
        FROM log_aktivitas_admin l
        LEFT JOIN users u ON l.admin_id = u.id
        WHERE l.target_id = ? AND l.aksi = 'block_user' AND l.target_type = 'user'
        ORDER BY l.created_at DESC 
        LIMIT 1
      `, {
        replacements: [userId],
        raw: true,
        type: this.sequelize.QueryTypes.SELECT
      });

      return data[0] || null;
    } catch (error) {
      throw new Error(Failed to get block log by user id: ${error.message});
    }
  }

  async getBlockLogByServiceId(serviceId) {
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
          u.nama_depan as admin_nama_depan,
          u.nama_belakang as admin_nama_belakang
        FROM log_aktivitas_admin l
        LEFT JOIN users u ON l.admin_id = u.id
        WHERE l.target_id = ? AND l.aksi = 'block_service' AND l.target_type = 'layanan'
        ORDER BY l.created_at DESC 
        LIMIT 1
      `, {
        replacements: [serviceId],
        raw: true,
        type: this.sequelize.QueryTypes.SELECT
      });

      return data[0] || null;
    } catch (error) {
      throw new Error(Failed to get block log by service id: ${error.message});
    }
  }
}

module.exports = SequelizeAdminLogRepository;