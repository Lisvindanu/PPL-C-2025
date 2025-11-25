import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Sidebar } from '../components/organisms/Sidebar';
import { Header } from '../components/organisms/Header';
import { adminService } from '../services/adminService';
import { useToast } from '../components/organisms/ToastProvider';
import Badge from '../components/atoms/Badge';
import Pagination from '../components/atoms/Pagination';
import { ArrowLeft, Bell, Eye } from 'lucide-react';

const smallDate = (iso) => {
  try {
    return new Date(iso).toLocaleString('id-ID', {
      day: 'numeric',
      month: 'long',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit'
    });
  } catch {
    return iso;
  }
};

const getInitials = (name) => {
  if (!name) return 'GG';
  const parts = name.split(' ');
  if (parts.length >= 2) {
    return (parts[0][0] + parts[1][0]).toUpperCase();
  }
  return name.substring(0, 2).toUpperCase();
};

const typeColor = (type) => {
  if (type?.includes('failedPayment') || type?.includes('payment')) return 'bg-red-500';
  if (type?.includes('multipleFailures') || type?.includes('failures')) return 'bg-yellow-500';
  if (type?.includes('anomaly')) return 'bg-blue-600';
  return 'bg-gray-600';
};

const getTypeLabel = (type) => {
  if (type?.includes('failedPayment') || type?.includes('payment')) return 'Pembayaran Gagal';
  if (type?.includes('multipleFailures') || type?.includes('failures')) return 'Beberapa Pembayaran Gagal';
  if (type?.includes('anomaly')) return 'Anomali Transaksi';
  return 'Notifikasi';
};

const getTypeBadge = (type) => {
  if (type?.includes('failedPayment') || type?.includes('payment')) {
    return <Badge variant="error" className="px-3 py-1 text-sm font-medium">{getTypeLabel(type)}</Badge>;
  }
  if (type?.includes('multipleFailures') || type?.includes('failures')) {
    return <Badge variant="warning" className="px-3 py-1 text-sm font-medium">{getTypeLabel(type)}</Badge>;
  }
  if (type?.includes('anomaly')) {
    return <Badge variant="primary" className="px-3 py-1 text-sm font-medium">{getTypeLabel(type)}</Badge>;
  }
  return <Badge className="px-3 py-1 text-sm font-medium">{getTypeLabel(type)}</Badge>;
};

