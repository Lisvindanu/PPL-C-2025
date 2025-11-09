const ExcelJS = require('exceljs');
const PDFDocument = require('pdfkit');
const fs = require('fs');
const path = require('path');

class ReportGenerator {
  constructor(sequelize) {
    if (!sequelize) {
      throw new Error('sequelize is required in ReportGenerator');
    }
    this.sequelize = sequelize;
    
    // Setup reports directory
    this.reportsDir = path.join(__dirname, '../../../exports/reports');
    if (!fs.existsSync(this.reportsDir)) {
      fs.mkdirSync(this.reportsDir, { recursive: true });
    }
  }

  async generate(reportType, format, filters) {
    try {
      let data;

      if (reportType === 'users') {
        data = await this.getUserReport(filters);
      } else if (reportType === 'services') {
        data = await this.getServiceReport(filters);
      } else if (reportType === 'revenue') {
        data = await this.getRevenueReport(filters);
      } else if (reportType === 'orders') {
        data = await this.getOrderReport(filters);
      } else {
        throw new Error(Unknown report type: ${reportType});
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
        throw new Error(Unknown format: ${format});
      }
    } catch (error) {
      console.error('Error in ReportGenerator.generate:', error);
      throw error;
    }
  }

  async getUserReport(filters) {
    try {
      let query = `
        SELECT 
          CONCAT(u.nama_depan, ' ', u.nama_belakang) as nama_pengguna,
          u.email,
          u.role,
          u.is_active,
          l.detail as block_detail
        FROM users u
        LEFT JOIN log_aktivitas_admin l ON l.target_id = u.id 
          AND l.aksi = 'block_user' 
          AND l.target_type = 'user'
          AND l.id = (
            SELECT id FROM log_aktivitas_admin 
            WHERE target_id = u.id 
              AND aksi = 'block_user' 
              AND target_type = 'user'
            ORDER BY created_at DESC 
            LIMIT 1
          )
        WHERE u.role != 'admin'
      `;
      const replacements = [];

      if (filters?.role) {
        query += ' AND u.role = ?';
        replacements.push(filters.role);
      }

      if (filters?.status === 'active') {
        query += ' AND u.is_active = 1';
      } else if (filters?.status === 'blocked') {
        query += ' AND u.is_active = 0';
      }

      if (filters?.search) {
        query += ' AND (u.nama_depan LIKE ? OR u.nama_belakang LIKE ? OR u.email LIKE ?)';
        const searchPattern = %${filters.search}%;
        replacements.push(searchPattern, searchPattern, searchPattern);
      }

      query += ' ORDER BY u.created_at DESC LIMIT 1000';

      const data = await this.sequelize.query(query, {
        replacements,
        raw: true,
        type: this.sequelize.QueryTypes.SELECT
      });

      // Process data to format correctly
      return (data || []).map(row => {
        const isActive = row.is_active === 1 || row.is_active === true;
        let keterangan = '';
        
        if (!isActive && row.block_detail) {
          try {
            const detail = typeof row.block_detail === 'string' 
              ? JSON.parse(row.block_detail) 
              : row.block_detail;
            keterangan = detail.reason || '';
          } catch (e) {
            keterangan = '';
          }
        }

        return {
          nama_pengguna: row.nama_pengguna || '',
          email: row.email || '',
          role: row.role || '',
          status: isActive ? 'Aktif' : 'Diblokir',
          keterangan: keterangan,
          aksi: isActive ? 'Aktif' : 'Diblokir'
        };
      });
    } catch (error) {
      console.error('Error in getUserReport:', error);
      throw error;
    }
  }

