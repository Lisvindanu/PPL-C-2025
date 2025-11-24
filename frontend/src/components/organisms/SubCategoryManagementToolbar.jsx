// frontend/src/components/organisms/SubCategoryManagementToolbar.jsx

import React from 'react';
import Button from '../atoms/Button';
import { Plus, Search } from 'lucide-react';

/**
 * Komponen Toolbar untuk fitur manajemen Sub Kategori (pencarian, filter, dan tambah).
 */
export function SubCategoryManagementToolbar({ 
  searchQuery, 
  onSearchChange, 
  statusFilter,
  onStatusFilterChange,
  onRefresh,
  onAddNew,
  totalSubCategories,
  displayedSubCategories,
  loading
}) {
  return (
    <div className="p-6 border-b border-[#D8E3F3]">
      <div className="flex flex-wrap items-center justify-between gap-4 mb-4">
        {/* Search and Filters */}
        <div className="flex flex-col sm:flex-row gap-3 flex-grow md:flex-grow-0 md:w-auto">
          <div className="relative w-full sm:max-w-xs"> 
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
            <input
              type="text"
              placeholder="Cari sub kategori..."
              value={searchQuery}
              onChange={(e) => onSearchChange(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#4782BE] focus:border-transparent"
            />
          </div>
          
          <select
            value={statusFilter}
            onChange={(e) => onStatusFilterChange(e.target.value)}
            className="w-full sm:w-auto px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#4782BE] focus:border-transparent bg-white"
          >
            <option value="all">Semua Status</option>
            <option value="aktif">Aktif</option>
            <option value="nonaktif">Nonaktif</option>
          </select>
        </div>

        {/* Action Button (Tambah Sub Kategori) */}
        <div className="flex items-center">
          <Button
            variant="primary"
            onClick={onAddNew}
            className="flex items-center gap-1 px-3 py-1.5 text-sm bg-[#4782BE] hover:bg-[#3A6FA0] text-white" 
          >
            <Plus size={16} />
            <span className="hidden sm:inline">Tambah Sub Kategori</span>
          </Button>
        </div>
      </div>

      {/* Stats */}
      <div className="text-sm text-gray-600">
        Menampilkan <span className="font-semibold text-gray-900">{displayedSubCategories}</span> dari{' '}
        <span className="font-semibold text-gray-900">{totalSubCategories}</span> sub kategori
      </div>
    </div>
  );
}