export default function AllNotificationsPage() {
  const navigate = useNavigate();
  const toast = useToast();
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalData, setTotalData] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);

  useEffect(() => {
    fetchNotifications();
  }, [page, rowsPerPage]);

  const fetchNotifications = async () => {
    setLoading(true);
    setError(null);
    try {
      // Get read notifications from localStorage
      const readNotifications = JSON.parse(localStorage.getItem('readNotifications') || '[]');
      
      // First try to get from notifications API
      const res = await adminService.getNotifications({ page, limit: rowsPerPage });
      
      if (res && res.success) {
        const notificationsWithReadStatus = (res.data || []).map(n => {
          // Ensure name is included in title if available
          const userName = n.raw?.nama_depan && n.raw?.nama_belakang
            ? `${n.raw.nama_depan} ${n.raw.nama_belakang}`
            : n.raw?.nama_depan || n.raw?.nama_belakang || n.raw?.email || '';
          
          const title = n.title || n.judul || '';
          const updatedTitle = userName && !title.includes(userName)
            ? `${userName} - ${title}`
            : title;
          
          return {
            ...n,
            title: updatedTitle || n.title || n.judul,
            is_read: readNotifications.includes(n.id)
          };
        });
        setNotifications(notificationsWithReadStatus);
        setTotalPages(res.pagination?.totalPages || 1);
        setTotalData(res.pagination?.total || 0);
      } else {
        // Fallback to fraud alerts if notifications API doesn't have data
        const alertsRes = await adminService.getFraudAlerts();
        if (alertsRes && alertsRes.success !== false) {
          const data = alertsRes.data ?? alertsRes;
          const combined = [];
          
          (data.failedPayments || []).forEach(p => {
            const userName = (p.nama_depan && p.nama_belakang)
              ? `${p.nama_depan} ${p.nama_belakang}`
              : p.nama_depan || p.nama_belakang || p.email || 'User';
            combined.push({
              id: p.id,
              type: 'fraud_failedPayment',
              title: `${userName} - Pembayaran Gagal - Order: ${p.pesanan_id ?? p.order_id ?? p.id}`,
              message: `Amount: Rp ${parseInt(p.total_bayar ?? p.amount ?? 0).toLocaleString('id-ID')}`,
              created_at: p.created_at ?? p.createdAt ?? p.date,
              is_read: readNotifications.includes(p.id),
              raw: { ...p, alertType: 'failedPayment' }
            });
          });

          (data.multipleFailures || []).forEach(m => {
            const userName = (m.nama_depan && m.nama_belakang)
              ? `${m.nama_depan} ${m.nama_belakang}`
              : m.nama_depan || m.nama_belakang || m.email || 'User';
            combined.push({
              id: m.user_id || m.id,
              type: 'fraud_multipleFailures',
              title: `${userName} - Beberapa Pembayaran Gagal`,
              message: `Jumlah pembayaran gagal: ${m.failed_count}`,
              created_at: m.last_failed,
              is_read: readNotifications.includes(m.user_id || m.id),
              raw: { ...m, alertType: 'multipleFailures' }
            });
          });

          (data.anomalies || []).forEach(a => {
            const userName = (a.nama_depan && a.nama_belakang)
              ? `${a.nama_depan} ${a.nama_belakang}`
              : a.nama_depan || a.nama_belakang || a.email || a.user_email || 'User';
            combined.push({
              id: a.id || a.user_id || a.email,
              type: 'fraud_anomaly',
              title: `${userName} - Anomali Transaksi`,
              message: `Total transaksi: ${a.transaction_count ?? '-'} · Gagal: ${a.failed_count ?? '-'}`,
              created_at: null,
              is_read: readNotifications.includes(a.id || a.user_id || a.email),
              raw: { ...a, alertType: 'anomaly' }
            });
          });

          combined.sort((x, y) => {
            const dx = x.created_at ? new Date(x.created_at).getTime() : 0;
            const dy = y.created_at ? new Date(y.created_at).getTime() : 0;
            return (dy - dx);
          });

          // Apply pagination
          const startIndex = (page - 1) * rowsPerPage;
          const endIndex = startIndex + rowsPerPage;
          const paginated = combined.slice(startIndex, endIndex);
          
          setNotifications(paginated);
          setTotalPages(Math.ceil(combined.length / rowsPerPage));
          setTotalData(combined.length);
        } else {
          setError(res.message || 'Failed to load notifications');
        }
      }
    } catch (err) {
      setError(err.message || 'Failed to load notifications');
    } finally {
      setLoading(false);
    }
  };

  const handleViewDetail = (notification) => {
    // Mark as read when viewing detail
    const readNotifications = JSON.parse(localStorage.getItem('readNotifications') || '[]');
    if (!readNotifications.includes(notification.id)) {
      readNotifications.push(notification.id);
      localStorage.setItem('readNotifications', JSON.stringify(readNotifications));
      
      // Update local state
      setNotifications(prev => prev.map(n => 
        n.id === notification.id ? { ...n, is_read: true } : n
      ));
      
      // Dispatch event to update header count
      window.dispatchEvent(new CustomEvent('notificationRead'));
    }
    
    const alertType = notification.raw?.alertType || 
                     (notification.type?.includes('failedPayment') ? 'failedPayment' :
                      notification.type?.includes('multipleFailures') ? 'multipleFailures' :
                      notification.type?.includes('anomaly') ? 'anomaly' : null);
    
    const alertId = notification.raw?.id || notification.raw?.user_id || notification.id;

    if (alertType && alertId) {
      navigate(`/admin/fraud-report/${alertType}/${alertId}`);
    }
  };

  const formatTableDate = (iso) => {
    try {
      if (!iso) return '-';
      const date = new Date(iso);
      const day = date.getDate();
      const monthNames = ['Jan', 'Feb', 'Mar', 'Apr', 'Mei', 'Jun', 'Jul', 'Agu', 'Sep', 'Okt', 'Nov', 'Des'];
      const month = monthNames[date.getMonth()];
      const year = date.getFullYear();
      const hours = String(date.getHours()).padStart(2, '0');
      const minutes = String(date.getMinutes()).padStart(2, '0');
      const seconds = String(date.getSeconds()).padStart(2, '0');
      return `${day} ${month} ${year}, ${hours}:${minutes}:${seconds}`;
    } catch {
      return iso || '-';
    }
  };

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
            </div>

            {/* Content */}
            {loading && (
              <div className="text-center py-12">
                <p className="text-gray-500">Memuat notifikasi...</p>
              </div>
            )}

            {error && (
              <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-4">
                <p className="text-red-600">{error}</p>
              </div>
            )}

            {!loading && !error && notifications.length === 0 && (
              <div className="bg-white rounded-lg border border-[#D8E3F3] p-12 text-center">
                <div className="text-gray-400 mb-4">
                  <Bell size={48} className="mx-auto" />
                </div>
                <p className="text-gray-600 text-lg">Tidak ada notifikasi ditemukan</p>
              </div>
            )}

            {!loading && !error && notifications.length > 0 && (
              <div className="bg-white rounded-lg border border-[#D8E3F3] overflow-hidden">
                <div className="overflow-x-auto">
                  <table className="w-full min-w-[700px] md:min-w-full">
                    <thead className="bg-gray-50 border-b border-[#D8E3F3]">
                      <tr>
                        <th className="px-6 py-3 text-left text-xs font-bold text-black uppercase tracking-wider">
                          Notifikasi
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-bold text-black uppercase tracking-wider">
                          Jenis Notifikasi
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-bold text-black uppercase tracking-wider">
                          Waktu
                        </th>
                        <th className="px-6 py-3 text-center text-xs font-bold text-black uppercase tracking-wider">
                          Aksi
                        </th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-[#D8E3F3]">
                      {notifications.map((notification) => {
                        const isUnread = !notification.is_read;
                        
                        // Get user name from raw data or notification
                        const userName = notification.raw?.nama_depan && notification.raw?.nama_belakang
                          ? `${notification.raw.nama_depan} ${notification.raw.nama_belakang}`
                          : notification.raw?.nama_depan || notification.raw?.nama_belakang || notification.raw?.email || notification.raw?.user_email || '';
                        
                        // Get notification text
                        const notificationText = notification.title || notification.judul || notification.message || notification.pesan || '-';
                        
                        // Format: "Nama User - [jenis notifikasi] - [detail]"
                        // If title already contains name, use it as is, otherwise prepend name
                        const displayText = userName && !notificationText.includes(userName)
                          ? `${userName} - ${notificationText}`
                          : notificationText;
                        
                        return (
                          <tr 
                            key={notification.id}
                            className={`hover:bg-gray-50 transition-colors ${
                              isUnread ? 'bg-blue-50/30' : ''
                            }`}
                          >
                            <td className="px-4 py-3 md:whitespace-nowrap whitespace-normal">
                              <div className="flex items-start gap-3">
                                {isUnread && (
                                  <div className="w-2 h-2 rounded-full bg-[#4782BE] mt-2 flex-shrink-0"></div>
                                )}
                                <div className="flex-1 min-w-0">
                                  <div className={`text-sm ${isUnread ? 'font-semibold text-gray-900' : 'text-gray-900'} line-clamp-2`}>
                                    {displayText.length > 100 
                                      ? `${displayText.substring(0, 100)}...` 
                                      : displayText}
                                  </div>
                                </div>
                              </div>
                            </td>
                            <td className="px-4 py-3 md:whitespace-nowrap whitespace-normal">
                              <div className="flex items-center">
                                {getTypeBadge(notification.type)}
                              </div>
                            </td>
                            <td className="px-4 py-3 md:whitespace-nowrap whitespace-normal">
                              <div className="text-sm text-gray-600">
                                {formatTableDate(notification.created_at)}
                              </div>
                            </td>
                            <td className="px-4 py-3 md:whitespace-nowrap whitespace-normal">
                              <div className="flex items-center justify-center">
                                <button
                                  type="button"
                                  onClick={() => handleViewDetail(notification)}
                                  className="inline-flex items-center justify-center w-10 h-10 rounded-full bg-[#4782BE] hover:bg-[#9DBBDD] text-white transition-colors"
                                  title="Lihat Detail"
                                >
                                  <Eye size={16} />
                                </button>
                              </div>
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>

                {/* Pagination */}
                <div className="bg-gray-50 px-6 py-4 border-t border-[#D8E3F3]">
                  <div className="flex items-center justify-between">
                    <div className="text-sm text-gray-600">
                      Hal {page}/{totalPages} ({totalData} data)
                    </div>
                    <div className="flex items-center gap-3">
                      <select
                        value={rowsPerPage}
                        onChange={(e) => {
                          setRowsPerPage(Number(e.target.value));
                          setPage(1);
                        }}
                        className="px-3 py-1.5 border border-gray-300 rounded-lg text-sm bg-white text-gray-700 focus:outline-none focus:ring-2 focus:ring-[#4782BE] focus:border-[#4782BE]"
                      >
                        <option value={10}>10 baris</option>
                        <option value={20}>20 baris</option>
                        <option value={50}>50 baris</option>
                        <option value={100}>100 baris</option>
                      </select>
                      {totalPages > 1 && (
                        <Pagination
                          page={page}
                          totalPages={totalPages}
                          onChange={setPage}
                        />
                      )}
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </main>
      </div>
    </div>
  );
}

