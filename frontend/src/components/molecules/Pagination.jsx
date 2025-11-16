import React from 'react';

export default function Pagination() {
  return (
    // Menggunakan style yang Anda minta:
    <div className="flex items-center justify-center gap-2 text-sm font-medium">
      <button className="px-3 py-1 text-gray-600 hover:text-gray-900 transition-colors">
        {/* Saya tambahkan panah agar lebih jelas */}
        &larr; <span className="ml-1">Sebelumnya</span>
      </button>
      
      {/* Tombol Aktif */}
      <button className="px-3 py-1 bg-blue-600 text-white rounded-md">
        1
      </button>
      
      <button className="px-3 py-1 text-gray-600 hover:text-gray-900 transition-colors">
        2
      </button>
      <button className="px-3 py-1 text-gray-600 hover:text-gray-900 transition-colors">
        3
      </button>
      <span className="px-2 text-gray-400">...</span>
      <button className="px-3 py-1 text-gray-600 hover:text-gray-900 transition-colors">
        10
      </button>
      <button className="px-3 py-1 text-gray-600 hover:text-gray-900 transition-colors">
        <span className="mr-1">Selanjutnya</span> &rarr;
      </button>
    </div>
  );
}