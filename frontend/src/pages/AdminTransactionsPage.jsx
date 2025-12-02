import React, { useState, useEffect, useMemo } from 'react';
import { Sidebar } from '../components/organisms/Sidebar';
import { Header } from '../components/organisms/Header';
import { adminService } from '../services/adminService';
import Badge from '../components/atoms/Badge';
import Button from '../components/atoms/Button';

// Simple pagination component reused from other admin pages pattern
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

function formatCurrency(amount) {
  if (!amount && amount !== 0) return '-';
  try {
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      minimumFractionDigits: 0,
    }).format(Number(amount));
  } catch {
    return amount;
  }
}

function formatDate(value) {
  if (!value) return '-';
  const date = new Date(value);
  if (isNaN(date.getTime())) return '-';
  return date.toLocaleString('id-ID', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });
}

export default function AdminTransactionsPage() {
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [page, setPage] = useState(1);
  const [total, setTotal] = useState(0);
  const [limit] = useState(10);

  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [gatewayFilter, setGatewayFilter] = useState('all');

  useEffect(() => {
    // Reset ke halaman pertama jika filter status / gateway berubah
    setPage(1);
  }, [statusFilter, gatewayFilter]);

  useEffect(() => {
    fetchTransactions();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [page, statusFilter, gatewayFilter]);

  const fetchTransactions = async () => {
    try {
      setLoading(true);
      setError(null);

      const filters = {
        page,
        limit,
        status: statusFilter !== 'all' ? statusFilter : undefined,
        paymentGateway: gatewayFilter !== 'all' ? gatewayFilter : undefined,
      };

      const response = await adminService.getTransactions(filters);

      if (response.success) {
        const list = response.data || [];
        setTransactions(list);
        setTotal(response.pagination?.total || list.length);
      } else {
        throw new Error(response.message || 'Gagal memuat daftar transaksi');
      }

      setLoading(false);
    } catch (err) {
      console.error('Error fetching transactions:', err);
      setError(err.message || 'Terjadi kesalahan saat memuat data transaksi.');
      setLoading(false);
    }
  };

  const filteredTransactions = useMemo(() => {
    if (!searchQuery) return transactions;
    const searchLower = searchQuery.toLowerCase();

    return transactions.filter((tx) => {
      const userName = `${tx.user?.nama_depan || ''} ${tx.user?.nama_belakang || ''}`.toLowerCase();
      const email = (tx.user?.email || '').toLowerCase();
      const invoice = (tx.nomor_invoice || '').toLowerCase();
      const transactionId = (tx.transaction_id || '').toLowerCase();

      return (
        userName.includes(searchLower) ||
        email.includes(searchLower) ||
        invoice.includes(searchLower) ||
        transactionId.includes(searchLower)
      );
    });
  }, [transactions, searchQuery]);

  const totalPages = Math.ceil(total / limit) || 1;

  const getStatusVariant = (status) => {
    if (!status) return 'default';
    const normalized = status.toLowerCase();
    if (normalized === 'berhasil' || normalized === 'paid' || normalized === 'success') return 'success';
    if (normalized === 'pending') return 'warning';
    if (normalized === 'gagal' || normalized === 'failed' || normalized === 'expired') return 'error';
    return 'default';
  };

  if (loading && page === 1) {
    return (
      <div className="flex items-center justify-center h-screen bg-[#DBE2EF]">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-[#4782BE] border-t-transparent rounded-full animate-spin mx-auto mb-4" />
          <p className="text-gray-600">Memuat data transaksi...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex h-screen bg-[#DBE2EF]">
      <Sidebar activeMenu="transactions" />

      <div className="flex-1 overflow-auto">
        <Header />

        <div className="p-6 space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
            <div>
              <h1 className="text-2xl font-bold text-[#1D375B]">Daftar Transaksi</h1>
              <p className="text-sm text-gray-600 mt-1">
                Pantau seluruh transaksi pembayaran yang terjadi di platform.
              </p>
            </div>
          </div>

          {/* Filter Bar */}
          <div className="bg-white rounded-lg border border-[#D8E3F3] p-4 flex flex-col md:flex-row gap-3 md:items-end">
            <div className="flex-1">
              <label className="block text-sm font-medium text-gray-700 mb-1">Cari pengguna / invoice / transaksi</label>
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Nama, email, nomor invoice, atau ID transaksi"
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#4782BE]"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Status</label>
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="w-full md:w-40 px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#4782BE]"
              >
                <option value="all">Semua</option>
                <option value="berhasil">Berhasil</option>
                <option value="pending">Pending</option>
                <option value="gagal">Gagal</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Payment Gateway</label>
              <select
                value={gatewayFilter}
                onChange={(e) => setGatewayFilter(e.target.value)}
                className="w-full md:w-44 px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#4782BE]"
              >
                <option value="all">Semua</option>
                <option value="XENDIT">Xendit</option>
                <option value="MIDTRANS">Midtrans</option>
              </select>
            </div>
          </div>

          {/* Table Card */}
          <div className="bg-white rounded-lg border border-[#D8E3F3] overflow-hidden">
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-[#F3F6FC]">
                  <tr>
                    <th className="px-4 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">Tanggal</th>
                    <th className="px-4 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">Pengguna</th>
                    <th className="px-4 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">Invoice</th>
                    <th className="px-4 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">Metode</th>
                    <th className="px-4 py-3 text-right text-xs font-semibold text-gray-700 uppercase tracking-wider">Total Bayar</th>
                    <th className="px-4 py-3 text-center text-xs font-semibold text-gray-700 uppercase tracking-wider">Status</th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {filteredTransactions.length === 0 && (
                    <tr>
                      <td colSpan={6} className="px-4 py-6 text-center text-gray-500 text-sm">
                        {error ? 'Gagal memuat transaksi. Silakan coba lagi.' : 'Belum ada transaksi yang sesuai dengan filter.'}
                      </td>
                    </tr>
                  )}

                  {filteredTransactions.map((tx) => {
                    const fullName = [tx.user?.nama_depan, tx.user?.nama_belakang]
                      .filter(Boolean)
                      .join(' ');
                    const displayName = fullName || tx.user?.email || '-';

                    const paymentLabel = [
                      tx.payment_gateway,
                      tx.metode_pembayaran || tx.channel,
                    ]
                      .filter(Boolean)
                      .join(' · ');

                    const dateToShow = tx.dibayar_pada || tx.created_at;

                    return (
                      <tr key={tx.id} className="hover:bg-[#F9FBFF]">
                        <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-900">
                          {formatDate(dateToShow)}
                        </td>
                        <td className="px-4 py-3 text-sm text-gray-900">
                          <div className="font-medium text-gray-900">{displayName}</div>
                          {tx.user?.email && (
                            <div className="text-xs text-gray-500">{tx.user.email}</div>
                          )}
                        </td>
                        <td className="px-4 py-3 text-sm text-gray-900">
                          <div className="font-mono text-xs text-gray-800">
                            {tx.nomor_invoice || '-'}
                          </div>
                          {tx.transaction_id && (
                            <div className="text-[11px] text-gray-500 mt-0.5">
                              TX: {tx.transaction_id}
                            </div>
                          )}
                        </td>
                        <td className="px-4 py-3 text-sm text-gray-900">
                          {paymentLabel || '-'}
                        </td>
                        <td className="px-4 py-3 text-right whitespace-nowrap text-sm text-gray-900">
                          {formatCurrency(tx.total_bayar)}
                        </td>
                        <td className="px-4 py-3 text-center whitespace-nowrap text-sm">
                          <Badge variant={getStatusVariant(tx.status)}>
                            {(tx.status || '-').toString().charAt(0).toUpperCase() + (tx.status || '-').toString().slice(1)}
                          </Badge>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>

            {/* Footer */}
            <div className="bg-gray-50 px-6 py-4 border-t border-[#D8E3F3] flex flex-col md:flex-row md:items-center md:justify-between gap-3">
              {error && (
                <div className="text-sm text-red-600">
                  {error}
                </div>
              )}

              <Pagination
                currentPage={page}
                totalPages={totalPages}
                onPageChange={setPage}
                className="w-full md:w-auto"
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
