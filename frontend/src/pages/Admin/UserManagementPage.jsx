import React, { useState, useEffect, useMemo } from 'react';
import { useToast } from '../../components/Fragments/Common/ToastProvider';
import { Sidebar } from '../../components/Fragments/Admin/Sidebar';
import { Header } from '../../components/Fragments/Admin/Header';
import { adminService } from '../../services/adminService';
import { UserManagementToolbar } from '../../components/Fragments/Admin/UserManagementToolbar';
import UserTable from '../../components/Fragments/Admin/UserTable';
import Button from '../../components/Elements/Buttons/Button';
import Badge from '../../components/Elements/Common/Badge';
import BlockReasonCard from '../../components/Fragments/Admin/BlockReasonCard';

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

// BlockUserModal Component
function BlockUserModal({ 
  isOpen, 
  onClose, 
  user, 
  onConfirm,
  isBlocking = true 
}) {
  const [reason, setReason] = useState('');
  const toast = useToast();

  if (!isOpen || !user) return null;

  const handleConfirm = () => {
    if (isBlocking && !reason.trim()) {
      toast.show('Silakan masukkan alasan pemblokiran', 'error');
      return;
    }
    onConfirm(reason);
    setReason('');
  };

  const handleClose = () => {
    setReason('');
    onClose();
  };

  const fullName = user.nama_depan && user.nama_belakang 
    ? `${user.nama_depan} ${user.nama_belakang}`
    : user.nama_depan || user.nama_belakang || user.email || 'Pengguna';
  
  const roleText = user.role === 'client' ? 'klien' : user.role === 'freelancer' ? 'freelancer' : 'pengguna';

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
              {isBlocking ? 'Blokir Pengguna' : 'Aktifkan Pengguna'}
            </h3>
          </div>

          {/* Body */}
          <div className="px-6 py-4">
            <p className="text-gray-700 mb-4">
              Anda akan {isBlocking ? 'memblokir' : 'mengaktifkan'} {roleText} <strong>{fullName}</strong>.
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

// UserDetailModal Component
function UserDetailModal({ 
  isOpen, 
  onClose, 
  user 
}) {
  if (!isOpen || !user) return null;

  const fullName = user.nama_depan && user.nama_belakang 
    ? `${user.nama_depan} ${user.nama_belakang}`
    : user.nama_depan || user.nama_belakang || 'N/A';

  const isActive = user.is_active === true || user.is_active === 1 || user.status === 'active';
  const roleText = user.role === 'client' ? 'Klien' : user.role === 'freelancer' ? 'Freelancer' : user.role;

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
            <h3 className="text-xl font-bold text-black">Detail Pengguna</h3>
          </div>

          {/* Body */}
          <div className="px-6 py-4">
            {/* Informasi Umum */}
            <div className="space-y-4 mb-6">
              <div>
                <label className="text-sm font-medium text-gray-700">Nama Lengkap</label>
                <p className="text-gray-900">{fullName}</p>
              </div>
              <div>
                <label className="text-sm font-medium text-gray-700">Email</label>
                <p className="text-gray-900">{user.email || 'N/A'}</p>
              </div>
              <div>
                <label className="text-sm font-medium text-gray-700">Role</label>
                <div className="mt-1">
                  <Badge className="!bg-[#9DBBDD] !text-white">
                    {roleText}
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
              {user.no_telepon && (
                <div>
                  <label className="text-sm font-medium text-gray-700">No. Telepon</label>
                  <p className="text-gray-900">{user.no_telepon}</p>
                </div>
              )}
              {user.kota && (
                <div>
                  <label className="text-sm font-medium text-gray-700">Kota</label>
                  <p className="text-gray-900">{user.kota}{user.provinsi ? `, ${user.provinsi}` : ''}</p>
                </div>
              )}
            </div>

            {/* Detail Pelanggaran (jika diblokir) */}
            {!isActive && (
              <BlockReasonCard blockLog={user.blockLog} />
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

export default function AdminUserManagementPage() {
  const toast = useToast();
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [roleFilter, setRoleFilter] = useState('all');
  const [page, setPage] = useState(1);
  const [total, setTotal] = useState(0);
  const [limit] = useState(10);
  const [blockModalOpen, setBlockModalOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);
  const [isBlocking, setIsBlocking] = useState(true);
  const [detailModalOpen, setDetailModalOpen] = useState(false);
  const [detailUser, setDetailUser] = useState(null);

  useEffect(() => {
    // Reset to page 1 when filters change
    setPage(1);
  }, [statusFilter, roleFilter]);

  useEffect(() => {
    fetchUsers();
  }, [page, statusFilter, roleFilter]);

  const fetchUsers = async () => {
    try {
      setLoading(true);
      setError(null);

      const filters = {
        page,
        limit,
        status: statusFilter !== 'all' ? statusFilter : undefined,
        role: roleFilter !== 'all' ? roleFilter : undefined
      };

      const response = await adminService.getUsers(filters);

      if (response.success) {
        const allUsers = response.data || [];
        // Backend already filters, just set users
        setUsers(allUsers);
        setTotal(response.pagination?.total || allUsers.length);
      } else {
        throw new Error(response.message || 'Failed to fetch users');
      }

      setLoading(false);
    } catch (err) {
      console.error('Error fetching users:', err);
      setError(err.message || 'Terjadi kesalahan saat memuat data pengguna.');
      setLoading(false);
    }
  };

  const handleBlockClick = (user, currentStatus) => {
    setSelectedUser(user);
    setIsBlocking(currentStatus === 'active' || currentStatus === 1);
    setBlockModalOpen(true);
  };

  const handleBlockConfirm = async (reason) => {
    if (!selectedUser) return;

    try {
      let response;
      if (isBlocking) {
        response = await adminService.blockUser(selectedUser.id, reason || 'Violation of terms');
      } else {
        // Some backend implementations require a reason when unblocking.
        // Send a default reason if none provided to avoid 400 from API.
        response = await adminService.unblockUser(selectedUser.id, reason || 'Unblocked by admin');
      }

      if (response.success) {
        toast.show(response.message || 'Berhasil memperbarui status pengguna', 'success');
        setBlockModalOpen(false);
        setSelectedUser(null);
        fetchUsers();
      } else {
        throw new Error(response.message || 'Failed to update user status');
      }
    } catch (err) {
      console.error('Error updating user:', err);
      toast.show(err.message || 'Terjadi kesalahan saat memperbarui status pengguna', 'error');
    }
  };

  const handleExport = async (format = 'csv') => {
    try {
      const response = await adminService.exportReport({
        reportType: 'users',
        format: format,
        filters: {
          status: statusFilter !== 'all' ? statusFilter : undefined,
          role: roleFilter !== 'all' ? roleFilter : undefined,
          search: searchQuery || undefined
        }
      });

      if (response.success) {
        if (format === 'csv' || format === 'excel') {
          // File download handled by browser
          toast.show(`Laporan berhasil diekspor dalam format ${format.toUpperCase()}`, 'success');
        } else {
          toast.show('Laporan berhasil diekspor', 'success');
        }
      } else {
        throw new Error(response.message || 'Failed to export report');
      }
    } catch (err) {
      console.error('Error exporting report:', err);
      toast.show(err.message || 'Terjadi kesalahan saat mengekspor laporan', 'error');
    }
  };

  const handleDetail = async (user) => {
    try {
      // Fetch user details from API
      const response = await adminService.getUserDetails(user.id);
      if (response.success) {
        // If user is blocked, try to get block reason from response or log
        const userData = response.data;
        if (!userData.is_active || userData.is_active === 0) {
          // Try to get block reason from activity log if available
          // For now, we'll use the data from response
          if (!userData.block_reason && userData.blockReason) {
            userData.block_reason = userData.blockReason;
          }
        }
        setDetailUser(userData);
      } else {
        // Fallback to basic user data
        setDetailUser(user);
      }
      setDetailModalOpen(true);
    } catch (err) {
      console.error('Error fetching user details:', err);
      // Fallback to basic user data
      setDetailUser(user);
      setDetailModalOpen(true);
    }
  };

  const filteredUsers = useMemo(() => {
    return users.filter(user => {
      // Filter out admin users
      if (user.role === 'admin') return false;
      
      // Apply search filter
      if (searchQuery) {
        const searchLower = searchQuery.toLowerCase();
        const fullName = `${user.nama_depan || ''} ${user.nama_belakang || ''}`.toLowerCase();
        if (!fullName.includes(searchLower) && !user.email?.toLowerCase().includes(searchLower)) {
          return false;
        }
      }
      
      return true;
    });
  }, [users, searchQuery]);

  const totalPages = Math.ceil(total / limit);

  if (loading && page === 1) {
    return (
      <div className="flex items-center justify-center h-screen bg-[#DBE2EF]">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-[#4782BE] border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600">Memuat data pengguna...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex h-screen bg-[#DBE2EF]">
      <Sidebar activeMenu="users" />
      
      <div className="flex-1 overflow-auto">
        <Header />
        
        <div className="p-6">
          {/* Combined Toolbar and Table */}
          <div className="bg-white rounded-lg border border-[#D8E3F3] overflow-hidden">
            {/* Toolbar */}
            <UserManagementToolbar
              searchQuery={searchQuery}
              onSearchChange={setSearchQuery}
              statusFilter={statusFilter}
              onStatusFilterChange={setStatusFilter}
              roleFilter={roleFilter}
              onRoleFilterChange={setRoleFilter}
              onExport={handleExport}
              totalUsers={users.length}
              displayedUsers={filteredUsers.length}
            />

            {/* Table */}
            <UserTable 
              users={filteredUsers}
              onBlock={handleBlockClick}
              onDetail={handleDetail}
            />

            {/* Block User Modal */}
            <BlockUserModal
              isOpen={blockModalOpen}
              onClose={() => {
                setBlockModalOpen(false);
                setSelectedUser(null);
              }}
              user={selectedUser}
              onConfirm={handleBlockConfirm}
              isBlocking={isBlocking}
            />

            {/* User Detail Modal */}
            <UserDetailModal
              isOpen={detailModalOpen}
              onClose={() => {
                setDetailModalOpen(false);
                setDetailUser(null);
              }}
              user={detailUser}
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