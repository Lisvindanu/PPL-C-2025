// frontend/src/pages/AdminSubCategoryManagementPage.jsx

import React, { useState, useEffect, useCallback } from 'react';
import { useToast } from '../components/organisms/ToastProvider';
import { Sidebar } from '../components/organisms/Sidebar';
import { Header } from '../components/organisms/Header';
import { adminSubKategoriService } from '../services/adminSubKategoriService'; 
import Button from '../components/atoms/Button';
import Badge from '../components/atoms/Badge';

// Import komponen Organism
import { SubCategoryManagementToolbar } from '../components/organisms/SubCategoryManagementToolbar';
import { SubCategoryTable } from '../components/organisms/SubCategoryTable';

// =================================================================
// UTILITY FUNCTION 
// =================================================================
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
// INTERNAL COMPONENTS (Modals)
// =================================================================

// Add/Edit Sub-Category Modal
function SubCategoryFormModal({ 
  isOpen, 
  onClose, 
  subCategory, 
  onSaved,
  isEdit = false 
}) {
  const [formData, setFormData] = useState({
    nama: '',
    id_kategori: '',
    deskripsi: '',
  });
  const [categories, setCategories] = useState([]); 
  const [saving, setSaving] = useState(false);
  const toast = useToast();

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await adminSubKategoriService.getAllCategoriesSimple(); 
        setCategories(response.data || []);
      } catch (error) {
        console.error('Error fetching categories:', error);
      }
    };
    if (isOpen) {
      fetchCategories();
      
      if (subCategory && isEdit) {
        setFormData({
            nama: subCategory.nama || '',
            id_kategori: subCategory.kategoriId || subCategory.id_kategori || '',
            deskripsi: subCategory.deskripsi || '',
        });
      } else {
        setFormData({
            nama: '',
            id_kategori: categories.length > 0 ? categories[0].id : '', 
            deskripsi: '',
        });
      }
    }
  }, [subCategory, isEdit, isOpen]);

  if (!isOpen) return null;

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!formData.nama.trim() || !formData.id_kategori) {
      toast.show('Nama dan Kategori harus diisi', 'error');
      return;
    }

    setSaving(true);
    try {
      let response;
      const dataToSend = { 
        nama: formData.nama, 
        id_kategori: formData.id_kategori, 
        deskripsi: formData.deskripsi 
      };

      if (isEdit && subCategory) {
        response = await adminSubKategoriService.updateSubKategori(subCategory.id, dataToSend);
      } else {
        response = await adminSubKategoriService.createSubKategori(dataToSend);
      }

      if (response && response.success) {
        toast.show(response.message || `Sub Kategori berhasil ${isEdit ? 'diperbarui' : 'ditambahkan'}`, 'success');
        onSaved();
      } else {
        throw new Error(response.message || `Gagal ${isEdit ? 'memperbarui' : 'menambahkan'} Sub Kategori`);
      }
    } catch (err) {
      console.error('Error saving sub category:', err);
      toast.show(err.message || 'Terjadi kesalahan saat menyimpan Sub Kategori', 'error');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      <div className="fixed inset-0 bg-black bg-opacity-50 transition-opacity" onClick={onClose}/>
      <div className="flex min-h-screen items-center justify-center p-4">
        <div className="relative bg-white rounded-lg shadow-xl w-full max-w-xl transform transition-all" onClick={(e) => e.stopPropagation()}>
          <div className="px-6 py-4 border-b border-gray-200">
            <h3 className="text-xl font-bold text-black">
              {isEdit ? 'Edit Sub Kategori' : 'Tambah Sub Kategori Baru'}
            </h3>
          </div>
          <form onSubmit={handleSubmit}>
            <div className="px-6 py-4 space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Nama Sub Kategori <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  name="nama"
                  value={formData.nama}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#4782BE] focus:border-transparent"
                  placeholder="Masukkan nama Sub Kategori"
                  required
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Kategori <span className="text-red-500">*</span>
                </label>
                <select
                  name="id_kategori"
                  value={formData.id_kategori}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#4782BE] focus:border-transparent bg-white"
                  required
                  disabled={categories.length === 0}
                >
                    <option value="">Pilih Kategori</option>
                    {categories.length === 0 && <option value="">Memuat Kategori...</option>}
                    {categories.map(cat => (
                        <option key={cat.id} value={cat.id}>
                            {cat.nama}
                        </option>
                    ))}
                </select>
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
                  placeholder="Masukkan deskripsi (opsional)"
                  rows={4}
                />
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
                {saving ? 'Menyimpan...' : (isEdit ? 'Simpan Perubahan' : 'Tambah Sub Kategori')}
              </Button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}

