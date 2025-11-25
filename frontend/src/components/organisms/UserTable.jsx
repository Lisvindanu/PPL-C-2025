import Badge from '../atoms/Badge';
import Button from '../atoms/Button';
import { CheckCircle2, XCircle, Eye } from 'lucide-react';

export default function UserTable({ users = [], onBlock, onDetail }) {
  const getStatusBadge = (status) => {
    const isActive = status === 'active' || status === 1 || status === true;
    return (
      <Badge 
        variant={isActive ? 'success' : 'error'}
        className="px-3 py-1 text-sm font-medium"
      >
        {isActive ? 'Aktif' : 'Diblokir'}
      </Badge>
    );
  };

  const getRoleBadge = (role) => {
    const roleMap = {
      client: 'Klien',
      freelancer: 'Freelancer',
      admin: 'Admin'
    };
    return (
      <Badge className="!bg-[#9DBBDD] !text-white px-3 py-1 text-sm font-medium">
        {roleMap[role] || role}
      </Badge>
    );
  };

  const getInitials = (user) => {
    const first = user.nama_depan?.charAt(0) || '';
    const last = user.nama_belakang?.charAt(0) || '';
    return (first + last).toUpperCase() || user.email?.charAt(0).toUpperCase() || 'U';
  };

  if (users.length === 0) {
    return (
      <div className="p-12 text-center">
        <p className="text-gray-500 text-lg">Tidak ada pengguna ditemukan</p>
      </div>
    );
  }

  return (
    <div className="overflow-x-auto">
      <table className="w-full min-w-[700px] md:min-w-full">
        <thead className="bg-gray-50 border-b border-[#D8E3F3]">
          <tr>
            <th className="px-6 py-3 text-left text-xs font-bold text-black uppercase tracking-wider">
              Pengguna
            </th>
            <th className="px-6 py-3 text-left text-xs font-bold text-black uppercase tracking-wider">
              Email
            </th>
            <th className="px-6 py-3 text-left text-xs font-bold text-black uppercase tracking-wider">
              Role
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
          {users.map((user) => {
            const isActive = user.is_active === true || user.is_active === 1 || user.status === 'active';
            return (
              <tr key={user.id} className="hover:bg-gray-50 transition-colors">
                {/* User */}
                <td className="px-4 py-3 md:whitespace-nowrap whitespace-normal">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-green-500 flex items-center justify-center text-white font-semibold">
                      {getInitials(user)}
                    </div>
                    <div>
                      <div className="text-sm font-medium text-gray-900">
                        {user.nama_depan && user.nama_belakang 
                          ? `${user.nama_depan} ${user.nama_belakang}` 
                          : user.nama_depan || user.nama_belakang || 'N/A'}
                      </div>
                    </div>
                  </div>
                </td>

                {/* Email */}
                <td className="px-4 py-3 md:whitespace-nowrap whitespace-normal">
                  <div className="text-sm text-blue-600 underline">
                    {user.email}
                  </div>
                </td>

                {/* Role */}
                <td className="px-4 py-3 md:whitespace-nowrap whitespace-normal">
                  <div className="flex items-center">
                    {getRoleBadge(user.role)}
                  </div>
                </td>

                {/* Status */}
                <td className="px-4 py-3 md:whitespace-nowrap whitespace-normal">
                  <div className="flex items-center">
                    {getStatusBadge(user.is_active)}
                  </div>
                </td>

                {/* Actions */}
                <td className="px-4 py-3 md:whitespace-nowrap whitespace-normal">
                  <div className="flex items-center justify-center gap-2">
                    {/* Mobile: icon-only circular buttons (visible on default/mobile). */}
                    {isActive ? (
                      <>
                        <button
                          type="button"
                          onClick={() => onBlock(user, 'active')}
                          aria-label="Blokir"
                          className="inline-flex sm:hidden items-center justify-center w-10 h-10 rounded-full bg-[#EF4444] hover:bg-red-600 text-white transition-colors"
                        >
                          <XCircle size={16} />
                        </button>

                        {/* Desktop/Tablet: full button with label */}
                        <button
                          type="button"
                          onClick={() => onBlock(user, 'active')}
                          className="hidden sm:inline-flex items-center justify-center gap-2 bg-[#EF4444] hover:bg-red-600 text-white px-4 py-2 text-sm font-medium rounded-lg transition-colors"
                        >
                          <XCircle size={16} />
                          <span>Blokir</span>
                        </button>
                      </>
                    ) : (
                      <>
                        <button
                          type="button"
                          onClick={() => onBlock(user, 'blocked')}
                          aria-label="Aktifkan"
                          className="inline-flex sm:hidden items-center justify-center w-10 h-10 rounded-full bg-[#10B981] hover:bg-green-700 text-white transition-colors"
                        >
                          <CheckCircle2 size={16} />
                        </button>

                        <button
                          type="button"
                          onClick={() => onBlock(user, 'blocked')}
                          className="hidden sm:inline-flex items-center justify-center gap-2 bg-[#10B981] hover:bg-green-700 text-white px-4 py-2 text-sm font-medium rounded-lg transition-colors"
                        >
                          <CheckCircle2 size={16} />
                          <span>Aktifkan</span>
                        </button>
                      </>
                    )}

                    {/* Detail button (icon-only on mobile, labeled on sm+) */}
                    <>
                      <button
                        type="button"
                        onClick={() => onDetail && onDetail(user)}
                        aria-label="Detail"
                        className="inline-flex sm:hidden items-center justify-center w-10 h-10 rounded-full bg-[#B3B3B3] hover:bg-gray-500 text-white transition-colors"
                      >
                        <Eye size={16} />
                      </button>

                      <button
                        type="button"
                        onClick={() => onDetail && onDetail(user)}
                        className="hidden sm:inline-flex items-center justify-center gap-2 bg-[#B3B3B3] hover:bg-gray-500 text-white px-4 py-2 text-sm font-medium rounded-lg transition-colors"
                      >
                        <Eye size={16} />
                        <span>Detail</span>
                      </button>
                    </>
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

