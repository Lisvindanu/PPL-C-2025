import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { X } from 'lucide-react';
import { adminService } from '../../services/adminService';

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

const NotificationPanel = ({ onClose }) => {
  const navigate = useNavigate();
  const [alerts, setAlerts] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    let mounted = true;
    const fetch = async () => {
      setLoading(true);
      try {
        // Fetch fraud alerts (anomalies, failedPayments, multipleFailures)
        const res = await adminService.getFraudAlerts();
        if (!mounted) return;
        if (res && res.success === false) {
          setError(res.message || 'Failed to load alerts');
          setAlerts(null);
        } else {
          // response may be { success, message, data: { anomalies, failedPayments, multipleFailures, total } }
          const data = res.data ?? res;
          // normalize shape
          const normalized = {
            anomalies: data.anomalies ?? [],
            failedPayments: data.failedPayments ?? [],
            multipleFailures: data.multipleFailures ?? [],
            total: data.total ?? (Array.isArray(data.anomalies) ? data.anomalies.length : 0) + (Array.isArray(data.failedPayments) ? data.failedPayments.length : 0) + (Array.isArray(data.multipleFailures) ? data.multipleFailures.length : 0)
          };
          setAlerts(normalized);
        }
      } catch (err) {
        if (!mounted) return;
        setError(err.message || 'Failed to load alerts');
      } finally {
        if (mounted) setLoading(false);
      }
    };

    fetch();
    return () => { mounted = false };
  }, []);

  const getInitials = (name) => {
    if (!name) return 'GG';
    const parts = name.split(' ');
    if (parts.length >= 2) {
      return (parts[0][0] + parts[1][0]).toUpperCase();
    }
    return name.substring(0, 2).toUpperCase();
  };

  const typeColor = (type) => {
    switch (type) {
      case 'failedPayment': return 'bg-red-500';
      case 'multipleFailures': return 'bg-yellow-500';
      case 'anomaly': return 'bg-blue-600';
      default: return 'bg-gray-600';
    }
  };

  return (
    <div className="w-full max-w-sm md:w-96 bg-white shadow-lg rounded-lg border border-gray-200 relative">
      {/* Header */}
      <div className="flex items-center justify-between px-5 py-3 border-b">
        <h3 className="text-lg font-semibold text-gray-900">Notifikasi</h3>
        <div className="flex items-center gap-3">
          <button onClick={onClose} className="p-1 hover:bg-gray-100 rounded">
            <X size={18} className="text-gray-500" />
          </button>
        </div>
      </div>

      {/* Content (no internal scroll; panel shows up to 3 items) */}
      <div>
        {loading && (
          <div className="px-6 py-8 text-center">
            <p className="text-sm text-gray-500">Loading notifikasi...</p>
          </div>
        )}
        
        {error && (
          <div className="px-6 py-8 text-center">
            <p className="text-sm text-red-600">{error}</p>
          </div>
        )}

        {!loading && !error && alerts && (
          <div>
            {(!alerts.total || alerts.total === 0) ? (
              <div className="flex flex-col items-center text-center py-10 px-6">
                  <div className="w-28 h-28 mb-6 flex items-center justify-center bg-[#F6FAFF] rounded-full">
                    <svg width="64" height="64" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M12 2C9.243 2 7 4.243 7 7v3.586l-1.707 1.707A1 1 0 006 13h12a1 1 0 00.707-1.707L17 10.586V7c0-2.757-2.243-5-5-5z" fill="#CFE8FF"/>
                    <rect x="3" y="14" width="18" height="6" rx="1" fill="#FFD6E0"/>
                    <circle cx="18" cy="6" r="3" fill="#2B6CB0"/>
                  </svg>
                </div>
                <p className="text-sm text-gray-600 mb-4">Kami akan segera memberi tahu Anda apabila ada informasi baru</p>
                <div className="w-full border-t border-gray-200" />
                <button 
                  onClick={() => {
                    onClose();
                    navigate('/admin/notifications');
                  }}
                  className="mt-4 text-sm text-blue-600 hover:text-blue-700 font-medium"
                >
                  Lihat semua notifikasi
                </button>
              </div>
            ) : (
              <div className="space-y-3 px-4 py-3">

                {/* Compute and show 3 latest items across categories */}
                {(() => {
                  const combined = [];
                  // failedPayments: use created_at
                  (alerts.failedPayments || []).forEach(p => combined.push({
                    id: p.id,
                    type: 'failedPayment',
                    title: `Order: ${p.pesanan_id ?? p.order_id ?? p.id}`,
                    subtitle: `User: ${p.user_id} · Amount: ${p.total_bayar ?? p.amount ?? '-'} `,
                    date: p.created_at ?? p.createdAt ?? p.date,
                    raw: p
                  }));

                  // multipleFailures: use last_failed
                  (alerts.multipleFailures || []).forEach(m => combined.push({
                    id: m.user_id || m.id,
                    type: 'multipleFailures',
                    title: `User: ${m.user_id}`,
                    subtitle: `Failed: ${m.failed_count}`,
                    date: m.last_failed,
                    raw: m
                  }));

                  // anomalies: no reliable date, push last
                  (alerts.anomalies || []).forEach(a => combined.push({
                    id: a.id || a.user_id || a.email,
                    type: 'anomaly',
                    title: a.email || a.user_email || 'Unknown user',
                    subtitle: `Transactions: ${a.transaction_count ?? '-'} · Failed: ${a.failed_count ?? '-'}`,
                    date: null,
                    raw: a
                  }));

                  // sort by date desc (items without date go last)
                  combined.sort((x, y) => {
                    const dx = x.date ? new Date(x.date).getTime() : 0;
                    const dy = y.date ? new Date(y.date).getTime() : 0;
                    return (dy - dx);
                  });

                  const latest = combined.slice(0, 3);

                  return (
                    <ul className="space-y-2">
                      {latest.map(item => {
                        // derive username and description cleanly
                        const raw = item.raw || {};
                        const username = (raw.nama_depan || raw.nama_belakang)
                          ? `${(raw.nama_depan || '').trim()} ${(raw.nama_belakang || '').trim()}`.trim()
                          : (raw.email || raw.user_email || (raw.user_id ? `User ${raw.user_id}` : (item.title || 'Unknown')));
                        let description = '';
                        if (item.type === 'failedPayment') {
                          const amt = item.raw?.total_bayar ?? item.raw?.amount ?? '-';
                          description = `Pembayaran gagal · Amount: ${amt}`;
                        } else if (item.type === 'multipleFailures') {
                          description = `Beberapa pembayaran gagal · Count: ${item.raw?.failed_count ?? item.subtitle}`;
                        } else if (item.type === 'anomaly') {
                          description = `Anomali transaksi · Transaksi: ${item.raw?.transaction_count ?? '-'} · Gagal: ${item.raw?.failed_count ?? '-'}`;
                        } else {
                          description = item.subtitle || '';
                        }

                        return (
                          <li 
                            key={item.id} 
                            onClick={async () => {
                              // Mark as read
                              const readNotifications = JSON.parse(localStorage.getItem('readNotifications') || '[]');
                              if (!readNotifications.includes(item.id)) {
                                readNotifications.push(item.id);
                                localStorage.setItem('readNotifications', JSON.stringify(readNotifications));
                                // Dispatch event to update header count
                                window.dispatchEvent(new CustomEvent('notificationRead'));
                              }
                              onClose();
                              navigate(`/admin/fraud-report/${item.type}/${item.id}`);
                            }}
                            className="flex gap-3 items-center p-3 bg-white rounded border border-gray-100 shadow-sm cursor-pointer hover:border-blue-300 hover:bg-blue-50 transition-colors"
                          >
                            <div className={`w-12 h-12 flex-shrink-0 rounded-full ${typeColor(item.type)} text-white flex items-center justify-center text-sm font-semibold`}>{getInitials(username)}</div>
                            <div className="flex-1 min-w-0">
                              <div className="flex items-start justify-between gap-2">
                                <div className="text-sm font-semibold text-gray-900 truncate">{username}</div>
                                {item.date && <div className="text-xs text-gray-400 ml-2 whitespace-nowrap">{smallDate(item.date)}</div>}
                              </div>
                              <div className="text-xs text-gray-600 mt-1 truncate">{description}</div>
                            </div>
                          </li>
                        );
                      })}
                    </ul>
                  );
                })()}
              </div>
            )}
          </div>
        )}
      </div>

      {/* Footer */}
      {!loading && !error && alerts && (alerts.total ?? 0) > 0 && (
        <div className="px-5 py-3 border-t border-gray-200 text-center">
          <button 
            onClick={() => {
              onClose();
              navigate('/admin/notifications');
            }}
            className="text-sm text-blue-600 hover:text-blue-700 font-medium"
          >
            Lihat semua notifikasi
          </button>
        </div>
      )}
    </div>
  );
};

export default NotificationPanel;