// Delete Confirmation Modal
function DeleteSubCategoryModal({ 
  isOpen, 
  onClose, 
  subCategory, 
  onConfirm 
}) {
  if (!isOpen || !subCategory) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      <div className="fixed inset-0 bg-black bg-opacity-50 transition-opacity" onClick={onClose} />
      <div className="flex min-h-screen items-center justify-center p-4">
        <div className="relative bg-white rounded-lg shadow-xl w-full max-w-md transform transition-all" onClick={(e) => e.stopPropagation()}>
          <div className="px-6 py-4 border-b border-gray-200">
            <h3 className="text-xl font-bold text-black">Hapus Sub Kategori</h3>
          </div>

          <div className="px-6 py-4">
            <p className="text-gray-700">
              Apakah Anda yakin ingin menghapus Sub Kategori <strong>{subCategory.nama}</strong>?
            </p>
            <p className="text-sm text-red-600 mt-2">
              Tindakan ini tidak dapat dibatalkan. Menghapus Sub Kategori dapat menyebabkan error pada layanan yang terikat.
            </p>
          </div>

          <div className="px-6 py-4 bg-gray-50 border-t border-gray-200 flex justify-end gap-3">
            <Button variant="outline" onClick={onClose} className="bg-gray-200 text-gray-700 hover:bg-gray-300">
              Batal
            </Button>
            <Button variant="primary" onClick={onConfirm} className="bg-[#EF4444] hover:bg-red-600 text-white">
              Hapus
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}

