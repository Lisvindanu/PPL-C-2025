import Badge from '../../Elements/Common/Badge';

export default function BlockReasonCard({ blockLog, className = "" }) {
  if (!blockLog) return null;

  const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    try {
      const date = new Date(dateString);
      return new Intl.DateTimeFormat('id-ID', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit',
        timeZoneName: 'short'
      }).format(date);
    } catch {
      return dateString;
    }
  };

  return (
    <div className={`border-t border-gray-200 pt-4 mt-4 ${className}`}>
      <h4 className="text-lg font-bold text-black mb-4">Alasan Pemblokiran</h4>
      <div className="space-y-3">
        <div>
          <label className="text-sm font-medium text-gray-700 block mb-2">
            Keterangan
          </label>
          <div className="bg-red-50 p-3 rounded-lg border border-red-200">
            <p className="text-gray-900 text-sm">
              {blockLog.reason || 'Tidak ada keterangan pemblokiran tersedia'}
            </p>
          </div>
        </div>
        
        {blockLog.blockedAt && (
          <div>
            <label className="text-sm font-medium text-gray-700 block mb-2">
              Tanggal Pemblokiran
            </label>
            <p className="text-gray-900 text-sm">{formatDate(blockLog.blockedAt)}</p>
          </div>
        )}

        {blockLog.adminName && (
          <div>
            <label className="text-sm font-medium text-gray-700 block mb-2">
              Diblokir Oleh
            </label>
            <div className="flex items-center gap-2">
              <Badge className="bg-gray-200 text-gray-800">
                {blockLog.adminName}
              </Badge>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