  async getServiceReport(filters) {
    try {
      let query = `
        SELECT 
          l.judul,
          l.status as service_status,
          CONCAT(u.nama_depan, ' ', u.nama_belakang) as nama_freelancer,
          k.nama as kategori,
          log.detail as block_detail
        FROM layanan l
        LEFT JOIN users u ON l.freelancer_id = u.id
        LEFT JOIN kategori k ON l.kategori_id = k.id
        LEFT JOIN log_aktivitas_admin log ON log.target_id = l.id 
          AND log.aksi = 'block_service' 
          AND log.target_type = 'layanan'
          AND log.id = (
            SELECT id FROM log_aktivitas_admin 
            WHERE target_id = l.id 
              AND aksi = 'block_service' 
              AND target_type = 'layanan'
            ORDER BY created_at DESC 
            LIMIT 1
          )
        WHERE 1=1
      `;
      const replacements = [];

      if (filters?.status === 'active') {
        query += ' AND l.status = ?';
        replacements.push('aktif');
      } else if (filters?.status === 'blocked') {
        query += ' AND l.status = ?';
        replacements.push('nonaktif');
      }

      if (filters?.kategori) {
        query += ' AND k.id = ?';
        replacements.push(filters.kategori);
      }

      if (filters?.search) {
        query += ' AND (l.judul LIKE ? OR u.nama_depan LIKE ? OR u.nama_belakang LIKE ? OR k.nama LIKE ?)';
        const searchPattern = %${filters.search}%;
        replacements.push(searchPattern, searchPattern, searchPattern, searchPattern);
      }

      query += ' ORDER BY l.created_at DESC LIMIT 1000';

      const data = await this.sequelize.query(query, {
        replacements,
        raw: true,
        type: this.sequelize.QueryTypes.SELECT
      });

      // Process data to format correctly
      return (data || []).map(row => {
        const isActive = row.service_status === 'aktif';
        let keterangan = '';
        
        if (!isActive && row.block_detail) {
          try {
            const detail = typeof row.block_detail === 'string' 
              ? JSON.parse(row.block_detail) 
              : row.block_detail;
            keterangan = detail.reason || '';
          } catch (e) {
            keterangan = '';
          }
        }

        return {
          judul: row.judul || '',
          nama_freelancer: row.nama_freelancer || '',
          kategori: row.kategori || '',
          status: isActive ? 'Aktif' : 'Diblokir',
          aksi: isActive ? 'Aktif' : 'Diblokir',
          keterangan: keterangan
        };
      });
    } catch (error) {
      console.error('Error in getServiceReport:', error);
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

      // Define column headers based on report type
      let columns;
      if (reportType === 'users') {
        columns = ['Nama Pengguna', 'Email', 'Role', 'Status', 'Keterangan', 'Aksi'];
      } else if (reportType === 'services') {
        columns = ['Judul', 'Nama Freelancer', 'Kategori', 'Status', 'Aksi', 'Keterangan'];
      } else {
        columns = Object.keys(data[0]);
      }

      // BOM for UTF-8 to support Indonesian characters in Excel
      let csv = '\ufeff';
      csv += columns.join(',') + '\n';

      data.forEach(row => {
        const values = columns.map(col => {
          let val;
          if (reportType === 'users') {
            switch(col) {
              case 'Nama Pengguna': val = row.nama_pengguna || ''; break;
              case 'Email': val = row.email || ''; break;
              case 'Role': val = row.role === 'client' ? 'Klien' : row.role === 'freelancer' ? 'Freelancer' : row.role || ''; break;
              case 'Status': val = row.status || ''; break;
              case 'Keterangan': val = row.keterangan || ''; break;
              case 'Aksi': val = row.aksi || ''; break;
              default: val = '';
            }
          } else if (reportType === 'services') {
            switch(col) {
              case 'Judul': val = row.judul || ''; break;
              case 'Nama Freelancer': val = row.nama_freelancer || ''; break;
              case 'Kategori': val = row.kategori || ''; break;
              case 'Status': val = row.status || ''; break;
              case 'Aksi': val = row.aksi || ''; break;
              case 'Keterangan': val = row.keterangan || ''; break;
              default: val = '';
            }
          } else {
            val = row[col] || '';
          }

          if (val === null || val === undefined) return '';
          const strVal = String(val);
          return "${strVal.replace(/"/g, '""')}";
        });
        csv += values.join(',') + '\n';
      });

      const filename = report_${reportType}_${Date.now()}.csv;
      // Use reportsDir if available, otherwise use uploads directory
      const uploadsDir = this.reportsDir || path.join(__dirname, '../../../../uploads');
      if (!fs.existsSync(uploadsDir)) {
        fs.mkdirSync(uploadsDir, { recursive: true });
      }
      const filepath = path.join(uploadsDir, filename);

      fs.writeFileSync(filepath, csv, 'utf8');

      return { 
        filename, 
        filepath,
        success: true, 
        rowCount: data.length 
      };
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

      // Define columns based on report type
      let columns;
      if (reportType === 'users') {
        columns = [
          { header: 'Nama Pengguna', key: 'nama_pengguna', width: 25 },
          { header: 'Email', key: 'email', width: 30 },
          { header: 'Role', key: 'role', width: 15 },
          { header: 'Status', key: 'status', width: 15 },
          { header: 'Keterangan', key: 'keterangan', width: 40 },
          { header: 'Aksi', key: 'aksi', width: 15 }
        ];
      } else if (reportType === 'services') {
        columns = [
          { header: 'Judul', key: 'judul', width: 30 },
          { header: 'Nama Freelancer', key: 'nama_freelancer', width: 25 },
          { header: 'Kategori', key: 'kategori', width: 20 },
          { header: 'Status', key: 'status', width: 15 },
          { header: 'Aksi', key: 'aksi', width: 15 },
          { header: 'Keterangan', key: 'keterangan', width: 40 }
        ];
      } else {
        columns = Object.keys(data[0]).map(key => ({
          header: key,
          key: key,
          width: 20
        }));
      }

