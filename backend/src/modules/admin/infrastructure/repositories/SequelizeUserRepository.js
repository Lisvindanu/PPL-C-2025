class SequelizeUserRepository {
  constructor(sequelize) {
    this.sequelize = sequelize;
  }

  async countByRole(role = 'all') {
    try {
      let query = 'SELECT COUNT(*) as count FROM users WHERE role != ?';
      const replacements = ['admin'];

      if (role !== 'all') {
        query += ' AND role = ?';
        replacements.push(role);
      }

      const result = await this.sequelize.query(query, {
        replacements,
        raw: true,
        type: this.sequelize.QueryTypes.SELECT
      });

      return result[0]?.count || 0;
    } catch (error) {
      throw new Error(`Failed to count users: ${error.message}`);
    }
  }

  async findWithFilters(filters = {}) {
    try {
      const limit = filters.limit || 10;
      const offset = ((filters.page || 1) - 1) * limit;

      // Build query with filters
      let query = 'SELECT id, email, role, nama_depan, nama_belakang, is_active, created_at FROM users WHERE role != ?';
      const replacements = ['admin'];

      // Filter by role
      if (filters.role && filters.role !== 'all') {
        query += ' AND role = ?';
        replacements.push(filters.role);
      }

      // Filter by status
      if (filters.status && filters.status !== 'all') {
        if (filters.status === 'active') {
          query += ' AND is_active = 1';
        } else if (filters.status === 'blocked') {
          query += ' AND is_active = 0';
        }
      }

      // Get total count with same filters
      let countQuery = 'SELECT COUNT(*) as count FROM users WHERE role != ?';
      const countReplacements = ['admin'];

      if (filters.role && filters.role !== 'all') {
        countQuery += ' AND role = ?';
        countReplacements.push(filters.role);
      }

      if (filters.status && filters.status !== 'all') {
        if (filters.status === 'active') {
          countQuery += ' AND is_active = 1';
        } else if (filters.status === 'blocked') {
          countQuery += ' AND is_active = 0';
        }
      }

      // Add pagination
      query += ' ORDER BY created_at DESC LIMIT ? OFFSET ?';
      replacements.push(limit, offset);

      // Get users
      const users = await this.sequelize.query(query, {
        replacements,
        raw: true,
        type: this.sequelize.QueryTypes.SELECT
      });

      // Get total count
      const total = await this.sequelize.query(countQuery, {
        replacements: countReplacements,
        raw: true,
        type: this.sequelize.QueryTypes.SELECT
      });

      return {
        data: users || [],
        page: filters.page || 1,
        limit,
        total: total[0]?.count || 0
      };
    } catch (error) {
      console.error('findWithFilters error:', error);
      throw new Error(`Failed to find users: ${error.message}`);
    }
  }

  async findById(id) {
    try {
      const user = await this.sequelize.query(
        'SELECT id, email, role, nama_depan, nama_belakang, is_active, created_at FROM users WHERE id = ?',
        {
          replacements: [id],
          raw: true,
          type: this.sequelize.QueryTypes.SELECT
        }
      );

      return user[0] || null;
    } catch (error) {
      throw new Error(`Failed to find user by id: ${error.message}`);
    }
  }

  async updateUserStatus(userId, isActive) {
    try {
      await this.sequelize.query(
        'UPDATE users SET is_active = ?, updated_at = NOW() WHERE id = ?',
        {
          replacements: [isActive ? 1 : 0, userId]
        }
      );
      return true;
    } catch (error) {
      throw new Error(`Failed to update user status: ${error.message}`);
    }
  }

  async blockUser(userId) {
    try {
      await this.sequelize.query(
        'UPDATE users SET is_active = 0, updated_at = NOW() WHERE id = ?',
        {
          replacements: [userId]
        }
      );
      return true;
    } catch (error) {
      throw new Error(`Failed to block user: ${error.message}`);
    }
  }

  async unblockUser(userId) {
    try {
      await this.sequelize.query(
        'UPDATE users SET is_active = 1, updated_at = NOW() WHERE id = ?',
        {
          replacements: [userId]
        }
      );
      return true;
    } catch (error) {
      throw new Error(`Failed to unblock user: ${error.message}`);
    }
  }

  async findByEmail(email) {
    try {
      const user = await this.sequelize.query(
        'SELECT * FROM users WHERE email = ?',
        {
          replacements: [email],
          raw: true,
          type: this.sequelize.QueryTypes.SELECT
        }
      );

      return user[0] || null;
    } catch (error) {
      throw new Error(`Failed to find user by email: ${error.message}`);
    }
  }

  async getUsersByRole(role) {
    try {
      const users = await this.sequelize.query(
        'SELECT id, email, role, nama_depan, nama_belakang, is_active, created_at FROM users WHERE role = ?',
        {
          replacements: [role],
          raw: true,
          type: this.sequelize.QueryTypes.SELECT
        }
      );

      return users;
    } catch (error) {
      throw new Error(`Failed to get users by role: ${error.message}`);
    }
  }

  async getActiveUsers() {
    try {
      const users = await this.sequelize.query(
        'SELECT id, email, role, nama_depan, nama_belakang, created_at FROM users WHERE is_active = 1 AND role != ? ORDER BY created_at DESC',
        {
          replacements: ['admin'],
          raw: true,
          type: this.sequelize.QueryTypes.SELECT
        }
      );

      return users;
    } catch (error) {
      throw new Error(`Failed to get active users: ${error.message}`);
    }
  }

  async getInactiveUsers() {
    try {
      const users = await this.sequelize.query(
        'SELECT id, email, role, nama_depan, nama_belakang, created_at FROM users WHERE is_active = 0 AND role != ? ORDER BY created_at DESC',
        {
          replacements: ['admin'],
          raw: true,
          type: this.sequelize.QueryTypes.SELECT
        }
      );

      return users;
    } catch (error) {
      throw new Error(`Failed to get inactive users: ${error.message}`);
    }
  }
}

module.exports = SequelizeUserRepository; 