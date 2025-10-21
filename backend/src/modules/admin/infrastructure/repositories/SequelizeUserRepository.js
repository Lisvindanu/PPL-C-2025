class SequelizeUserRepository {
  constructor(sequelize) {
    this.sequelize = sequelize;
  }

  async countByRole(role = 'all') {
    try {
      let query = 'SELECT COUNT(*) as count FROM users';
      const replacements = [];

      if (role !== 'all') {
        query += ' WHERE role = ?';
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

      // Get users
      const users = await this.sequelize.query(
        'SELECT id, email, role, nama_depan, nama_belakang, is_active, created_at FROM users LIMIT ? OFFSET ?',
        {
          replacements: [limit, offset],
          raw: true,
          type: this.sequelize.QueryTypes.SELECT
        }
      );

      // Get total count
      const total = await this.sequelize.query(
        'SELECT COUNT(*) as count FROM users',
        {
          raw: true,
          type: this.sequelize.QueryTypes.SELECT
        }
      );

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
        'SELECT id, email, role, nama_depan, nama_belakang, created_at FROM users WHERE is_active = 1 ORDER BY created_at DESC',
        {
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
        'SELECT id, email, role, nama_depan, nama_belakang, created_at FROM users WHERE is_active = 0 ORDER BY created_at DESC',
        {
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