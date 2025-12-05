import React, { useState, useEffect, useMemo } from 'react';
import { useToast } from '../../components/Fragments/Common/ToastProvider';
import { Sidebar } from '../../components/Fragments/Admin/Sidebar';
import { Header } from '../../components/Fragments/Admin/Header';
import { adminService } from '../../services/adminService';
import Button from '../../components/Elements/Buttons/Button';
import Badge from '../../components/Elements/Common/Badge';
import { Search, Filter, Download, ChevronDown } from 'lucide-react';
import jsPDF from 'jspdf';
import 'jspdf-autotable';

// Status badge variants
const getStatusBadge = (status) => {
  const statusMap = {
    menunggu_pembayaran: { label: 'Menunggu Pembayaran', variant: 'warning', bgClass: 'bg-yellow-100 text-yellow-800' },
    dibayar: { label: 'Dibayar', variant: 'info', bgClass: 'bg-blue-100 text-blue-800' },
    dikerjakan: { label: 'Dikerjakan', variant: 'info', bgClass: 'bg-cyan-100 text-cyan-800' },
    selesai: { label: 'Selesai', variant: 'success', bgClass: 'bg-green-100 text-green-800' },
    dibatalkan: { label: 'Dibatalkan', variant: 'error', bgClass: 'bg-red-100 text-red-800' },
  };
  return statusMap[status] || { label: status || 'Unknown', variant: 'default', bgClass: 'bg-gray-100 text-gray-800' };
};

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

