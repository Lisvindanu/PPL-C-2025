const ExcelJS = require('exceljs');
const PDFDocument = require('pdfkit');
const fs = require('fs');
const path = require('path');

class ReportGenerator {
  constructor(sequelize, adminLogService) {
    if (!sequelize) {
      throw new Error('sequelize is required in ReportGenerator');
    }
    this.sequelize = sequelize;
    this.adminLogService = adminLogService;
    
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
      // Use adminLogService.getUserList() to get all users (same as API)
      // Fetch all pages to get complete data
      const allUsers = [];
      let page = 1;
      const limit = 100; // Fetch 100 per page
      let hasMore = true;

      while (hasMore) {
        const apiFilters = {
          role: filters?.role || null,
          status: filters?.status || 'all',
          page: page,
          limit: limit
        };

        const result = await this.adminLogService.getUserList(apiFilters);
        
        if (result.data && result.data.length > 0) {
          allUsers.push(...result.data);
          
          // Check if there are more pages
          const totalPages = Math.ceil(result.total / limit);
          hasMore = page < totalPages;
          page++;
        } else {
          hasMore = false;
        }
      }

      // Get block reasons for blocked users
      const userIds = allUsers.map(u => u.id);
      let blockReasons = {};
      
      if (userIds.length > 0) {
        const blockQuery = `
          SELECT 
            l.target_id,
            l.detail,
            l.created_at as blocked_at
          FROM log_aktivitas_admin l
          WHERE l.target_type = 'user' 
            AND l.aksi = 'block_user'
            AND l.target_id IN (${userIds.map(() => '?').join(',')})
        `;
        
        const blockLogs = await this.sequelize.query(blockQuery, {
          replacements: userIds,
          raw: true,
          type: this.sequelize.QueryTypes.SELECT
        });

        blockLogs.forEach(log => {
          const detail = typeof log.detail === 'string' ? JSON.parse(log.detail) : log.detail;
          blockReasons[log.target_id] = detail?.reason || 'Tidak ada alasan tersedia';
        });
      }

      // Format data for report
      return allUsers.map(user => {
        const namaPengguna = (user.nama_depan && user.nama_belakang)
          ? `${user.nama_depan} ${user.nama_belakang}`.trim()
          : user.nama_depan || user.nama_belakang || user.email || 'N/A';
        const status = user.is_active === 1 || user.is_active === true ? 'Aktif' : 'Diblokir';
        const keterangan = blockReasons[user.id] || (status === 'Aktif' ? '' : 'Tidak ada alasan tersedia');

        return {
          'Nama Pengguna': namaPengguna,
          'Email': user.email || '-',
          'Role': user.role || '-',
          'Status': status,
          'Keterangan': keterangan
        };
      });
    } catch (error) {
      console.error('Error in getUserReport:', error);
      throw error;
    }
  }

  async getServiceReport(filters) {
    try {
      // Use same query as getServices in AdminController
      // Fetch all pages to get complete data
      const allServices = [];
      let page = 1;
      const limit = 100; // Fetch 100 per page
      let hasMore = true;

      while (hasMore) {
        const offset = (page - 1) * limit;
        
        let query = `
          SELECT 
            l.id,
            l.judul,
            l.status,
            l.created_at,
            u.id as freelancer_user_id,
            u.email as freelancer_email,
            u.nama_depan as freelancer_nama_depan,
            u.nama_belakang as freelancer_nama_belakang,
            k.nama as kategori_nama
          FROM layanan l
          LEFT JOIN users u ON l.freelancer_id = u.id
          LEFT JOIN kategori k ON l.kategori_id = k.id
          WHERE 1=1
        `;
        
        const replacements = [];
        
        if (filters?.status && filters.status !== 'all') {
          query += ' AND l.status = ?';
          replacements.push(filters.status);
        }
        
        if (filters?.kategori && filters.kategori !== 'all') {
          query += ' AND l.kategori_id = ?';
          replacements.push(filters.kategori);
        }
        
        if (filters?.search) {
          query += ' AND l.judul LIKE ?';
          replacements.push(`%${filters.search}%`);
        }
        
        // Get total count
        const countQuery = query.replace(/SELECT[\s\S]*?FROM/, 'SELECT COUNT(*) as total FROM');
        const [countResult] = await this.sequelize.query(countQuery, {
          replacements,
          raw: true,
          type: this.sequelize.QueryTypes.SELECT
        });
        
        // Add pagination
        query += ' ORDER BY l.created_at DESC LIMIT ? OFFSET ?';
        replacements.push(limit, offset);
        
        const services = await this.sequelize.query(query, {
          replacements,
          raw: true,
          type: this.sequelize.QueryTypes.SELECT
        });
        
        if (services && services.length > 0) {
          allServices.push(...services);
          
          // Check if there are more pages
          const totalPages = Math.ceil(countResult.total / limit);
          hasMore = page < totalPages;
          page++;
        } else {
          hasMore = false;
        }
      }

      // Get block reasons for blocked services
      const serviceIds = allServices.map(s => s.id);
      let blockReasons = {};
      
      if (serviceIds.length > 0) {
        const blockQuery = `
          SELECT 
            l.target_id,
            l.detail,
            l.created_at as blocked_at
          FROM log_aktivitas_admin l
          WHERE l.target_type = 'layanan' 
            AND l.aksi = 'block_service'
            AND l.target_id IN (${serviceIds.map(() => '?').join(',')})
        `;
        
        const blockLogs = await this.sequelize.query(blockQuery, {
          replacements: serviceIds,
          raw: true,
          type: this.sequelize.QueryTypes.SELECT
        });

        blockLogs.forEach(log => {
          const detail = typeof log.detail === 'string' ? JSON.parse(log.detail) : log.detail;
          blockReasons[log.target_id] = detail?.reason || 'Tidak ada alasan tersedia';
        });
      }

      // Format data for report
      return allServices.map(service => {
        const namaFreelancer = service.freelancer_nama_depan && service.freelancer_nama_belakang
          ? `${service.freelancer_nama_depan} ${service.freelancer_nama_belakang}`.trim()
          : service.freelancer_email || 'N/A';
        const status = service.status === 'aktif' ? 'Aktif' : service.status === 'nonaktif' ? 'Diblokir' : service.status || 'N/A';
        const keterangan = blockReasons[service.id] || (status === 'Aktif' ? '' : 'Tidak ada alasan tersedia');

        return {
          'Judul': service.judul || '-',
          'Nama Freelancer': namaFreelancer,
          'Kategori': service.kategori_nama || '-',
          'Status': status,
          'Keterangan': keterangan
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

      const columns = Object.keys(data[0]);
      
      // Use BOM for UTF-8 to support Indonesian characters in Excel
      let csv = '\ufeff';
      csv += columns.join(',') + '\n';

      data.forEach(row => {
        const values = columns.map(col => {
          const val = row[col];
          if (val === null || val === undefined) return '';
          const strVal = String(val);
          // Escape quotes and wrap in quotes if contains comma, newline, or quote
          if (strVal.includes(',') || strVal.includes('\n') || strVal.includes('"')) {
            return `"${strVal.replace(/"/g, '""')}"`;
          }
          return strVal;
        });
        csv += values.join(',') + '\n';
      });

      const filename = `report_${reportType}_${Date.now()}.csv`;
      const filepath = path.join(this.reportsDir, filename);
      
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

      const columns = Object.keys(data[0]);
      
      // Set column headers with styling
      worksheet.columns = columns.map(key => ({
        header: key,
        key: key,
        width: 20
      }));

      // Style header row
      worksheet.getRow(1).font = { bold: true };
      worksheet.getRow(1).fill = {
        type: 'pattern',
        pattern: 'solid',
        fgColor: { argb: 'FFE0E0E0' }
      };
      worksheet.getRow(1).alignment = { vertical: 'middle', horizontal: 'center' };

      // Add data rows
      data.forEach(row => {
        const excelRow = worksheet.addRow(row);
        excelRow.alignment = { vertical: 'middle', horizontal: 'left' };
      });

      // Auto-fit columns
      worksheet.columns.forEach(column => {
        let maxLength = 0;
        column.eachCell({ includeEmpty: false }, (cell) => {
          const columnLength = cell.value ? cell.value.toString().length : 10;
          if (columnLength > maxLength) {
            maxLength = columnLength;
          }
        });
        column.width = Math.min(Math.max(maxLength + 2, 15), 50);
      });

      const filename = `report_${reportType}_${Date.now()}.xlsx`;
      const filepath = path.join(this.reportsDir, filename);
      
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
        const doc = new PDFDocument({ margin: 50, size: 'A4' });
        const filename = `report_${reportType}_${Date.now()}.pdf`;
        const filepath = path.join(this.reportsDir, filename);
        const stream = fs.createWriteStream(filepath);

        doc.on('error', reject);
        stream.on('error', reject);

        doc.pipe(stream);

        // Header
        doc.fontSize(20).font('Helvetica-Bold').text(
          `Laporan ${reportType === 'users' ? 'Pengguna' : reportType === 'services' ? 'Layanan' : reportType}`,
          50,
          50
        );
        doc.fontSize(10).font('Helvetica').text(
          `Dibuat pada: ${new Date().toLocaleString('id-ID')}`,
          50,
          80
        );
        doc.fontSize(10).text(`Total Data: ${data.length}`, 50, 95);
        
        // Draw line
        doc.moveTo(50, 110).lineTo(545, 110).stroke();

        if (data && data.length > 0) {
          const columns = Object.keys(data[0]);
          const columnWidths = this.calculateColumnWidths(columns, data, doc);
          let startY = 130;
          const rowHeight = 20;
          const pageHeight = 750;
          let currentY = startY;
          const tableStartX = 50;
          const tableEndX = 545;

          // Draw table with borders for each cell
          const drawTableWithBorders = (startYPos, isHeader = false, rowData = null) => {
            const cellPadding = 5;
            let xPos = tableStartX;
            
            // Draw header row with borders
            if (isHeader) {
              doc.fontSize(9).font('Helvetica-Bold');
              
              // Draw top border of header
              doc.moveTo(xPos, startYPos).lineTo(tableEndX, startYPos).stroke();
              
              columns.forEach((col, idx) => {
                const cellWidth = columnWidths[idx];
                const cellRight = xPos + cellWidth;
                
                // Draw vertical borders
                doc.moveTo(xPos, startYPos).lineTo(xPos, startYPos + rowHeight).stroke();
                if (idx === columns.length - 1) {
                  doc.moveTo(cellRight, startYPos).lineTo(cellRight, startYPos + rowHeight).stroke();
                }
                
                // Draw text in cell
                doc.text(col, xPos + cellPadding, startYPos + 5, { 
                  width: cellWidth - (cellPadding * 2), 
                  align: 'left' 
                });
                
                xPos = cellRight;
              });
              
              // Draw bottom border of header
              doc.moveTo(tableStartX, startYPos + rowHeight).lineTo(tableEndX, startYPos + rowHeight).stroke();
            } else {
              // Draw data rows with borders
              doc.fontSize(8).font('Helvetica');
              
              columns.forEach((col, idx) => {
                const cellWidth = columnWidths[idx];
                const cellRight = xPos + cellWidth;
                
                // Draw vertical borders
                doc.moveTo(xPos, startYPos).lineTo(xPos, startYPos + rowHeight).stroke();
                if (idx === columns.length - 1) {
                  doc.moveTo(cellRight, startYPos).lineTo(cellRight, startYPos + rowHeight).stroke();
                }
                
                // Draw text in cell
                const cellValue = String(rowData[col] || '-');
                const displayValue = cellValue.length > 40 ? cellValue.substring(0, 37) + '...' : cellValue;
                doc.text(displayValue, xPos + cellPadding, startYPos + 5, { 
                  width: cellWidth - (cellPadding * 2), 
                  align: 'left' 
                });
                
                xPos = cellRight;
              });
              
              // Draw bottom border of row
              doc.moveTo(tableStartX, startYPos + rowHeight).lineTo(tableEndX, startYPos + rowHeight).stroke();
            }
          };

          // Draw header
          drawTableWithBorders(currentY, true);
          currentY += rowHeight;

          // Draw data rows
          data.forEach((row, rowIdx) => {
            // Check if we need a new page
            if (currentY + rowHeight > pageHeight) {
              doc.addPage();
              currentY = 50;
              
              // Redraw header on new page
              drawTableWithBorders(currentY, true);
              currentY += rowHeight;
            }

            // Draw row data with borders
            drawTableWithBorders(currentY, false, row);
            currentY += rowHeight;
          });
        }

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

  calculateColumnWidths(columns, data, doc) {
    const totalWidth = 495; // 545 - 50 (margins)
    const minWidth = 60;
    const maxWidth = 150;
    
    // Calculate width for each column based on content
    const widths = columns.map(col => {
      const headerWidth = doc.widthOfString(col, { fontSize: 9 });
      const maxDataWidth = Math.max(
        ...data.slice(0, 100).map(row => {
          const val = String(row[col] || '-');
          const displayVal = val.length > 30 ? val.substring(0, 27) + '...' : val;
          return doc.widthOfString(displayVal, { fontSize: 8 });
        })
      );
      return Math.max(minWidth, Math.min(maxWidth, Math.max(headerWidth, maxDataWidth) + 10));
    });

    // Normalize widths to fit total width
    const totalCalculated = widths.reduce((sum, w) => sum + w, 0);
    const ratio = totalWidth / totalCalculated;
    
    return widths.map(w => Math.floor(w * ratio));
  }
}

module.exports = ReportGenerator;