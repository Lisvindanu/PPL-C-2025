const ExcelJS = require('exceljs');
const PDFDocument = require('pdfkit');
const fs = require('fs');

class ReportGenerator {
  constructor(sequelize) {
    if (!sequelize) {
      throw new Error('sequelize is required in ReportGenerator');
    }
    this.sequelize = sequelize;
  }

  async generate(reportType, format, filters) {
    try {
      let data;

      if (reportType === 'users') {
        data = await this.getUserReport(filters);
      } else if (reportType === 'revenue') {
        data = await this.getRevenueReport(filters);
      } else if (reportType === 'orders') {
        data = await this.getOrderReport(filters);
      } else {
        throw new Error(`Unknown report type: ${reportType}`);
      }

      if (!data || data.length === 0) {
        throw new Error('No data available for report');
      }

      if (format === 'csv') {
        return await this.generateCSV(data, reportType);
      } else if (format === 'pdf') {
        return await this.generatePDF(data, reportType);
      } else if (format === 'excel') {
        return await this.generateExcel(data, reportType);
      } else {
        throw new Error(`Unknown format: ${format}`);
      }
    } catch (error) {
      console.error('Error in ReportGenerator.generate:', error);
      throw error;
    }
  }

  async getUserReport(filters) {
    try {
      let query = 'SELECT id, email, nama_depan, nama_belakang, role, created_at FROM users WHERE 1=1';
      const replacements = [];

      if (filters?.role) {
        query += ' AND role = ?';
        replacements.push(filters.role);
      }

      if (filters?.status === 'active') {
        query += ' AND is_active = 1';
      } else if (filters?.status === 'inactive') {
        query += ' AND is_active = 0';
      }

      query += ' ORDER BY created_at DESC LIMIT 1000';

      const data = await this.sequelize.query(query, {
        replacements,
        raw: true,
        type: this.sequelize.QueryTypes.SELECT
      });

      return data || [];
    } catch (error) {
      console.error('Error in getUserReport:', error);
      throw error;
    }
  }

  async getRevenueReport(filters) {
    try {
      let query = 'SELECT id, transaction_id, jumlah, biaya_platform, total_bayar, created_at FROM pembayaran WHERE status = ?';
      const replacements = ['berhasil'];

      if (filters?.startDate && filters?.endDate) {
        query += ' AND created_at >= ? AND created_at <= ?';
        replacements.push(filters.startDate, filters.endDate);
      }

      query += ' ORDER BY created_at DESC LIMIT 1000';

      const data = await this.sequelize.query(query, {
        replacements,
        raw: true,
        type: this.sequelize.QueryTypes.SELECT
      });

      return data || [];
    } catch (error) {
      console.error('Error in getRevenueReport:', error);
      throw error;
    }
  }

  async getOrderReport(filters) {
    try {
      let query = 'SELECT id, nomor_pesanan, judul, status, harga, created_at FROM pesanan WHERE 1=1';
      const replacements = [];

      if (filters?.status) {
        query += ' AND status = ?';
        replacements.push(filters.status);
      }

      query += ' ORDER BY created_at DESC LIMIT 1000';

      const data = await this.sequelize.query(query, {
        replacements,
        raw: true,
        type: this.sequelize.QueryTypes.SELECT
      });

      return data || [];
    } catch (error) {
      console.error('Error in getOrderReport:', error);
      throw error;
    }
  }

  async generateCSV(data, reportType) {
    try {
      if (!data || data.length === 0) {
        throw new Error('No data to generate CSV');
      }

      const columns = Object.keys(data[0]);
      let csv = columns.join(',') + '\n';

      data.forEach(row => {
        const values = columns.map(col => {
          const val = row[col];
          if (val === null || val === undefined) return '';
          return typeof val === 'string' ? `"${val.replace(/"/g, '""')}"` : val;
        });
        csv += values.join(',') + '\n';
      });

      const filename = `report_${reportType}_${Date.now()}.csv`;
      fs.writeFileSync(filename, csv);

      return { filename, success: true, rowCount: data.length };
    } catch (error) {
      console.error('Error in generateCSV:', error);
      throw error;
    }
  }

  async generateExcel(data, reportType) {
    try {
      if (!data || data.length === 0) {
        throw new Error('No data to generate Excel');
      }

      const workbook = new ExcelJS.Workbook();
      const worksheet = workbook.addWorksheet('Report');

      worksheet.columns = Object.keys(data[0]).map(key => ({
        header: key,
        key: key,
      }));

      data.forEach(row => worksheet.addRow(row));

      const filename = `report_${reportType}_${Date.now()}.xlsx`;
      await workbook.xlsx.writeFile(filename);

      return { filename, success: true, rowCount: data.length };
    } catch (error) {
      console.error('Error in generateExcel:', error);
      throw error;
    }
  }

  async generatePDF(data, reportType) {
    return new Promise((resolve, reject) => {
      try {
        const doc = new PDFDocument();
        const filename = `report_${reportType}_${Date.now()}.pdf`;
        const stream = fs.createWriteStream(filename);

        doc.on('error', reject);
        stream.on('error', reject);

        doc.pipe(stream);
        doc.fontSize(20).text(`Report: ${reportType}`, 100, 100);
        doc.fontSize(12).text(`Generated: ${new Date().toISOString()}`);
        doc.fontSize(10).text(`Total Records: ${data.length}`);

        if (data && data.length > 0) {
          doc.moveDown();
          data.slice(0, 50).forEach((row, idx) => {
            doc.fontSize(9).text(`${idx + 1}. ${JSON.stringify(row)}`);
          });
          if (data.length > 50) {
            doc.fontSize(10).text(`... and ${data.length - 50} more records`);
          }
        }

        doc.end();
        stream.on('finish', () => {
          resolve({ filename, success: true, rowCount: data.length });
        });
      } catch (error) {
        console.error('Error in generatePDF:', error);
        reject(error);
      }
    });
  }
}

module.exports = ReportGenerator;