      worksheet.columns = columns;

      // Add data rows
      data.forEach(row => {
        const rowData = {};
        columns.forEach(col => {
          if (reportType === 'users') {
            switch(col.key) {
              case 'nama_pengguna': rowData.nama_pengguna = row.nama_pengguna || ''; break;
              case 'email': rowData.email = row.email || ''; break;
              case 'role': rowData.role = row.role === 'client' ? 'Klien' : row.role === 'freelancer' ? 'Freelancer' : row.role || ''; break;
              case 'status': rowData.status = row.status || ''; break;
              case 'keterangan': rowData.keterangan = row.keterangan || ''; break;
              case 'aksi': rowData.aksi = row.aksi || ''; break;
            }
          } else if (reportType === 'services') {
            switch(col.key) {
              case 'judul': rowData.judul = row.judul || ''; break;
              case 'nama_freelancer': rowData.nama_freelancer = row.nama_freelancer || ''; break;
              case 'kategori': rowData.kategori = row.kategori || ''; break;
              case 'status': rowData.status = row.status || ''; break;
              case 'aksi': rowData.aksi = row.aksi || ''; break;
              case 'keterangan': rowData.keterangan = row.keterangan || ''; break;
            }
          } else {
            rowData[col.key] = row[col.key] || '';
          }
        });
        worksheet.addRow(rowData);
      });

      // Style header
      worksheet.getRow(1).font = { bold: true };
      worksheet.getRow(1).fill = {
        type: 'pattern',
        pattern: 'solid',
        fgColor: { argb: 'FFE0E0E0' }
      };

      const filename = report_${reportType}_${Date.now()}.xlsx;
      // Use reportsDir if available, otherwise use uploads directory
      const uploadsDir = this.reportsDir || path.join(__dirname, '../../../../uploads');
      if (!fs.existsSync(uploadsDir)) {
        fs.mkdirSync(uploadsDir, { recursive: true });
      }
      const filepath = path.join(uploadsDir, filename);

      await workbook.xlsx.writeFile(filepath);

