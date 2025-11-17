class ExportKategoriReport {
  constructor(kategoriRepository, layananRepository, pesananRepository, reportGenerator) {
    this.kategoriRepository = kategoriRepository;
    this.layananRepository = layananRepository;
    this.pesananRepository = pesananRepository;
    this.reportGenerator = reportGenerator;
  }

  async execute(format = 'csv', filters = {}) {
    // Validate format
    const validFormats = ['csv', 'excel', 'pdf'];
    if (!validFormats.includes(format.toLowerCase())) {
      throw new Error('Format tidak valid. Gunakan: csv, excel, atau pdf');
    }

    // Get statistics data
    const kategoriList = await this.kategoriRepository.findAll();

    const dataPromises = kategoriList.map(async (kategori) => {
      const totalLayanan = await this.layananRepository.countByKategori(kategori.id_kategori);
      const activeLayanan = await this.layananRepository.countActiveByKategori(kategori.id_kategori);
      const totalPesanan = await this.pesananRepository.countByKategori(kategori.id_kategori);
      const avgRating = await this.layananRepository.getAverageRatingByKategori(kategori.id_kategori);
      const totalRevenue = await this.pesananRepository.getTotalRevenueByKategori(kategori.id_kategori);

      return {
        'Nama Kategori': kategori.nama,
        'Slug': kategori.slug,
        'Status': kategori.is_active ? 'Aktif' : 'Nonaktif',
        'Total Layanan': totalLayanan,
        'Layanan Aktif': activeLayanan,
        'Total Pesanan': totalPesanan,
        'Rating Rata-rata': avgRating ? parseFloat(avgRating).toFixed(2) : '0.00',
        'Total Revenue (Rp)': totalRevenue || 0
      };
    });

    const reportData = await Promise.all(dataPromises);

    // Generate report based on format
    let result;
    switch (format.toLowerCase()) {
      case 'csv':
        result = await this.reportGenerator.generateCSV(reportData, 'Laporan Statistik Kategori');
        break;
      case 'excel':
        result = await this.reportGenerator.generateExcel(reportData, 'Laporan Statistik Kategori');
        break;
      case 'pdf':
        result = await this.reportGenerator.generatePDF(reportData, 'Laporan Statistik Kategori');
        break;
    }

    return {
      filename: `kategori_statistics_${Date.now()}.${format}`,
      data: result.data,
      mimetype: result.mimetype
    };
  }
}

module.exports = ExportKategoriReport;