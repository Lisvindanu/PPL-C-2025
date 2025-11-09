import React, { useState, useEffect, useMemo } from 'react';
import { Sidebar } from '../components/organisms/Sidebar';
import { Header } from '../components/organisms/Header';
import { adminService } from '../services/adminService';
import api from '../utils/axiosConfig';
import { ServiceManagementToolbar } from '../components/organisms/ServiceManagementToolbar';
import ServiceTable from '../components/organisms/ServiceTable';
import Button from '../components/atoms/Button';
import Badge from '../components/atoms/Badge';
import BlockReasonCard from '../components/molecules/BlockReasonCard';

// Pagination Component
function Pagination({ 
  currentPage = 1, 
  totalPages = 1, 
  onPageChange,
  className = "" 
}) {
  if (totalPages <= 1) return null;

  return (
    <div className={`flex items-center justify-between ${className}`}>
      <div className="text-sm text-gray-600">
        Halaman {currentPage} dari {totalPages}
      </div>
      <div className="flex gap-2">
        <Button
          variant="outline"
          onClick={() => onPageChange(Math.max(1, currentPage - 1))}
          disabled={currentPage === 1}
          className="disabled:opacity-50 disabled:cursor-not-allowed"
        >
          Sebelumnya
        </Button>
        <Button
          variant="outline"
          onClick={() => onPageChange(Math.min(totalPages, currentPage + 1))}
          disabled={currentPage === totalPages}
          className="disabled:opacity-50 disabled:cursor-not-allowed"
        >
          Selanjutnya
        </Button>
      </div>
    </div>
  );
}

// BlockServiceModal Component
function BlockServiceModal({ 
  isOpen, 
  onClose, 
  service, 
  onConfirm,
  isBlocking = true 
}) {
  const [reason, setReason] = useState('');

  if (!isOpen || !service) return null;

  const handleConfirm = () => {
    if (isBlocking && !reason.trim()) {
      alert('Silakan masukkan alasan pemblokiran');
      return;
    }
    onConfirm(reason);
    setReason('');
  };

  const handleClose = () => {
    setReason('');
    onClose();
  };

  const serviceTitle = service.judul || 'Layanan';

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      {/* Backdrop */}
      <div 
        className="fixed inset-0 bg-black bg-opacity-50 transition-opacity"
        onClick={handleClose}
      />

      {/* Modal */}
      <div className="flex min-h-screen items-center justify-center p-4">
        <div 
          className="relative bg-white rounded-lg shadow-xl w-full max-w-md transform transition-all"
          onClick={(e) => e.stopPropagation()}
        >
          {/* Header */}
          <div className="px-6 py-4 border-b border-gray-200">
            <h3 className="text-xl font-bold text-black">
              {isBlocking ? 'Blokir Layanan' : 'Aktifkan Layanan'}
            </h3>
          </div>

          {/* Body */}
          <div className="px-6 py-4">
            <p className="text-gray-700 mb-4">
              Anda akan {isBlocking ? 'memblokir' : 'mengaktifkan'} layanan <strong>{serviceTitle}</strong>.
              {isBlocking && ' Silakan berikan alasan pemblokiran:'}
            </p>

            {isBlocking && (
              <textarea
                placeholder="Masukan alasan pemblokiran..."
                value={reason}
                onChange={(e) => setReason(e.target.value)}
                className="w-full min-h-[100px] p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 mb-4"
                rows={4}
              />
            )}
          </div>

          {/* Footer */}
          <div className="px-6 py-4 bg-gray-50 border-t border-gray-200 flex justify-end gap-3">
            <Button
              variant="outline"
              onClick={handleClose}
              className="bg-gray-200 text-gray-700 hover:bg-gray-300"
            >
              Batal
            </Button>
            <Button
              variant="primary"
              onClick={handleConfirm}
              className={isBlocking ? "bg-[#EF4444] hover:bg-red-600 text-white" : "bg-[#10B981] hover:bg-green-600 text-white"}
            >
              {isBlocking ? 'Blokir' : 'Aktifkan'}
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}