      return { 
        filename, 
        filepath,
        success: true, 
        rowCount: data.length 
      };
    } catch (error) {
      console.error('Error in generateExcel:', error);
      throw error;
    }
  }

  async generatePDF(data, reportType) {
    return new Promise((resolve, reject) => {
      try {
        const doc = new PDFDocument({ margin: 30, size: 'A4', layout: 'landscape' });
        const filename = report_${reportType}_${Date.now()}.pdf;
        // Use reportsDir if available, otherwise use uploads directory
        const uploadsDir = this.reportsDir || path.join(__dirname, '../../../../uploads');
        if (!fs.existsSync(uploadsDir)) {
          fs.mkdirSync(uploadsDir, { recursive: true });
        }
        const filepath = path.join(uploadsDir, filename);
        const stream = fs.createWriteStream(filepath);

        doc.on('error', reject);
        stream.on('error', reject);

        doc.pipe(stream);

        // Header
        doc.fontSize(18).font('Helvetica-Bold').text(Laporan ${reportType === 'users' ? 'Pengguna' : 'Layanan'}, 30, 30);
        doc.fontSize(9).font('Helvetica').text(Dibuat: ${new Date().toLocaleString('id-ID', { timeZone: 'Asia/Jakarta' })}, 30, 55);
        doc.fontSize(9).text(Total Data: ${data.length}, 30, 70);
        
        let y = 95;

        // Define columns based on report type
        let columns;
        let colWidths;
        if (reportType === 'users') {
          columns = ['Nama Pengguna', 'Email', 'Role', 'Status', 'Keterangan', 'Aksi'];
          // Adjust widths for landscape A4 (width ~780px)
          colWidths = [120, 150, 70, 70, 250, 70];
        } else if (reportType === 'services') {
          columns = ['Judul', 'Nama Freelancer', 'Kategori', 'Status', 'Aksi', 'Keterangan'];
          colWidths = [150, 130, 100, 70, 70, 250];
        } else {
          columns = Object.keys(data[0] || {});
          colWidths = columns.map(() => Math.floor(730 / columns.length));
        }

        const startX = 30;
        const headerHeight = 25;
        const fontSize = 7;
        const cellPadding = 4;

        // Helper function to wrap text and calculate height
        const wrapText = (text, maxWidth, fontSize) => {
          if (!text) return { lines: [''], height: fontSize + 4 };
          
          const words = text.split(' ');
          const lines = [];
          let currentLine = '';
          
          // Approximate character width (fontSize * 0.6 is a rough estimate for most fonts)
          const charWidth = fontSize * 0.6;
          const maxChars = Math.floor(maxWidth / charWidth);
          
          words.forEach(word => {
            const testLine = currentLine ? ${currentLine} ${word} : word;
            
            if (testLine.length > maxChars && currentLine) {
              lines.push(currentLine);
              currentLine = word;
            } else {
              currentLine = testLine;
            }
          });
          
          if (currentLine) {
            lines.push(currentLine);
          }
          
          const height = Math.max(fontSize + 4, lines.length * (fontSize + 2) + 4);
          return { lines, height };
        };

        // Table header
        doc.fontSize(8).font('Helvetica-Bold');
        let x = startX;
        columns.forEach((col, idx) => {
          doc.rect(x, y, colWidths[idx], headerHeight).stroke();
          doc.text(col, x + cellPadding, y + 8, { width: colWidths[idx] - (cellPadding * 2), align: 'left' });
          x += colWidths[idx];
        });
        y += headerHeight;

        // Table rows
        doc.font('Helvetica').fontSize(fontSize);
        data.forEach((row, idx) => {
          // Calculate row height for this row by checking all cells
          let maxHeight = 20;
          const cellValues = [];
          
          columns.forEach((col, colIdx) => {
            let val = '';
            if (reportType === 'users') {
              switch(col) {
                case 'Nama Pengguna': val = row.nama_pengguna || ''; break;
                case 'Email': val = row.email || ''; break;
                case 'Role': val = row.role === 'client' ? 'Klien' : row.role === 'freelancer' ? 'Freelancer' : row.role || ''; break;
                case 'Status': val = row.status || ''; break;
                case 'Keterangan': val = row.keterangan || ''; break;
                case 'Aksi': val = row.aksi || ''; break;
                default: val = '';
              }
            } else if (reportType === 'services') {
              switch(col) {
                case 'Judul': val = row.judul || ''; break;
                case 'Nama Freelancer': val = row.nama_freelancer || ''; break;
                case 'Kategori': val = row.kategori || ''; break;
                case 'Status': val = row.status || ''; break;
                case 'Aksi': val = row.aksi || ''; break;
                case 'Keterangan': val = row.keterangan || ''; break;
                default: val = '';
              }
            } else {
              val = String(row[col] || '');
            }
            
            cellValues.push(val);
            
            // Calculate text height for this cell
            const textWidth = colWidths[colIdx] - (cellPadding * 2);
            const wrapped = wrapText(val, textWidth, fontSize);
            if (wrapped.height > maxHeight) {
              maxHeight = wrapped.height;
            }
          });

          // Check if we need a new page
          if (y + maxHeight > 520) {
            doc.addPage();
            y = 30;
            
            // Redraw header on new page
            doc.fontSize(8).font('Helvetica-Bold');
            x = startX;
            columns.forEach((col, colIdx) => {
              doc.rect(x, y, colWidths[colIdx], headerHeight).stroke();
              doc.text(col, x + cellPadding, y + 8, { width: colWidths[colIdx] - (cellPadding * 2), align: 'left' });
              x += colWidths[colIdx];
            });
            y += headerHeight;
            doc.font('Helvetica').fontSize(fontSize);
            
            // Recalculate maxHeight for new page
            maxHeight = 20;
            cellValues.forEach((val, colIdx) => {
              const textWidth = colWidths[colIdx] - (cellPadding * 2);
              const wrapped = wrapText(val, textWidth, fontSize);
              if (wrapped.height > maxHeight) {
                maxHeight = wrapped.height;
              }
            });
          }

          // Draw cells with borders
          x = startX;
          columns.forEach((col, colIdx) => {
            doc.rect(x, y, colWidths[colIdx], maxHeight).stroke();
            x += colWidths[colIdx];
          });

          // Draw text in each cell with wrapping
          x = startX;
          cellValues.forEach((val, colIdx) => {
            const textWidth = colWidths[colIdx] - (cellPadding * 2);
            const wrapped = wrapText(val, textWidth, fontSize);
            
            // Draw each line of text
            let lineY = y + cellPadding;
            wrapped.lines.forEach((line, lineIdx) => {
              doc.text(line, x + cellPadding, lineY, { 
                width: textWidth, 
                align: 'left',
                ellipsis: false
              });
              lineY += fontSize + 2;
            });
            
            x += colWidths[colIdx];
          });
          
          y += maxHeight;
        });

        doc.end();
        stream.on('finish', () => {
          resolve({ 
            filename, 
            filepath,
            success: true, 
            rowCount: data.length 
          });
        });
      } catch (error) {
        console.error('Error in generatePDF:', error);
        reject(error);
      }
    });
  }
}

module.exports = ReportGenerator;