const { sequelize } = require('../../../../shared/database/connection');
const { v4: uuidv4 } = require('uuid');
class SequelizeAdminLogRepository {
  constructor(sequelize) {
    this.sequelize = sequelize;
  }

 // Install: npm install uuid

async save(log) {
  try {
    const logId = uuidv4(); // Generate UUID di JavaScript
    
    const result = await this.sequelize.query(`
      INSERT INTO log_aktivitas_admin 
      (id, admin_id, aksi, target_type, target_id, detail, ip_address, user_agent, created_at)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, NOW())
    `, {
      replacements: [
        logId,              // ← UUID dari JavaScript
        log.admin_id,       
        log.aksi,           
        log.target_type,    
        log.target_id,      
        JSON.stringify(log.detail || {}),
        log.ip_address,     
        log.user_agent      
      ]
    });
    return result;
  } catch (error) {
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
          u.email as admin_email
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

      if (conditions.length > 0) {
        query += ' WHERE ' + conditions.join(' AND ');
      }

      query += ' ORDER BY l.created_at DESC LIMIT ? OFFSET ?';
      replacements.push(limit, offset);

      const logs = await this.sequelize.query(query, {
        replacements,
        raw: true,
        type: this.sequelize.QueryTypes.SELECT
      });

      const countResult = await this.sequelize.query(
        'SELECT COUNT(*) as total FROM log_aktivitas_admin',
        { raw: true, type: this.sequelize.QueryTypes.SELECT }
      );

      return {
        data: logs || [],
        limit,
        offset,
        total: countResult[0]?.total || 0
      };
    } catch (error) {
      console.error('getLogs error:', error);
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
}

module.exports = SequelizeAdminLogRepository;