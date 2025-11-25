// frontend/src/pages/AdminCategoryManagementPage.jsx

import React, { useState, useEffect, useCallback } from 'react';
import { useToast } from '../components/organisms/ToastProvider';
import { Sidebar } from '../components/organisms/Sidebar';
import { Header } from '../components/organisms/Header';
import { adminKategoriService } from '../services/adminKategoriService';
import Button from '../components/atoms/Button';
import Badge from '../components/atoms/Badge';
import { Plus, Search, Edit2, Trash2, Eye, ToggleLeft, ToggleRight } from 'lucide-react';

// Import komponen Organism yang dipisahkan
import { CategoryManagementToolbar } from '../components/organisms/CategoryManagementToolbar';
import { CategoryTable } from '../components/organisms/CategoryTable'; 

// =================================================================
// UTILITY FUNCTION 
// =================================================================

/**
 * Format timestamp atau string tanggal menjadi format lokal Indonesia yang lengkap.
 */
function formatDate(dt) {
  try {
    return new Date(dt).toLocaleString('id-ID', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  } catch (e) {
    return dt;
  }
}

// =================================================================
// INTERNAL COMPONENTS (Modals & Pagination)
// =================================================================

// Pagination Component (Dibiarkan di sini untuk konsistensi)
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

// Add/Edit Category Modal
function CategoryFormModal({ 
  isOpen, 
  onClose, 
  category, 
  onSaved,
  isEdit = false 
}) {
  const [formData, setFormData] = useState({
    nama: '',
    deskripsi: '',
    icon: ''
  });
  const [saving, setSaving] = useState(false);
  const toast = useToast();

  useEffect(() => {
    if (isOpen) {
        if (category && isEdit) {
            setFormData({
                nama: category.nama || '',
                deskripsi: category.deskripsi || '',
                icon: category.icon || ''
            });
        } else {
            setFormData({
                nama: '',
                deskripsi: '',
                icon: ''
            });
        }
    }
  }, [category, isEdit, isOpen]);

  if (!isOpen) return null;

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!formData.nama.trim()) {
      toast.show('Nama kategori harus diisi', 'error');
      return;
    }

    setSaving(true);
    try {
      let response;
      if (isEdit && category) {
        response = await adminKategoriService.updateKategori(category.id, formData);
      } else {
        response = await adminKategoriService.createKategori(formData);
      }

      if (response && response.success) {
        toast.show(response.message || `Kategori berhasil ${isEdit ? 'diperbarui' : 'ditambahkan'}`, 'success');
        onSaved();
      } else {
        throw new Error(response.message || `Gagal ${isEdit ? 'memperbarui' : 'menambahkan'} kategori`);
      }
    } catch (err) {
      console.error('Error saving category:', err);
      toast.show(err.message || 'Terjadi kesalahan saat menyimpan kategori', 'error');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      <div 
        className="fixed inset-0 bg-black bg-opacity-50 transition-opacity"
        onClick={onClose}
      />

      <div className="flex min-h-screen items-center justify-center p-4">
        <div 
          className="relative bg-white rounded-lg shadow-xl w-full max-w-xl transform transition-all"
          onClick={(e) => e.stopPropagation()}
        >
          <div className="px-6 py-4 border-b border-gray-200">
            <h3 className="text-xl font-bold text-black">
              {isEdit ? 'Edit Kategori' : 'Tambah Kategori Baru'}
            </h3>
          </div>

          <form onSubmit={handleSubmit}>
            <div className="px-6 py-4 space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Nama Kategori <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  name="nama"
                  value={formData.nama}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#4782BE] focus:border-transparent"
                  placeholder="Masukkan nama kategori"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Deskripsi
                </label>
                <textarea
                  name="deskripsi"
                  value={formData.deskripsi}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#4782BE] focus:border-transparent min-h-[100px]"
                  placeholder="Masukkan deskripsi kategori (opsional)"
                  rows={4}
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Icon URL
                </label>
                <input
                  type="text"
                  name="icon"
                  value={formData.icon}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#4782BE] focus:border-transparent"
                  placeholder="https://example.com/icon.png"
                />
                {formData.icon && (
                  <div className="mt-2">
                    <p className="text-xs text-gray-500 mb-1">Preview:</p>
                    <img 
                      src={formData.icon} 
                      alt="Preview" 
                      className="w-16 h-16 object-cover rounded-lg border border-gray-200"
                      onError={(e) => {
                        e.target.style.display = 'none';
                      }}
                    />
                  </div>
                )}
              </div>
            </div>

            <div className="px-6 py-4 bg-gray-50 border-t border-gray-200 flex justify-end gap-3">
              <Button
                type="button"
                variant="outline"
                onClick={onClose}
                disabled={saving}
                className="bg-gray-200 text-gray-700 hover:bg-gray-300"
              >
                Batal
              </Button>
              <Button
                type="submit"
                variant="primary"
                disabled={saving}
                className="bg-[#4782BE] hover:bg-[#3A6FA0] text-white"
              >
                {saving ? 'Menyimpan...' : (isEdit ? 'Simpan Perubahan' : 'Tambah Kategori')}
              </Button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}


// Delete Confirmation Modal
function DeleteModal({ 
  isOpen, 
  onClose, 
  category, 
  onConfirm 
}) {
  if (!isOpen || !category) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      <div 
        className="fixed inset-0 bg-black bg-opacity-50 transition-opacity"
        onClick={onClose}
      />

      <div className="flex min-h-screen items-center justify-center p-4">
        <div 
          className="relative bg-white rounded-lg shadow-xl w-full max-w-md transform transition-all"
          onClick={(e) => e.stopPropagation()}
        >
          <div className="px-6 py-4 border-b border-gray-200">
            <h3 className="text-xl font-bold text-black">Hapus Kategori</h3>
          </div>

          <div className="px-6 py-4">
            <p className="text-gray-700">
              Apakah Anda yakin ingin menghapus kategori <strong>{category.nama}</strong>?
            </p>
            <p className="text-sm text-red-600 mt-2">
              Tindakan ini tidak dapat dibatalkan. Jika kategori ini memiliki sub-kategori atau layanan terkait, penghapusan mungkin akan gagal.
            </p>
          </div>

          <div className="px-6 py-4 bg-gray-50 border-t border-gray-200 flex justify-end gap-3">
            <Button
              variant="outline"
              onClick={onClose}
              className="bg-gray-200 text-gray-700 hover:bg-gray-300"
            >
              Batal
            </Button>
            <Button
              variant="primary"
              onClick={onConfirm}
              className="bg-[#EF4444] hover:bg-red-600 text-white"
            >
              Hapus
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}

// Category Detail Modal
function CategoryDetailModal({ 
  isOpen, 
  onClose, 
  category 
}) {
  if (!isOpen || !category) return null;

  const isActive = category.is_active;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      <div 
        className="fixed inset-0 bg-black bg-opacity-50 transition-opacity"
        onClick={onClose}
      />

      <div className="flex min-h-screen items-center justify-center p-4">
        <div 
          className="relative bg-white rounded-lg shadow-xl w-full max-w-2xl transform transition-all"
          onClick={(e) => e.stopPropagation()}
        >
          <div className="px-6 py-4 border-b border-gray-200">
            <h3 className="text-xl font-bold text-black">Detail Kategori</h3>
          </div>

          <div className="px-6 py-4">
            <div className="space-y-4">
              {category.icon && (
                <div>
                  <label className="text-sm font-medium text-gray-700">Icon</label>
                  <div className="mt-2">
                    <img 
                      src={category.icon} 
                      alt={category.nama} 
                      className="w-20 h-20 object-cover rounded-lg border border-gray-200"
                    />
                  </div>
                </div>
              )}
              <div>
                <label className="text-sm font-medium text-gray-700">Nama Kategori</label>
                <p className="text-gray-900">{category.nama || 'N/A'}</p>
              </div>
              <div>
                <label className="text-sm font-medium text-gray-700">Slug</label>
                <p className="text-gray-900">{category.slug || '-'}</p>
              </div>
              {category.deskripsi && (
                <div>
                  <label className="text-sm font-medium text-gray-700">Deskripsi</label>
                  <p className="text-gray-900">{category.deskripsi}</p>
                </div>
              )}
              <div>
                <label className="text-sm font-medium text-gray-700">Status</label>
                <div className="mt-1">
                  <Badge variant={isActive ? 'success' : 'error'}>
                    {isActive ? 'Aktif' : 'Nonaktif'}
                  </Badge>
                </div>
              </div>
              <div>
                <label className="text-sm font-medium text-gray-700">Dibuat Pada</label>
                <p className="text-gray-900">{formatDate(category.created_at)}</p>
              </div>
              {category.updated_at && (
                <div>
                  <label className="text-sm font-medium text-gray-700">Terakhir Diperbarui</label>
                  <p className="text-gray-900">{formatDate(category.updated_at)}</p>
                </div>
              )}
            </div>
          </div>

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


// =================================================================
// MAIN COMPONENT: AdminCategoryManagementPage
// =================================================================

export default function AdminCategoryManagementPage() {
  const toast = useToast();
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  
  // Modals
  const [addModalOpen, setAddModalOpen] = useState(false);
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [detailModalOpen, setDetailModalOpen] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState(null);

  const loadCategories = useCallback(async () => {
    setLoading(true);
    try {
      const params = {};
      if (searchQuery) params.search = searchQuery;
      
      if (statusFilter !== 'all') {
        params.status = statusFilter;
    }
      const response = await adminKategoriService.getAll(params);
      
      if (response && response.success) {
        setCategories(response.data || []);
      } else {
        toast.show(response.message || 'Gagal memuat kategori', 'error');
        setCategories([]);
      }
    } catch (error) {
      console.error('Error loading categories:', error);
      toast.show('Terjadi kesalahan saat memuat data kategori', 'error');
      setCategories([]);
    } finally {
      setLoading(false);
    }
  }, [searchQuery, statusFilter, toast]);

  // useEffect tetap sama, memastikan debounce diterapkan ke search dan filter
  useEffect(() => {
    const handler = setTimeout(() => {
      loadCategories();
    }, 300);

    return () => clearTimeout(handler);
  }, [searchQuery, statusFilter, loadCategories]);

  const handleToggleStatus = async (category) => {
    try {
      const newStatus = !category.is_active;
      const response = await adminKategoriService.toggleStatus(category.id, newStatus);
      
      if (response && response.success) {
        toast.show(response.message || 'Status kategori berhasil diubah', 'success');
        loadCategories();
      } else {
        toast.show(response.message || 'Gagal mengubah status kategori', 'error');
      }
    } catch (error) {
      console.error('Error toggling status:', error);
      toast.show('Terjadi kesalahan saat mengubah status', 'error');
    }
  };

  /**
   * PERBAIKAN BUG: Menangani kegagalan penghapusan dan memastikan modal ditutup.
   */
  const handleDeleteCategory = async () => {
    if (!selectedCategory) return;
    
    try {
      const response = await adminKategoriService.deleteKategori(selectedCategory.id);
      
      if (response && response.success) {
        toast.show(response.message || 'Kategori berhasil dihapus', 'success');
        loadCategories();
      } else {
        const defaultMessage = 'Gagal menghapus kategori. Pastikan kategori tidak memiliki sub-kategori atau layanan yang terikat.';
        toast.show(response.message || defaultMessage, 'error');
      }
    } catch (error) {
      console.error('Error deleting category:', error);
      const defaultMessage = 'Terjadi kesalahan saat menghapus kategori.';
      toast.show(error.message || defaultMessage, 'error');
    } finally {
      // Baris ini memastikan modal ditutup terlepas dari berhasil/gagal (Fix bug)
      setDeleteModalOpen(false); 
      setSelectedCategory(null);
    }
  };


  return (
    <div className="flex h-screen bg-[#DBE2EF]">
      <Sidebar activeMenu="kategori" />
      
      <div className="flex-1 overflow-y-auto"> 
        <Header />
        
        <div className="p-6">
          <div className="bg-white rounded-lg border border-[#D8E3F3] overflow-hidden">
            
            {/* Toolbar (Menggunakan nama baru dan komponen yang dipisahkan) */}
            <CategoryManagementToolbar
              searchQuery={searchQuery}
              onSearchChange={setSearchQuery}
              statusFilter={statusFilter}
              onStatusFilterChange={setStatusFilter}
              onRefresh={loadCategories}
              onAddNew={() => setAddModalOpen(true)}
              totalCategories={categories.length}
              displayedCategories={categories.length}
              loading={loading}
            />

            {/* Table (Komponen dipisahkan) */}
            <CategoryTable 
              categories={categories}
              onEdit={(category) => {
                setSelectedCategory(category);
                setEditModalOpen(true);
              }}
              onDelete={(category) => {
                setSelectedCategory(category);
                setDeleteModalOpen(true);
              }}
              onToggle={handleToggleStatus}
              onDetail={(category) => {
                setSelectedCategory(category);
                setDetailModalOpen(true);
              }}
              loading={loading}
              formatDate={formatDate} // Meneruskan fungsi sebagai prop
            />

            {/* Modals (Komponen tetap di sini) */}
            <CategoryFormModal
              isOpen={addModalOpen}
              onClose={() => setAddModalOpen(false)}
              onSaved={() => {
                setAddModalOpen(false);
                loadCategories();
              }}
              isEdit={false}
            />

            <CategoryFormModal
              isOpen={editModalOpen}
              onClose={() => {
                setEditModalOpen(false);
                setSelectedCategory(null);
              }}
              category={selectedCategory}
              onSaved={() => {
                setEditModalOpen(false);
                setSelectedCategory(null);
                loadCategories();
              }}
              isEdit={true}
            />

            <DeleteModal
              isOpen={deleteModalOpen}
              onClose={() => {
                setDeleteModalOpen(false);
                setSelectedCategory(null);
              }}
              category={selectedCategory}
              onConfirm={handleDeleteCategory}
            />

            <CategoryDetailModal
              isOpen={detailModalOpen}
              onClose={() => {
                setDetailModalOpen(false);
                setSelectedCategory(null);
              }}
              category={selectedCategory}
            />
          </div>
        </div>
      </div>
    </div>
  );
}