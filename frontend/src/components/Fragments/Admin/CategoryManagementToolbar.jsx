import React from 'react';
import Button from '../../Elements/Buttons/Button';
import { Plus, ChevronDown } from 'lucide-react';
import AdminSearchBar from './AdminSearchBar'; 

// FilterDropdown Component (Didefinisikan ulang di sini untuk konsistensi gaya)
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
        {/* Opsi placeholder memiliki value="" yang akan dipetakan ke 'all' */}
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

export function CategoryManagementToolbar({ 
  searchQuery, 
  onSearchChange, 
  statusFilter,
  onStatusFilterChange, // Pastikan fungsi ini yang dihandle di parent component
  onRefresh, 
  onAddNew,
  totalCategories,
  displayedCategories,
  loading,
  className = "" 
}) {
  const statusOptions = [
    { value: 'all', label: 'Semua Status' },
    { value: 'aktif', label: 'Aktif' },
    { value: 'nonaktif', label: 'Nonaktif' }
  ];

  // Hanya ambil 'Aktif' dan 'Nonaktif' untuk dropdown
  const filterOptions = statusOptions.slice(1);

  return (
    <div className={`border-b border-[#D8E3F3] p-4 ${className}`}>
      <div className="flex flex-col md:flex-row gap-4 items-start md:items-center">
        {/* Search */}
        <div className="w-full md:flex-1">
          <AdminSearchBar
            placeholder="Cari kategori..."
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
          />
        </div>

        {/* Filters and Action Buttons/Stats */}
        <div className="flex flex-col md:flex-row gap-3 w-full md:w-auto items-start md:items-center">
          {/* Status Filter */}
          <FilterDropdown
            // Kirim nilai kosong (value="") jika filter saat ini adalah 'all'
            value={statusFilter === 'all' ? '' : statusFilter}
            // Menerima nilai. Jika nilai kosong (placeholder terpilih), set ke 'all'
            onChange={(e) => onStatusFilterChange(e.target.value || 'all')}
            options={filterOptions}
            placeholder="Semua Status"
            className="w-full md:w-auto"
          />

          {/* Action Button: Tambah Kategori */}
          <div className="w-full md:w-auto">
            <Button
              variant="primary"
              onClick={onAddNew}
              className="flex items-center gap-1 px-4 py-2 text-sm bg-[#4782BE] hover:bg-[#3A6FA0] text-white w-full md:w-auto rounded-lg" 
            >
              <span className="hidden sm:inline">Tambah Kategori</span>
            </Button>
          </div>

          {/* Stats */}
          <div className="text-sm text-gray-600 md:whitespace-nowrap flex items-center">
            Menampilkan <span className="font-semibold text-gray-900">{displayedCategories}</span> dari <span className="font-semibold text-gray-900">{totalCategories}</span> kategori
          </div>
        </div>
      </div>
    </div>
  );
}