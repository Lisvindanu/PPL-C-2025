// frontend/src/components/organisms/SubCategoryTable.jsx

import React from 'react';
import Badge from '../atoms/Badge';
import { Search, Edit2, Trash2, Eye, ToggleLeft, ToggleRight } from 'lucide-react';

/**
 * Komponen Tabel untuk menampilkan daftar Sub Kategori (Dengan Horizontal Scroll).
 */
export function SubCategoryTable({ 
  subCategories, 
  onEdit, 
  onDelete, 
  onToggle,
  onDetail,
  loading,
  formatDate 
}) {
  if (loading) {
    return (
      <div className="p-12 text-center">
        <div className="w-16 h-16 border-4 border-[#4782BE] border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
        <p className="text-gray-600">Memuat data sub kategori...</p>
      </div>
    );
  }

  if (subCategories.length === 0) {
    return (
      <div className="p-12 text-center">
        <div className="text-gray-400 mb-2">
          <Search size={48} className="mx-auto" />
        </div>
        <p className="text-gray-600">Tidak ada sub kategori yang ditemukan</p>
      </div>
    );
  }

  return (
    // 🚨 PERBAIKAN: Mengaktifkan kembali horizontal scrolling
    <div className="overflow-x-auto"> 
      <table className="min-w-full table-auto divide-y divide-gray-200">
        <thead className="bg-gray-50 border-b border-[#D8E3F3]">
          <tr>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider w-10">
              Icon
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider min-w-[150px]">
              Nama Sub Kategori
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider min-w-[150px]">
              Kategori Induk
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider min-w-[100px]">
              Slug
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider min-w-[250px]">
              Deskripsi
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider min-w-[100px]">
              Status
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider min-w-[150px]">
              Dibuat
            </th>
            <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider w-36">
              Aksi
            </th>
          </tr>
        </thead>
        <tbody className="bg-white divide-y divide-gray-200">
          {subCategories.map((subCategory) => {
            const isActive = subCategory.is_active;
            
            return (
              <tr key={subCategory.id} className="hover:bg-gray-50 transition-colors">
                <td className="px-6 py-4">
                  <div className="w-10 h-10 bg-gradient-to-br from-[#FFD700] to-[#FFA500] rounded-lg flex items-center justify-center text-white font-bold text-lg">
                    {subCategory.nama?.charAt(0).toUpperCase()}
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm font-medium text-gray-900">
                    {subCategory.nama || 'N/A'}
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm font-medium text-gray-700">
                        {subCategory.kategori?.nama || subCategory.kategoriInduk || '-'}
                    </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm text-gray-600">
                    {subCategory.slug || '-'}
                  </div>
                </td>
                <td className="px-6 py-4">
                  <div className="text-sm text-gray-600 max-w-xs truncate">
                    {subCategory.deskripsi ? (
                      subCategory.deskripsi.length > 50 
                        ? subCategory.deskripsi.slice(0, 50) + '...' 
                        : subCategory.deskripsi
                    ) : '-'}
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <Badge variant={isActive ? 'success' : 'error'}>
                    {isActive ? 'Aktif' : 'Nonaktif'}
                  </Badge>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                  {formatDate(subCategory.created_at)}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-center">
                  <div className="flex items-center justify-center gap-2">
                    <button
                      onClick={() => onDetail(subCategory)}
                      className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                      title="Lihat Detail"
                    >
                      <Eye size={18} />
                    </button>
                    <button
                      onClick={() => onEdit(subCategory)}
                      className="p-2 text-green-600 hover:bg-green-50 rounded-lg transition-colors"
                      title="Edit"
                    >
                      <Edit2 size={18} />
                    </button>
                    <button
                      onClick={() => onToggle(subCategory)}
                      className={`p-2 ${isActive ? 'text-orange-600 hover:bg-orange-50' : 'text-indigo-600 hover:bg-indigo-50'} rounded-lg transition-colors`}
                      title={isActive ? 'Nonaktifkan' : 'Aktifkan'}
                    >
                      {isActive ? <ToggleRight size={18} /> : <ToggleLeft size={18} />}
                    </button>
                    <button
                      onClick={() => onDelete(subCategory)}
                      className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                      title="Hapus"
                    >
                      <Trash2 size={18} />
                    </button>
                  </div>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}