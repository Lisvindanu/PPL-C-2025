// frontend/src/components/organisms/CategoryTable.jsx

import React from 'react';
import Badge from '../atoms/Badge';
import { Search, Edit2, Trash2, Eye, ToggleLeft, ToggleRight } from 'lucide-react';

/**
 * Komponen Tabel untuk menampilkan daftar Kategori (Dengan Horizontal Scroll).
 */
export function CategoryTable({ 
  categories, 
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
        <p className="text-gray-600">Memuat data kategori...</p>
      </div>
    );
  }

  if (categories.length === 0) {
    return (
      <div className="p-12 text-center">
        <div className="text-gray-400 mb-2">
          <Search size={48} className="mx-auto" />
        </div>
        <p className="text-gray-600">Tidak ada kategori yang ditemukan</p>
      </div>
    );
  }

  return (
    // 🚨 PERBAIKAN: Mengaktifkan kembali horizontal scrolling
    <div className="overflow-x-auto"> 
      {/* Menggunakan min-w-full agar tabel memanjang jika kontennya lebar */}
      <table className="min-w-full divide-y divide-gray-200">
        <thead className="bg-gray-50 border-b border-[#D8E3F3]">
          <tr>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider w-10">
              Icon
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider min-w-[150px]">
              Nama Kategori
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider min-w-[100px]">
              Slug
            </th>
            {/* Kolom Deskripsi dengan min-w yang lebih besar */}
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
          {categories.map((category) => {
            const isActive = category.is_active;
            
            return (
              <tr key={category.id} className="hover:bg-gray-50 transition-colors">
                <td className="px-6 py-4">
                  <div className="w-10 h-10">
                    {category.icon ? (
                      <img 
                        src={category.icon} 
                        alt={category.nama} 
                        className="w-10 h-10 object-cover rounded-lg border border-gray-200"
                      />
                    ) : (
                      <div className="w-10 h-10 bg-gradient-to-br from-[#4782BE] to-[#9DBBDD] rounded-lg flex items-center justify-center text-white font-bold text-lg">
                        {category.nama?.charAt(0).toUpperCase()}
                      </div>
                    )}
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm font-medium text-gray-900">
                    {category.nama || 'N/A'}
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm text-gray-600">
                    {category.slug || '-'}
                  </div>
                </td>
                <td className="px-6 py-4">
                  {/* Memastikan konten tetap truncate di dalam sel */}
                  <div className="text-sm text-gray-600 max-w-xs truncate">
                    {category.deskripsi ? (
                      category.deskripsi.length > 100 
                        ? category.deskripsi.slice(0, 100) + '...' 
                        : category.deskripsi
                    ) : '-'}
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <Badge variant={isActive ? 'success' : 'error'}>
                    {isActive ? 'Aktif' : 'Nonaktif'}
                  </Badge>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                  {formatDate(category.created_at)}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-center">
                  <div className="flex items-center justify-center gap-2">
                    <button
                      onClick={() => onDetail(category)}
                      className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                      title="Lihat Detail"
                    >
                      <Eye size={18} />
                    </button>
                    <button
                      onClick={() => onEdit(category)}
                      className="p-2 text-green-600 hover:bg-green-50 rounded-lg transition-colors"
                      title="Edit"
                    >
                      <Edit2 size={18} />
                    </button>
                    <button
                      onClick={() => onToggle(category)}
                      className={`p-2 ${isActive ? 'text-orange-600 hover:bg-orange-50' : 'text-indigo-600 hover:bg-indigo-50'} rounded-lg transition-colors`}
                      title={isActive ? 'Nonaktifkan' : 'Aktifkan'}
                    >
                      {isActive ? <ToggleRight size={18} /> : <ToggleLeft size={18} />}
                    </button>
                    <button
                      onClick={() => onDelete(category)}
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