import React from 'react';
import Button from '../../Elements/Buttons/Button';
import { Plus, Search, ChevronDown } from 'lucide-react';
import AdminSearchBar from './AdminSearchBar';

// FilterDropdown Component 
function FilterDropdown({ 
  value, 
  onChange, 
  options = [], 
  placeholder = "Pilih...",
  className = "" 
}) {
  return (
    <div className="relative">
      <select
        value={value}
        onChange={onChange}
        className={`
          appearance-none bg-white border border-[#DBE2EF] rounded-lg 
          px-4 py-3 pr-10 cursor-pointer 
          hover:border-[#4782BE] transition-colors
          focus:outline-none focus:ring-2 focus:ring-[#4782BE]/50
          ${className}
        `}
      >
        {placeholder && <option value="">{placeholder}</option>}
        {options.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
      <ChevronDown className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 pointer-events-none" size={20} />
    </div>
  );
}

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
  const statusOptions = [
    { value: 'all', label: 'Semua Status' },
    { value: 'aktif', label: 'Aktif' },
    { value: 'nonaktif', label: 'Nonaktif' }
  ];

  return (
    <div className="p-4 border-b border-[#D8E3F3]">
      <div className="flex flex-col md:flex-row gap-4 items-start md:items-center">
        {/* Search */}
        <div className="w-full md:flex-1">
          <AdminSearchBar
            placeholder="Cari sub kategori..."
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
          />
        </div>

        {/* Filters and Action Buttons/Stats */}
        <div className="flex flex-col md:flex-row gap-3 w-full md:w-auto items-start md:items-center">
          
          {/* Status Filter menggunakan FilterDropdown */}
          <FilterDropdown
            value={statusFilter === 'all' ? '' : statusFilter}
            onChange={(e) => onStatusFilterChange(e.target.value || 'all')}
            options={statusOptions.slice(1).map(opt => ({ value: opt.value, label: opt.label }))}
            placeholder="Semua Status"
            className="w-full md:w-auto" 
          />
        

          {/* Action Button */}
          <div className="w-full md:w-auto">
            <Button
              variant="primary"
              onClick={onAddNew}
              className="flex items-center px-4 py-2 text-sm bg-[#4782BE] hover:bg-[#3A6FA0] text-white w-full md:w-auto rounded-lg" 
            >
              Tambah Sub Kategori
            </Button>
          </div>
        
          {/* Stats*/}
          <div className="text-sm text-gray-600 md:whitespace-nowrap flex items-center">
            Menampilkan <span className="font-semibold text-gray-900">{displayedSubCategories}</span> dari <span className="font-semibold text-gray-900">{totalSubCategories}</span> sub kategori
          </div>
        </div>
      </div>
    </div>
  );
}