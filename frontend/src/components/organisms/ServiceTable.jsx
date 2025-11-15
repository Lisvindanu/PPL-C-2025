import Badge from '../atoms/Badge';
import { CheckCircle2, XCircle, Eye } from 'lucide-react';

export default function ServiceTable({ services = [], onBlock, onDetail }) {
  const getStatusBadge = (status) => {
    const isActive = status === 'aktif' || status === 'active';
    return (
      <Badge 
        variant={isActive ? 'success' : 'error'}
        className="px-3 py-1 text-sm font-medium"
      >
        {isActive ? 'Aktif' : 'Diblokir'}
      </Badge>
    );
  };

  const getCategoryBadge = (categoryName) => {
    return (
      <Badge className="!bg-[#9DBBDD] !text-white px-3 py-1 text-sm font-medium">
        {categoryName || 'N/A'}
      </Badge>
    );
  };

  if (services.length === 0) {
    return (
      <div className="p-12 text-center">
        <p className="text-gray-500 text-lg">Tidak ada layanan ditemukan</p>
      </div>
    );
  }

  return (
    <div className="overflow-x-auto">
      <table className="w-full">
        <thead className="bg-gray-50 border-b border-[#D8E3F3]">
          <tr>
            <th className="px-6 py-3 text-left text-xs font-bold text-black uppercase tracking-wider">
              Judul
            </th>
            <th className="px-6 py-3 text-left text-xs font-bold text-black uppercase tracking-wider">
              Freelancer
            </th>
            <th className="px-6 py-3 text-left text-xs font-bold text-black uppercase tracking-wider">
              Kategori
            </th>
            <th className="px-6 py-3 text-left text-xs font-bold text-black uppercase tracking-wider">
              Status
            </th>
            <th className="px-6 py-3 text-center text-xs font-bold text-black uppercase tracking-wider">
              Aksi
            </th>
          </tr>
        </thead>
        <tbody className="bg-white divide-y divide-[#D8E3F3]">
          {services.map((service) => {
            const isActive = service.status === 'aktif' || service.status === 'active';
            return (
              <tr key={service.id} className="hover:bg-gray-50 transition-colors">
                {/* Judul */}
                <td className="px-6 py-4">
                  <div className="text-sm font-medium text-gray-900">
                    {service.judul || 'N/A'}
                  </div>
                </td>

                {/* Freelancer */}
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm text-gray-900">
                    {service.freelancer?.full_name || service.freelancer?.email || service.freelancer_name || 'N/A'}
                  </div>
                </td>

                {/* Kategori */}
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="flex items-center">
                    {getCategoryBadge(service.kategori?.nama || service.kategori_name)}
                  </div>
                </td>

                {/* Status */}
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="flex items-center">
                    {getStatusBadge(service.status)}
                  </div>
                </td>

                {/* Actions */}
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="flex items-center justify-center gap-2">
                    {isActive ? (
                      <button
                        type="button"
                        onClick={() => onBlock(service, 'active')}
                        className="inline-flex items-center justify-center gap-2 bg-[#EF4444] hover:bg-red-600 text-white px-4 py-2 text-sm font-medium rounded-lg transition-colors"
                      >
                        <XCircle size={16} />
                        <span>Blokir</span>
                      </button>
                    ) : (
                      <button
                        type="button"
                        onClick={() => onBlock(service, 'blocked')}
                        className="inline-flex items-center justify-center gap-2 bg-[#10B981] hover:bg-green-700 text-white px-4 py-2 text-sm font-medium rounded-lg transition-colors"
                      >
                        <CheckCircle2 size={16} />
                        <span>Aktifkan</span>
                      </button>
                    )}
                    <button
                      type="button"
                      onClick={() => onDetail && onDetail(service)}
                      className="inline-flex items-center justify-center gap-2 bg-[#B3B3B3] hover:bg-gray-500 text-white px-4 py-2 text-sm font-medium rounded-lg transition-colors"
                    >
                      <Eye size={16} />
                      <span>Detail</span>
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