// ServiceDetailModal Component
function ServiceDetailModal({ 
  isOpen, 
  onClose, 
  service 
}) {
  if (!isOpen || !service) return null;

  const isActive = service.status === 'aktif' || service.status === 'active';

  const formatCurrency = (amount) => {
    if (!amount) return 'N/A';
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      minimumFractionDigits: 0
    }).format(amount);
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      {/* Backdrop */}
      <div 
        className="fixed inset-0 bg-black bg-opacity-50 transition-opacity"
        onClick={onClose}
      />

      {/* Modal */}
      <div className="flex min-h-screen items-center justify-center p-4">
        <div 
          className="relative bg-white rounded-lg shadow-xl w-full max-w-2xl transform transition-all"
          onClick={(e) => e.stopPropagation()}
        >
          {/* Header */}
          <div className="px-6 py-4 border-b border-gray-200">
            <h3 className="text-xl font-bold text-black">Detail Layanan</h3>
          </div>

          {/* Body */}
          <div className="px-6 py-4">
            {/* Informasi Umum */}
            <div className="space-y-4 mb-6">
              <div>
                <label className="text-sm font-medium text-gray-700">Judul Layanan</label>
                <p className="text-gray-900">{service.judul || 'N/A'}</p>
              </div>
              {service.deskripsi && (
                <div>
                  <label className="text-sm font-medium text-gray-700">Deskripsi</label>
                  <p className="text-gray-900">{service.deskripsi}</p>
                </div>
              )}
              <div>
                <label className="text-sm font-medium text-gray-700">Freelancer</label>
                <p className="text-gray-900">{service.freelancer_name || 'N/A'}</p>
                {service.freelancer_email && (
                  <p className="text-sm text-gray-600">{service.freelancer_email}</p>
                )}
              </div>
              <div>
                <label className="text-sm font-medium text-gray-700">Kategori</label>
                <div className="mt-1">
                  <Badge className="bg-[#9DBBDD] text-white">
                    {service.kategori_name || 'N/A'}
                  </Badge>
                </div>
              </div>
              <div>
                <label className="text-sm font-medium text-gray-700">Status</label>
                <div className="mt-1">
                  <Badge variant={isActive ? 'success' : 'error'}>
                    {isActive ? 'Aktif' : 'Diblokir'}
                  </Badge>
                </div>
              </div>
              {service.harga && (
                <div>
                  <label className="text-sm font-medium text-gray-700">Harga</label>
                  <p className="text-gray-900">{formatCurrency(service.harga)}</p>
                </div>
              )}
              {service.waktu_pengerjaan && (
                <div>
                  <label className="text-sm font-medium text-gray-700">Waktu Pengerjaan</label>
                  <p className="text-gray-900">{service.waktu_pengerjaan} hari</p>
                </div>
              )}
              {service.batas_revisi && (
                <div>
                  <label className="text-sm font-medium text-gray-700">Batas Revisi</label>
                  <p className="text-gray-900">{service.batas_revisi} kali</p>
                </div>
              )}
              {service.rating_rata_rata !== undefined && service.rating_rata_rata !== null && (
                <div>
                  <label className="text-sm font-medium text-gray-700">Rating</label>
                  <p className="text-gray-900">
                    {typeof service.rating_rata_rata === 'number' 
                      ? service.rating_rata_rata.toFixed(1) 
                      : parseFloat(service.rating_rata_rata || 0).toFixed(1)} ({service.jumlah_rating || 0} ulasan)
                  </p>
                </div>
              )}
              {service.total_pesanan !== undefined && (
                <div>
                  <label className="text-sm font-medium text-gray-700">Total Pesanan</label>
                  <p className="text-gray-900">{service.total_pesanan} pesanan</p>
                </div>
              )}
            </div>

            {/* Detail Pelanggaran (jika diblokir) */}
            {!isActive && (
              <BlockReasonCard blockLog={service.blockLog} />
            )}
          </div>

          {/* Footer */}
          <div className="px-6 py-4 bg-gray-50 border-t border-gray-200 flex justify-end">
            <Button
              variant="outline"
              onClick={onClose}
              className="bg-[#B3B3B3] text-white hover:bg-gray-500"
            >
              Kembali
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function AdminServiceManagementPage() {
  const [services, setServices] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [kategoriFilter, setKategoriFilter] = useState('all');
  const [page, setPage] = useState(1);
  const [total, setTotal] = useState(0);
  const [limit] = useState(10);
  const [blockModalOpen, setBlockModalOpen] = useState(false);
  const [selectedService, setSelectedService] = useState(null);
  const [isBlocking, setIsBlocking] = useState(true);
  const [detailModalOpen, setDetailModalOpen] = useState(false);
  const [detailService, setDetailService] = useState(null);

  useEffect(() => {
    // Fetch categories
    const fetchCategories = async () => {
      try {
        const response = await api.get('/kategori');
        if (response.data.success) {
          setCategories(response.data.data || []);
        }
      } catch (err) {
        console.error('Error fetching categories:', err);
      }
    };
    fetchCategories();
  }, []);

  useEffect(() => {
    // Reset to page 1 when filters change
    setPage(1);
  }, [statusFilter, kategoriFilter]);

  useEffect(() => {
    fetchServices();
  }, [page, statusFilter, kategoriFilter]);

  const fetchServices = async () => {
    try {
      setLoading(true);
      setError(null);

      const filters = {
        page,
        limit,
        status: statusFilter !== 'all' ? statusFilter : undefined,
        kategori: kategoriFilter !== 'all' ? kategoriFilter : undefined
      };

      const response = await adminService.getServices(filters);

      if (response.success) {
        const allServices = response.data || [];
        setServices(allServices);
        setTotal(response.pagination?.total || allServices.length);
      } else {
        throw new Error(response.message || 'Failed to fetch services');
      }

      setLoading(false);
    } catch (err) {
      console.error('Error fetching services:', err);
      setError(err.message || 'Terjadi kesalahan saat memuat data layanan.');
      setLoading(false);
    }
  };

  const handleBlockClick = (service, currentStatus) => {
    setSelectedService(service);
    setIsBlocking(currentStatus === 'active' || currentStatus === 'aktif');
    setBlockModalOpen(true);
  };

  const handleBlockConfirm = async (reason) => {
    if (!selectedService) return;

    try {
      let response;
      if (isBlocking) {
        response = await adminService.blockService(selectedService.id, reason || 'Violation of terms');
      } else {
        response = await adminService.unblockService(selectedService.id, reason || 'Service reactivated');
      }

      if (response.success) {
        alert(response.message || 'Berhasil memperbarui status layanan');
        setBlockModalOpen(false);
        setSelectedService(null);
        fetchServices();
      } else {
        throw new Error(response.message || 'Failed to update service status');
      }
    } catch (err) {
      console.error('Error updating service:', err);
      alert(err.message || 'Terjadi kesalahan saat memperbarui status layanan');
    }
  };

  const handleExport = async (format = 'csv') => {
    try {
      const response = await adminService.exportReport({
        reportType: 'services',
        format: format,
        filters: {
          status: statusFilter !== 'all' ? statusFilter : undefined,
          kategori: kategoriFilter !== 'all' ? kategoriFilter : undefined,
          search: searchQuery || undefined
        }
      });

      if (response.success) {
        if (format === 'csv' || format === 'excel') {
          alert(`Laporan berhasil diekspor dalam format ${format.toUpperCase()}`);
        } else {
          alert('Laporan berhasil diekspor');
        }
      } else {
        throw new Error(response.message || 'Failed to export report');
      }
    } catch (err) {
      console.error('Error exporting report:', err);
      alert(err.message || 'Terjadi kesalahan saat mengekspor laporan');
    }
  };

  const handleDetail = async (service) => {
    try {
      // Fetch service details from API
      const response = await adminService.getServiceDetails(service.id);
      if (response.success) {
        setDetailService(response.data);
      } else {
        // Fallback to basic service data
        setDetailService(service);
      }
      setDetailModalOpen(true);
    } catch (err) {
      console.error('Error fetching service details:', err);
      // Fallback to basic service data
      setDetailService(service);
      setDetailModalOpen(true);
    }
  };

  const filteredServices = useMemo(() => {
    return services.filter(service => {
      // Apply search filter
      if (searchQuery) {
        const searchLower = searchQuery.toLowerCase();
        const title = (service.judul || '').toLowerCase();
        const freelancer = (service.freelancer_name || '').toLowerCase();
        const kategori = (service.kategori_name || '').toLowerCase();
        if (!title.includes(searchLower) && !freelancer.includes(searchLower) && !kategori.includes(searchLower)) {
          return false;
        }
      }
      
      return true;
    });
  }, [services, searchQuery]);

  const totalPages = Math.ceil(total / limit);

  if (loading && page === 1) {
    return (
      <div className="flex items-center justify-center h-screen bg-[#F5F7FA]">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-[#4782BE] border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600">Memuat data layanan...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex h-screen bg-[#F5F7FA]">
      <Sidebar activeMenu="services" />
      
      <div className="flex-1 overflow-auto">
        <Header />
        
        <div className="p-6">
          {/* Combined Toolbar and Table */}
          <div className="bg-white rounded-lg border border-[#D8E3F3] overflow-hidden">
            {/* Toolbar */}
            <ServiceManagementToolbar
              searchQuery={searchQuery}
              onSearchChange={setSearchQuery}
              statusFilter={statusFilter}
              onStatusFilterChange={setStatusFilter}
              kategoriFilter={kategoriFilter}
              onKategoriFilterChange={setKategoriFilter}
              categories={categories}
              onExport={handleExport}
              totalServices={services.length}
              displayedServices={filteredServices.length}
            />

            {/* Table */}
            <ServiceTable 
              services={filteredServices}
              onBlock={handleBlockClick}
              onDetail={handleDetail}
            />

            {/* Block Service Modal */}
            <BlockServiceModal
              isOpen={blockModalOpen}
              onClose={() => {
                setBlockModalOpen(false);
                setSelectedService(null);
              }}
              service={selectedService}
              onConfirm={handleBlockConfirm}
              isBlocking={isBlocking}
            />

            {/* Service Detail Modal */}
            <ServiceDetailModal
              isOpen={detailModalOpen}
              onClose={() => {
                setDetailModalOpen(false);
                setDetailService(null);
              }}
              service={detailService}
            />

            {/* Pagination */}
            {totalPages > 1 && (
              <div className="bg-gray-50 px-6 py-4 border-t border-[#D8E3F3]">
                <Pagination
                  currentPage={page}
                  totalPages={totalPages}
                  onPageChange={setPage}
                />
              </div>
            )}

            {/* Error Message */}
            {error && (
              <div className="p-6 text-center">
                <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
                  {error}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