// Sub-Category Detail Modal
function SubCategoryDetailModal({ 
  isOpen, 
  onClose, 
  subCategory 
}) {
  if (!isOpen || !subCategory) return null;

  const isActive = subCategory.is_active;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      <div className="fixed inset-0 bg-black bg-opacity-50 transition-opacity" onClick={onClose} />
      <div className="flex min-h-screen items-center justify-center p-4">
        <div className="relative bg-white rounded-lg shadow-xl w-full max-w-2xl transform transition-all" onClick={(e) => e.stopPropagation()}>
          <div className="px-6 py-4 border-b border-gray-200">
            <h3 className="text-xl font-bold text-black">Detail Sub Kategori</h3>
          </div>

          <div className="px-6 py-4">
            <div className="space-y-4">
              <div>
                <label className="text-sm font-medium text-gray-700">Nama Sub Kategori</label>
                <p className="text-gray-900">{subCategory.nama || 'N/A'}</p>
              </div>
              <div>
                <label className="text-sm font-medium text-gray-700">Kategori</label>
                <p className="text-gray-900">{subCategory.kategori?.nama || subCategory.kategoriInduk || 'N/A'}</p>
              </div>
              <div>
                <label className="text-sm font-medium text-gray-700">Slug</label>
                <p className="text-gray-900">{subCategory.slug || '-'}</p>
              </div>
              {subCategory.deskripsi && (
                <div>
                  <label className="text-sm font-medium text-gray-700">Deskripsi</label>
                  <p className="text-gray-900">{subCategory.deskripsi}</p>
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
                <p className="text-gray-900">{formatDate(subCategory.created_at)}</p>
              </div>
              {subCategory.updated_at && (
                <div>
                  <label className="text-sm font-medium text-gray-700">Terakhir Diperbarui</label>
                  <p className="text-gray-900">{formatDate(subCategory.updated_at)}</p>
                </div>
              )}
            </div>
          </div>

          <div className="px-6 py-4 bg-gray-50 border-t border-gray-200 flex justify-end">
            <Button variant="outline" onClick={onClose} className="bg-[#B3B3B3] text-white hover:bg-gray-500">
              Kembali
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}


// =================================================================
// MAIN COMPONENT: AdminSubCategoryManagementPage
// =================================================================

export default function AdminSubCategoryManagementPage() {
  const toast = useToast();
  const [subCategories, setSubCategories] = useState([]);
  const [loading, setLoading] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  
  // Modals
  const [addModalOpen, setAddModalOpen] = useState(false);
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [detailModalOpen, setDetailModalOpen] = useState(false);
  const [selectedSubCategory, setSelectedSubCategory] = useState(null);

  const loadSubCategories = useCallback(async () => {
    setLoading(true);
    try {
      const params = {};
      
      // Tambahkan search parameter
      if (searchQuery) {
        params.search = searchQuery;
      }
      
      // Tambahkan status filter (sama seperti kategori)
      if (statusFilter !== 'all') {
        params.status = statusFilter;
      }

      console.log("🔵 FRONTEND - PARAMS DIKIRIM:", params);
      
      const response = await adminSubKategoriService.getAll(params);
      
      if (response && response.success) {
        setSubCategories(response.data || []);
      } else {
        toast.show(response.message || 'Gagal memuat sub kategori', 'error');
        setSubCategories([]);
      }
    } catch (error) {
      console.error('Error loading sub categories:', error);
      toast.show('Terjadi kesalahan saat memuat data sub kategori', 'error');
      setSubCategories([]);
    } finally {
      setLoading(false);
    }
  }, [searchQuery, statusFilter, toast]);

  useEffect(() => {
    const handler = setTimeout(() => {
      loadSubCategories();
    }, 300);

    return () => clearTimeout(handler);
  }, [searchQuery, statusFilter, loadSubCategories]);

  const handleToggleStatus = async (subCategory) => {
    try {
      const newStatus = !subCategory.is_active;
      const response = await adminSubKategoriService.toggleStatus(subCategory.id, newStatus);
      
      if (response && response.success) {
        toast.show(response.message || 'Status sub kategori berhasil diubah', 'success');
        loadSubCategories();
      } else {
        toast.show(response.message || 'Gagal mengubah status sub kategori', 'error');
      }
    } catch (error) {
      console.error('Error toggling status:', error);
      toast.show('Terjadi kesalahan saat mengubah status', 'error');
    }
  };

  const handleDeleteSubCategory = async () => {
    if (!selectedSubCategory) return;
    
    try {
      const response = await adminSubKategoriService.deleteSubKategori(selectedSubCategory.id);
      
      if (response && response.success) {
        toast.show(response.message || 'Sub Kategori berhasil dihapus', 'success');
        loadSubCategories();
      } else {
        const defaultMessage = 'Gagal menghapus Sub Kategori. Pastikan tidak ada layanan yang terikat.';
        toast.show(response.message || defaultMessage, 'error');
      }
    } catch (error) {
      console.error('Error deleting sub category:', error);
      const backendMessage = error.response?.data?.message || error.response?.message;
      const defaultMessage = 'Terjadi kesalahan saat menghapus Sub Kategori.';
      toast.show(backendMessage || error.message || defaultMessage, 'error');
    } finally {
      setDeleteModalOpen(false); 
      setSelectedSubCategory(null);
    }
  };


  return (
    <div className="flex h-screen bg-[#DBE2EF] overflow-x-hidden"> 
      <Sidebar activeMenu="subkategori" />
      
      <div className="flex-1 overflow-y-auto"> 
        <Header />
        
        <div className="p-6">
          <div className="bg-white rounded-lg border border-[#D8E3F3] overflow-hidden">
            
            {/* Toolbar */}
            <SubCategoryManagementToolbar
              searchQuery={searchQuery}
              onSearchChange={setSearchQuery}
              statusFilter={statusFilter}
              onStatusFilterChange={setStatusFilter}
              onRefresh={loadSubCategories}
              onAddNew={() => setAddModalOpen(true)}
              totalSubCategories={subCategories.length}
              displayedSubCategories={subCategories.length}
              loading={loading}
            />

            {/* Table */}
            <SubCategoryTable 
              subCategories={subCategories}
              onEdit={(subCategory) => {
                setSelectedSubCategory(subCategory);
                setEditModalOpen(true);
              }}
              onDelete={(subCategory) => {
                setSelectedSubCategory(subCategory);
                setDeleteModalOpen(true);
              }}
              onToggle={handleToggleStatus}
              onDetail={(subCategory) => {
                setSelectedSubCategory(subCategory);
                setDetailModalOpen(true);
              }}
              loading={loading}
              formatDate={formatDate} 
            />

            {/* Modals */}
            <SubCategoryFormModal
              isOpen={addModalOpen}
              onClose={() => setAddModalOpen(false)}
              onSaved={() => {
                setAddModalOpen(false);
                loadSubCategories();
              }}
              isEdit={false}
            />

            <SubCategoryFormModal
              isOpen={editModalOpen}
              onClose={() => {
                setEditModalOpen(false);
                setSelectedSubCategory(null);
              }}
              subCategory={selectedSubCategory}
              onSaved={() => {
                setEditModalOpen(false);
                setSelectedSubCategory(null);
                loadSubCategories();
              }}
              isEdit={true}
            />

            <DeleteSubCategoryModal
              isOpen={deleteModalOpen}
              onClose={() => {
                setDeleteModalOpen(false);
                setSelectedSubCategory(null);
              }}
              subCategory={selectedSubCategory}
              onConfirm={handleDeleteSubCategory}
            />

            <SubCategoryDetailModal
              isOpen={detailModalOpen}
              onClose={() => {
                setDetailModalOpen(false);
                setSelectedSubCategory(null);
              }}
              subCategory={selectedSubCategory}
            />
          </div>
        </div>
      </div>
    </div>
  );
}