// Transaction Table Component
function TransactionTable({ transactions, onRowClick }) {
  if (!transactions || transactions.length === 0) {
    return (
      <div className="p-8 text-center text-gray-500">
        Tidak ada transaksi ditemukan
      </div>
    );
  }

  return (
    <div className="overflow-x-auto">
      <table className="w-full">
        <thead>
          <tr className="bg-[#F8FAFC] border-b border-[#E2E8F0]">
            <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">ID Order</th>
            <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">Klien</th>
            <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">Freelancer</th>
            <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">Harga</th>
            <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">Status</th>
          </tr>
        </thead>
        <tbody>
          {transactions.map((transaction, index) => {
            const statusInfo = getStatusBadge(transaction.status);
            return (
              <tr
                key={transaction.id || index}
                className="border-b border-[#E2E8F0] hover:bg-gray-50 cursor-pointer transition-colors"
                onClick={() => onRowClick && onRowClick(transaction)}
              >
                <td className="px-6 py-4">
                  <div>
                    <p className="font-medium text-gray-900 text-sm">
                      {transaction.order_title}
                    </p>
                    <p className="text-xs text-gray-500 mt-0.5">
                      Order #{transaction.order_number || transaction.pesanan_id?.slice(0, 8)}
                    </p>
                  </div>
                </td>
                <td className="px-6 py-4">
                  <span className="text-sm text-gray-700">
                    {transaction.client?.full_name || 'N/A'}
                  </span>
                </td>
                <td className="px-6 py-4">
                  <span className="text-sm text-gray-700">
                    {transaction.freelancer?.full_name || 'N/A'}
                  </span>
                </td>
                <td className="px-6 py-4">
                  <span className="text-sm font-medium text-gray-900">
                    Rp {Number(transaction.total || 0).toLocaleString('id-ID')}
                  </span>
                </td>
                <td className="px-6 py-4">
                  <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium ${statusInfo.bgClass}`}>
                    {statusInfo.label}
                  </span>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}

// Toolbar Component
function TransactionToolbar({
  searchQuery,
  onSearchChange,
  statusFilter,
  onStatusFilterChange,
  onExport,
  totalTransactions,
  displayedTransactions
}) {
  const [showStatusDropdown, setShowStatusDropdown] = useState(false);

  const statusOptions = [
    { value: 'all', label: 'Semua Status' },
    { value: 'menunggu_pembayaran', label: 'Menunggu Pembayaran' },
    { value: 'dibayar', label: 'Dibayar' },
    { value: 'dikerjakan', label: 'Dikerjakan' },
    { value: 'selesai', label: 'Selesai' },
    { value: 'dibatalkan', label: 'Dibatalkan' },
  ];

  const selectedStatus = statusOptions.find(opt => opt.value === statusFilter);

  return (
    <div className="p-4 border-b border-[#E2E8F0]">
      <div className="flex flex-wrap items-center justify-between gap-4">
        {/* Search */}
        <div className="flex items-center gap-3 flex-1">
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
            <input
              type="text"
              placeholder="Cari"
              value={searchQuery}
              onChange={(e) => onSearchChange(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#4782BE] focus:border-transparent text-sm"
            />
          </div>

          {/* Status Filter Dropdown */}
          <div className="relative">
            <button
              onClick={() => setShowStatusDropdown(!showStatusDropdown)}
              className="flex items-center gap-2 px-4 py-2 border border-gray-300 rounded-lg bg-white hover:bg-gray-50 text-sm"
            >
              <Filter size={16} className="text-gray-500" />
              <span>{selectedStatus?.label || 'Semua Status'}</span>
              <ChevronDown size={16} className="text-gray-500" />
            </button>

            {showStatusDropdown && (
              <>
                <div
                  className="fixed inset-0 z-10"
                  onClick={() => setShowStatusDropdown(false)}
                />
                <div className="absolute right-0 mt-2 w-48 bg-white border border-gray-200 rounded-lg shadow-lg z-20">
                  {statusOptions.map((option) => (
                    <button
                      key={option.value}
                      onClick={() => {
                        onStatusFilterChange(option.value);
                        setShowStatusDropdown(false);
                      }}
                      className={`w-full text-left px-4 py-2 text-sm hover:bg-gray-100 first:rounded-t-lg last:rounded-b-lg ${
                        statusFilter === option.value ? 'bg-[#4782BE]/10 text-[#4782BE] font-medium' : 'text-gray-700'
                      }`}
                    >
                      {option.label}
                    </button>
                  ))}
                </div>
              </>
            )}
          </div>
        </div>

        {/* Export Button */}
        <Button
          variant="primary"
          onClick={() => onExport('pdf')}
          className="flex items-center gap-2 bg-[#4782BE] hover:bg-[#3a6da0]"
        >
          Unduh PDF
        </Button>
      </div>
    </div>
  );
}

export default function AdminTransactionsPage() {
  const toast = useToast();
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [page, setPage] = useState(1);
  const [total, setTotal] = useState(0);
  const [limit] = useState(10);

  useEffect(() => {
    setPage(1);
  }, [statusFilter]);

  useEffect(() => {
    fetchTransactions();
  }, [page, statusFilter]);

  const fetchTransactions = async () => {
    try {
      setLoading(true);
      setError(null);

      const filters = {
        page,
        limit,
        status: statusFilter !== 'all' ? statusFilter : undefined
      };

      const response = await adminService.getTransactions(filters);

      if (response.success) {
        setTransactions(response.data || []);
        setTotal(response.pagination?.total || response.data?.length || 0);
      } else {
        throw new Error(response.message || 'Failed to fetch transactions');
      }

      setLoading(false);
    } catch (err) {
      console.error('Error fetching transactions:', err);
      setError(err.message || 'Terjadi kesalahan saat memuat data transaksi.');
      setLoading(false);
    }
  };

  const handleExportPDF = () => {
    try {
      const doc = new jsPDF();

      // Title
      doc.setFontSize(18);
      doc.setFont('helvetica', 'bold');
      doc.text('Laporan Daftar Transaksi', 14, 22);

      // Subtitle with date
      doc.setFontSize(10);
      doc.setFont('helvetica', 'normal');
      doc.text(`Tanggal: ${new Date().toLocaleDateString('id-ID', {
        day: 'numeric',
        month: 'long',
        year: 'numeric'
      })}`, 14, 30);

      let startY = 36;
      if (statusFilter !== 'all') {
        const statusLabel = getStatusBadge(statusFilter).label;
        doc.text(`Filter Status: ${statusLabel}`, 14, 36);
        startY = 42;
      }

      // Prepare table data
      const tableData = filteredTransactions.map((t, idx) => [
        idx + 1,
        t.order_number || t.pesanan_id?.slice(0, 8) || '-',
        t.order_title || '-',
        t.client?.full_name || 'N/A',
        t.freelancer?.full_name || 'N/A',
        `Rp ${Number(t.total || 0).toLocaleString('id-ID')}`,
        getStatusBadge(t.status).label
      ]);

      // Add table
      doc.autoTable({
        startY: startY,
        head: [['No', 'No. Order', 'Judul', 'Klien', 'Freelancer', 'Harga', 'Status']],
        body: tableData,
        theme: 'striped',
        headStyles: {
          fillColor: [71, 130, 190],
          textColor: 255,
          fontStyle: 'bold',
          fontSize: 9
        },
        bodyStyles: {
          fontSize: 8
        },
        columnStyles: {
          0: { cellWidth: 10 },
          1: { cellWidth: 25 },
          2: { cellWidth: 40 },
          3: { cellWidth: 30 },
          4: { cellWidth: 30 },
          5: { cellWidth: 25 },
          6: { cellWidth: 25 }
        },
        margin: { left: 14, right: 14 }
      });

      // Footer
      const pageCount = doc.internal.getNumberOfPages();
      for (let i = 1; i <= pageCount; i++) {
        doc.setPage(i);
        doc.setFontSize(8);
        doc.setFont('helvetica', 'normal');
        doc.text(
          `SkillConnect - Halaman ${i} dari ${pageCount}`,
          doc.internal.pageSize.width / 2,
          doc.internal.pageSize.height - 10,
          { align: 'center' }
        );
      }

      // Save PDF
      const fileName = `transaksi_${new Date().toISOString().split('T')[0]}.pdf`;
      doc.save(fileName);

      toast.show('PDF berhasil diunduh', 'success');
    } catch (err) {
      console.error('Error generating PDF:', err);
      toast.show('Gagal membuat PDF', 'error');
    }
  };

  const handleRowClick = (transaction) => {
    // Could navigate to detail page or show modal
    console.log('Transaction clicked:', transaction);
  };

  const filteredTransactions = useMemo(() => {
    return transactions.filter(transaction => {
      if (searchQuery) {
        const searchLower = searchQuery.toLowerCase();
        const orderTitle = (transaction.order_title || '').toLowerCase();
        const orderNumber = (transaction.order_number || '').toLowerCase();
        const clientName = (transaction.client?.full_name || '').toLowerCase();
        const freelancerName = (transaction.freelancer?.full_name || '').toLowerCase();

        if (!orderTitle.includes(searchLower) &&
            !orderNumber.includes(searchLower) &&
            !clientName.includes(searchLower) &&
            !freelancerName.includes(searchLower)) {
          return false;
        }
      }
      return true;
    });
  }, [transactions, searchQuery]);

  const totalPages = Math.ceil(total / limit);

  if (loading && page === 1) {
    return (
      <div className="flex items-center justify-center h-screen bg-[#DBE2EF]">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-[#4782BE] border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
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

        <div className="p-6">
          {/* Combined Toolbar and Table */}
          <div className="bg-white rounded-lg border border-[#D8E3F3] overflow-hidden">
            {/* Toolbar */}
            <TransactionToolbar
              searchQuery={searchQuery}
              onSearchChange={setSearchQuery}
              statusFilter={statusFilter}
              onStatusFilterChange={setStatusFilter}
              onExport={handleExportPDF}
              totalTransactions={transactions.length}
              displayedTransactions={filteredTransactions.length}
            />

            {/* Table */}
            <TransactionTable
              transactions={filteredTransactions}
              onRowClick={handleRowClick}
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
