import React from 'react';
import Badge from '../atoms/Badge';

export default function CategoryTrendsTable({ data = [], loading = false }) {
  if (loading) {
    return (
      <div className="bg-white rounded-lg shadow-sm p-6">
        <h2 className="text-xl font-semibold mb-6 text-gray-900">Kategori Layanan yang Diorder</h2>
        <div className="flex items-center justify-center h-48">
          <div className="text-center">
            <div className="w-12 h-12 border-4 border-[#4782BE] border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
            <p className="text-gray-600 text-sm">Memuat data kategori...</p>
          </div>
        </div>
      </div>
    );
  }

  if (!data || data.length === 0) {
    return (
      <div className="bg-white rounded-lg shadow-sm p-6">
        <h2 className="text-xl font-semibold mb-6 text-gray-900">Kategori Layanan yang Diorder</h2>
        <div className="flex items-center justify-center h-48 text-gray-500">
          <div className="text-center">
            <p className="text-lg mb-2">Tidak ada data</p>
            <p className="text-sm">Tidak ada kategori yang diorder pada periode ini</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg shadow-sm p-6">
      <h2 className="text-xl font-semibold mb-6 text-gray-900">Kategori Layanan yang Diorder</h2>
      <div className="overflow-x-auto">
        <table className="min-w-[520px] w-full">
          <thead>
            <tr className="border-b border-gray-200">
              <th className="text-left py-3 px-4 font-semibold text-gray-700">No</th>
              <th className="text-left py-3 px-4 font-semibold text-gray-700">Kategori</th>
              <th className="text-right py-3 px-4 font-semibold text-gray-700">Jumlah Order</th>
            </tr>
          </thead>
          <tbody>
            {data.map((item, index) => (
              <tr key={item.kategori_id || index} className="border-b border-gray-100 hover:bg-gray-50 transition-colors">
                <td className="py-3 px-4 text-gray-600">{index + 1}</td>
                <td className="py-3 px-4">
                  <Badge className="!bg-[#9DBBDD] !text-white">
                    {item.kategori_nama || 'N/A'}
                  </Badge>
                </td>
                <td className="py-3 px-4 text-right font-medium text-gray-900">
                  {item.orders?.toLocaleString('id-ID') || 0}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

