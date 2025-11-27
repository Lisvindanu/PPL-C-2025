import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Sidebar } from '../components/organisms/Sidebar';
import { Header } from '../components/organisms/Header';
import { adminService } from '../services/adminService';
import { useToast } from '../components/organisms/ToastProvider';
import Badge from '../components/atoms/Badge';
import Button from '../components/atoms/Button';
import { ArrowLeft, User, CreditCard, AlertTriangle, Shield, Ban } from 'lucide-react';

export default function FraudReportDetailPage() {
  const { type, id } = useParams();
  const navigate = useNavigate();
  const toast = useToast();
  const [detail, setDetail] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showBlockModal, setShowBlockModal] = useState(false);
  const [blockReason, setBlockReason] = useState('');
  const [blocking, setBlocking] = useState(false);

  useEffect(() => {
    fetchDetail();
    // Mark notification as read when detail page is opened
    const markAsRead = () => {
      const readNotifications = JSON.parse(localStorage.getItem('readNotifications') || '[]');
      if (!readNotifications.includes(id)) {
        readNotifications.push(id);
        localStorage.setItem('readNotifications', JSON.stringify(readNotifications));
        // Dispatch event to update header count
        window.dispatchEvent(new CustomEvent('notificationRead'));
      }
    };
    markAsRead();
  }, [type, id]);

  const fetchDetail = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await adminService.getFraudAlertDetail(type, id);
      if (res && res.success) {
        setDetail(res.data);
      } else {
        setError(res.message || 'Failed to load fraud alert detail');
      }
    } catch (err) {
      setError(err.message || 'Failed to load fraud alert detail');
    } finally {
      setLoading(false);
    }
  };

  const handleBlockUser = async () => {
    if (!blockReason.trim()) {
      toast.show('Silakan masukkan alasan pemblokiran', 'error');
      return;
    }

    setBlocking(true);
    try {
      const userId = detail.user_id || detail.id;
      const res = await adminService.blockUser(userId, blockReason);
      if (res && res.success) {
        toast.show('User berhasil diblokir', 'success');
        setShowBlockModal(false);
        setBlockReason('');
        fetchDetail();
      } else {
        toast.show(res.message || 'Gagal memblokir user', 'error');
      }
    } catch (err) {
      toast.show(err.message || 'Gagal memblokir user', 'error');
    } finally {
      setBlocking(false);
    }
  };

  const getTypeInfo = () => {
    switch (type) {
      case 'failedPayment':
        return {
          icon: CreditCard,
          title: 'Pembayaran Gagal',
          color: 'red',
          bgColor: 'bg-red-50',
          iconColor: 'text-red-600'
        };
      case 'multipleFailures':
        return {
          icon: AlertTriangle,
          title: 'Beberapa Pembayaran Gagal',
          color: 'yellow',
          bgColor: 'bg-yellow-50',
          iconColor: 'text-yellow-600'
        };
      case 'anomaly':
        return {
          icon: Shield,
          title: 'Anomali Transaksi',
          color: 'blue',
          bgColor: 'bg-blue-50',
          iconColor: 'text-blue-600'
        };
      default:
        return {
          icon: AlertTriangle,
          title: 'Fraud Alert',
          color: 'gray',
          bgColor: 'bg-gray-50',
          iconColor: 'text-gray-600'
        };
    }
  };

  const typeInfo = getTypeInfo();
  const Icon = typeInfo.icon;

  if (loading) {
    return (
      <div className="flex h-screen bg-[#DBE2EF]">
        <Sidebar />
        <div className="flex-1 flex flex-col overflow-hidden">
          <Header />
          <main className="flex-1 overflow-y-auto p-6">
            <div className="w-full">
              <p className="text-gray-500">Memuat detail laporan...</p>
            </div>
          </main>
        </div>
      </div>
    );
  }

  if (error || !detail) {
    return (
      <div className="flex h-screen bg-[#DBE2EF]">
        <Sidebar />
        <div className="flex-1 flex flex-col overflow-hidden">
          <Header />
          <main className="flex-1 overflow-y-auto p-6">
            <div className="w-full">
              <div className="bg-white rounded-lg border border-[#D8E3F3] p-4">
                <p className="text-red-600">{error || 'Detail laporan tidak ditemukan'}</p>
              </div>
            </div>
          </main>
        </div>
      </div>
    );
  }

  const userName = detail.nama_depan && detail.nama_belakang
    ? `${detail.nama_depan} ${detail.nama_belakang}`
    : detail.nama_depan || detail.nama_belakang || detail.email || 'Unknown User';

  return (
    <div className="flex h-screen bg-[#DBE2EF]">
      <Sidebar />
      <div className="flex-1 flex flex-col overflow-hidden">
        <Header />
        <main className="flex-1 overflow-y-auto p-6">
          <div className="w-full">
            {/* Header */}
            <div className="mb-6">
              <button
                onClick={() => navigate(-1)}
                className="flex items-center text-gray-600 hover:text-gray-900 mb-4 transition-colors"
              >
                <ArrowLeft size={20} className="mr-2" />
                <span className="font-medium">Kembali</span>
              </button>
              <div className="mb-4">
                <h1 className="text-2xl font-bold text-gray-900">{typeInfo.title}</h1>
                <p className="text-sm text-gray-600 mt-1">Detail laporan fraud alert</p>
              </div>
            </div>

            {/* Detail Card */}
            <div className="bg-white rounded-lg border border-[#D8E3F3] overflow-hidden mb-6">
              <div className="px-6 py-4 bg-gray-50 border-b border-[#D8E3F3]">
                <h2 className="text-lg font-bold text-gray-900">Informasi User</h2>
              </div>
              <div className="px-6 py-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="text-sm font-medium text-gray-700">Nama Lengkap</label>
                    <p className="text-gray-900 mt-1">{userName}</p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-700">Email</label>
                    <p className="text-gray-900 mt-1 break-all">{detail.email || '-'}</p>
                  </div>
                  {detail.user_id && (
                    <div>
                      <label className="text-sm font-medium text-gray-700">User ID</label>
                      <p className="text-gray-900 mt-1 font-mono text-sm break-all">{detail.user_id}</p>
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Type-specific details */}
            {type === 'failedPayment' && (
              <div className="bg-white rounded-lg border border-[#D8E3F3] overflow-hidden mb-6">
                <div className="px-6 py-4 bg-gray-50 border-b border-[#D8E3F3]">
                  <h2 className="text-lg font-bold text-gray-900">Detail Pembayaran Gagal</h2>
                </div>
                <div className="px-6 py-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {detail.pesanan_id && (
                      <div>
                        <label className="text-sm font-medium text-gray-700">Order ID</label>
                        <p className="text-gray-900 mt-1 font-mono text-sm break-all">{detail.pesanan_id}</p>
                      </div>
                    )}
                    {detail.order_title && (
                      <div>
                        <label className="text-sm font-medium text-gray-700">Judul Order</label>
                        <p className="text-gray-900 mt-1">{detail.order_title}</p>
                      </div>
                    )}
                    {detail.total_bayar && (
                      <div>
                        <label className="text-sm font-medium text-gray-700">Total Pembayaran</label>
                        <p className="text-red-600 font-bold text-lg mt-1">
                          Rp {parseInt(detail.total_bayar).toLocaleString('id-ID')}
                        </p>
                      </div>
                    )}
                    {detail.created_at && (
                      <div>
                        <label className="text-sm font-medium text-gray-700">Tanggal & Waktu</label>
                        <p className="text-gray-900 mt-1">
                          {new Date(detail.created_at).toLocaleString('id-ID', {
                            day: 'numeric',
                            month: 'long',
                            year: 'numeric',
                            hour: '2-digit',
                            minute: '2-digit'
                          })}
                        </p>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            )}

            {type === 'multipleFailures' && (
              <div className="bg-white rounded-lg border border-[#D8E3F3] overflow-hidden mb-6">
                <div className="px-6 py-4 bg-gray-50 border-b border-[#D8E3F3]">
                  <h2 className="text-lg font-bold text-gray-900">Statistik Pembayaran Gagal</h2>
                </div>
                <div className="px-6 py-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label className="text-sm font-medium text-gray-700">Jumlah Pembayaran Gagal</label>
                      <p className="text-red-600 font-bold text-2xl mt-1">{detail.failed_count || 0}</p>
                      <p className="text-xs text-gray-500 mt-1">Kali pembayaran gagal</p>
                    </div>
                    {detail.last_failed && (
                      <div>
                        <label className="text-sm font-medium text-gray-700">Pembayaran Gagal Terakhir</label>
                        <p className="text-gray-900 mt-1">
                          {new Date(detail.last_failed).toLocaleString('id-ID', {
                            day: 'numeric',
                            month: 'long',
                            year: 'numeric',
                            hour: '2-digit',
                            minute: '2-digit'
                          })}
                        </p>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            )}

            {type === 'anomaly' && (
              <div className="bg-white rounded-lg border border-[#D8E3F3] overflow-hidden mb-6">
                <div className="px-6 py-4 bg-gray-50 border-b border-[#D8E3F3]">
                  <h2 className="text-lg font-bold text-gray-900">Statistik Anomali Transaksi</h2>
                </div>
                <div className="px-6 py-4">
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <div>
                      <label className="text-sm font-medium text-gray-700">Total Transaksi</label>
                      <p className="text-[#4782BE] font-bold text-2xl mt-1">{detail.transaction_count || 0}</p>
                      <p className="text-xs text-gray-500 mt-1">Transaksi</p>
                    </div>
                    <div>
                      <label className="text-sm font-medium text-gray-700">Pembayaran Gagal</label>
                      <p className="text-red-600 font-bold text-2xl mt-1">{detail.failed_count || 0}</p>
                      <p className="text-xs text-gray-500 mt-1">Gagal</p>
                    </div>
                    {detail.total_spent && (
                      <div>
                        <label className="text-sm font-medium text-gray-700">Total Pengeluaran</label>
                        <p className="text-gray-900 font-bold text-lg mt-1">
                          Rp {parseInt(detail.total_spent).toLocaleString('id-ID')}
                        </p>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            )}

            {/* Action Buttons */}
            <div className="bg-white rounded-lg border border-[#D8E3F3] overflow-hidden">
              <div className="px-6 py-4 bg-gray-50 border-b border-[#D8E3F3]">
                <h2 className="text-lg font-bold text-gray-900">Tindak Lanjut</h2>
              </div>
              <div className="px-6 py-4">
                <p className="text-sm text-gray-600 mb-4">Pilih tindakan yang akan dilakukan untuk menangani laporan ini</p>
                <div className="flex flex-wrap gap-3">
                  <Button
                    variant="cancel"
                    onClick={() => setShowBlockModal(true)}
                    icon={<Ban size={18} />}
                    className="bg-red-500 text-white border-red-500 hover:bg-red-600 hover:border-red-600"
                  >
                    Blokir User
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </main>
      </div>

      {/* Block Modal */}
      {showBlockModal && (
        <div className="fixed inset-0 z-50 overflow-y-auto">
          <div 
            className="fixed inset-0 bg-black bg-opacity-50 transition-opacity"
            onClick={() => setShowBlockModal(false)}
          />
          <div className="flex min-h-screen items-center justify-center p-4">
            <div 
              className="relative bg-white rounded-lg shadow-xl w-full max-w-lg border border-[#D8E3F3]"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="px-6 py-4 border-b border-[#D8E3F3]">
                <h3 className="text-xl font-bold text-black">Blokir User</h3>
              </div>
              <div className="px-6 py-4">
                <div className="bg-yellow-50 border-l-4 border-yellow-400 p-4 mb-4">
                  <p className="text-sm text-gray-700">
                    Apakah Anda yakin ingin memblokir user <strong className="text-gray-900">{userName}</strong>? 
                    Tindakan ini akan menonaktifkan akun user dan mencegah akses ke platform.
                  </p>
                </div>
                <div className="mb-4">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Alasan Pemblokiran <span className="text-red-500">*</span>
                  </label>
                  <textarea
                    value={blockReason}
                    onChange={(e) => setBlockReason(e.target.value)}
                    placeholder="Masukkan alasan pemblokiran secara detail..."
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#4782BE] focus:border-[#4782BE]"
                    rows={4}
                  />
                  <p className="text-xs text-gray-500 mt-1">Alasan ini akan dicatat dalam log aktivitas admin</p>
                </div>
              </div>
              <div className="px-6 py-4 border-t border-[#D8E3F3] bg-gray-50 flex justify-end gap-3">
                <Button
                  variant="outline"
                  onClick={() => {
                    setShowBlockModal(false);
                    setBlockReason('');
                  }}
                  disabled={blocking}
                >
                  Batal
                </Button>
                <Button
                  variant="cancel"
                  onClick={handleBlockUser}
                  disabled={blocking || !blockReason.trim()}
                >
                  {blocking ? 'Memproses...' : 'Blokir User'}
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

