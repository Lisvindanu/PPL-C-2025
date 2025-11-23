import { useState, useRef, useEffect } from 'react';
import { ChevronDown, Download, FileText, File } from 'lucide-react';
import AdminSearchBar from '../molecules/AdminSearchBar';

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

// ExportDropdown Component
function ExportDropdown({ onExport, className = "" }) {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef(null);

  useEffect(() => {
    function handleClickOutside(event) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    }

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isOpen]);

  const handleExport = (format) => {
    onExport(format);
    setIsOpen(false);
  };

  return (
    <div className={`relative ${className}`} ref={dropdownRef}>
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-2 bg-[#10B981] hover:bg-[#059669] text-white px-3 py-2 rounded-lg transition-colors text-sm whitespace-nowrap"
      >
        <Download size={16} />
        <span>Ekpor Laporan</span>
        <ChevronDown size={16} className={`transition-transform ${isOpen ? 'rotate-180' : ''}`} />
      </button>

      {isOpen && (
        <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg border border-gray-200 z-50">
          <div className="py-1">
            <button
              onClick={() => handleExport('pdf')}
              className="w-full flex items-center gap-3 px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 transition-colors"
            >
              <FileText size={18} className="text-red-500" />
              <span>Export PDF</span>
            </button>
            <button
              onClick={() => handleExport('csv')}
              className="w-full flex items-center gap-3 px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 transition-colors"
            >
              <File size={18} className="text-green-500" />
              <span>Export CSV</span>
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

export function ServiceManagementToolbar({ 
  searchQuery, 
  onSearchChange,
  statusFilter,
  onStatusFilterChange,
  kategoriFilter,
  onKategoriFilterChange,
  categories = [],
  onExport,
  totalServices,
  displayedServices,
  className = "" 
}) {
  const statusOptions = [
    { value: 'all', label: 'Semua Status' },
    { value: 'active', label: 'Aktif' },
    { value: 'blocked', label: 'Diblokir' }
  ];

  const kategoriOptions = categories.map(cat => ({
    value: cat.id,
    label: cat.nama
  }));

  return (
    <div className={`border-b border-[#D8E3F3] p-4 ${className}`}>
      <div className="flex flex-col md:flex-row gap-4 items-start md:items-center">
        {/* Search */}
        <div className="w-full md:flex-1">
          <AdminSearchBar
            placeholder="Cari layanan"
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
          />
        </div>

        {/* Filters */}
        <div className="flex flex-col md:flex-row gap-3 w-full md:w-auto">
          {/* Status Filter */}
          <FilterDropdown
            value={statusFilter}
            onChange={(e) => onStatusFilterChange(e.target.value)}
            options={statusOptions.slice(1)}
            placeholder="Semua Status"
            className="w-full md:w-auto"
          />

          {/* Kategori Filter */}
          <FilterDropdown
            value={kategoriFilter === 'all' ? '' : kategoriFilter}
            onChange={(e) => onKategoriFilterChange(e.target.value || 'all')}
            options={kategoriOptions}
            placeholder="Semua Kategori"
            className="w-full md:w-auto"
          />

          {/* Export Dropdown */}
          <ExportDropdown onExport={onExport} className="w-full md:w-auto" />

          {/* Service Count */}
          <div className="text-sm text-gray-600 md:whitespace-nowrap flex items-center">
            Menampilkan {displayedServices} dari {totalServices} Layanan
          </div>
        </div>
      </div>
    </div>
  );
}

