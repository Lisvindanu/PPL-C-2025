const { Op } = require('sequelize');
const PaymentModel = require('../../../payment/infrastructure/models/PaymentModel');
const UserModel = require('../../../user/infrastructure/models/UserModel');

// Define associations for payments -> users (only once at module load)
if (!PaymentModel.associations || !PaymentModel.associations.user) {
  PaymentModel.belongsTo(UserModel, {
    foreignKey: 'user_id',
    as: 'user'
  });
}

class SequelizePaymentRepository {
  constructor(sequelize) {
    this.sequelize = sequelize;
  }

  async sumSuccessful() {
    try {
      const result = await PaymentModel.sum('total_bayar', {
        where: { status: 'berhasil' }
      });
      return result || 0;
    } catch (error) {
      throw new Error(`Failed to sum successful payments: ${error.message}`);
    }
  }

  /**
   * Ambil daftar transaksi (pembayaran) untuk halaman admin dashboard.
   * Menggunakan Sequelize Model, tanpa raw SQL.
   */
  async getTransactions(filters = {}) {
    try {
      const page = parseInt(filters.page, 10) > 0 ? parseInt(filters.page, 10) : 1;
      const limit = parseInt(filters.limit, 10) > 0 ? parseInt(filters.limit, 10) : 10;
      const offset = (page - 1) * limit;

      const where = {};

      // Filter status pembayaran
      if (filters.status && filters.status !== 'all') {
        where.status = filters.status;
      }

      // Filter payment gateway
      if (filters.paymentGateway && filters.paymentGateway !== 'all') {
        where.payment_gateway = filters.paymentGateway;
      }

      // Filter tanggal (berdasarkan dibayar_pada jika ada, fallback ke created_at)
      if (filters.startDate && filters.endDate) {
        const start = new Date(filters.startDate);
        const end = new Date(filters.endDate);

        if (!isNaN(start.getTime()) && !isNaN(end.getTime())) {
          where[Op.or] = [
            { dibayar_pada: { [Op.between]: [start, end] } },
            {
              dibayar_pada: { [Op.is]: null },
              created_at: { [Op.between]: [start, end] }
            }
          ];
        }
      }

      // Filter pencarian user (email / nama)
      const includeUserWhere = {};
      if (filters.search && typeof filters.search === 'string') {
        const term = `%${filters.search.trim()}%`;
        includeUserWhere[Op.or] = [
          { email: { [Op.like]: term } },
          { nama_depan: { [Op.like]: term } },
          { nama_belakang: { [Op.like]: term } }
        ];
      }

      // Sorting
      const sortBy = filters.sortBy || 'created_at';
      const sortOrder = (filters.sortOrder || 'DESC').toUpperCase() === 'ASC' ? 'ASC' : 'DESC';

      const { rows, count } = await PaymentModel.findAndCountAll({
        where,
        include: [
          {
            model: UserModel,
            as: 'user',
            attributes: ['id', 'email', 'nama_depan', 'nama_belakang'],
            where: Object.keys(includeUserWhere).length ? includeUserWhere : undefined,
            required: !!Object.keys(includeUserWhere).length
          }
        ],
        order: [[sortBy, sortOrder]],
        limit,
        offset
      });

      // Kembalikan data plain object agar mudah dipakai di layer atas / FE
      const data = rows.map((payment) => {
        const p = payment.get({ plain: true });
        return {
          id: p.id,
          pesanan_id: p.pesanan_id,
          user_id: p.user_id,
          transaction_id: p.transaction_id,
          external_id: p.external_id,
          jumlah: p.jumlah,
          biaya_platform: p.biaya_platform,
          biaya_payment_gateway: p.biaya_payment_gateway,
          total_bayar: p.total_bayar,
          metode_pembayaran: p.metode_pembayaran,
          channel: p.channel,
          payment_gateway: p.payment_gateway,
          payment_url: p.payment_url,
          status: p.status,
          nomor_invoice: p.nomor_invoice,
          invoice_url: p.invoice_url,
          dibayar_pada: p.dibayar_pada,
          kadaluarsa_pada: p.kadaluarsa_pada,
          created_at: p.created_at,
          updated_at: p.updated_at,
          user: p.user || null
        };
      });

      return {
        data,
        page,
        limit,
        total: count,
        totalPages: Math.ceil(count / limit)
      };
    } catch (error) {
      throw new Error(`Failed to get transactions: ${error.message}`);
    }
  }

  async getFailedRecent(limit = 10) {
    try {
      const result = await this.sequelize.query(
        'SELECT p.*, u.email, u.nama_depan, u.nama_belakang FROM pembayaran p LEFT JOIN users u ON p.user_id = u.id WHERE p.status = "gagal" ORDER BY p.created_at DESC LIMIT ?',
        {
          replacements: [limit],
          raw: true,
          type: this.sequelize.QueryTypes.SELECT
        }
      );
      return result;
    } catch (error) {
      throw new Error(`Failed to get failed payments: ${error.message}`);
    }
  }

  async getMultipleFailedByUser(limit = 5) {
    try {
      const result = await this.sequelize.query(`
        SELECT 
          p.user_id,
          COUNT(*) as failed_count,
          MAX(p.created_at) as last_failed,
          u.email,
          u.nama_depan,
          u.nama_belakang
        FROM pembayaran p
        LEFT JOIN users u ON p.user_id = u.id
        WHERE p.status = "gagal"
        GROUP BY p.user_id
        HAVING COUNT(*) >= ?
        ORDER BY failed_count DESC
        LIMIT 10
      `, {
        replacements: [limit],
        raw: true,
        type: this.sequelize.QueryTypes.SELECT
      });
      return result;
    } catch (error) {
      throw new Error(`Failed to get multiple failed payments: ${error.message}`);
    }
  }
}

module.exports = SequelizePaymentRepository;
