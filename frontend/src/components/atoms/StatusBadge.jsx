const StatusBadge = ({ status }) => {
  const variants = {
    menunggu_pembayaran: 'bg-yellow-100 text-yellow-800 border border-yellow-300',
    dibayar: 'bg-blue-100 text-blue-800 border border-blue-300',
    dikerjakan: 'bg-purple-100 text-purple-800 border border-purple-300',
    menunggu_review: 'bg-orange-100 text-orange-800 border border-orange-300',
    selesai: 'bg-green-100 text-green-800 border border-green-300',
    dibatalkan: 'bg-red-100 text-red-800 border border-red-300',
    dispute: 'bg-red-100 text-red-800 border border-red-300',
    revisi: 'bg-yellow-100 text-yellow-800 border border-yellow-300',
    refunded: 'bg-gray-100 text-gray-800 border border-gray-300'
  }

  const labels = {
    menunggu_pembayaran: 'Menunggu Pembayaran',
    dibayar: 'Dibayar',
    dikerjakan: 'Dikerjakan',
    menunggu_review: 'Menunggu Review',
    selesai: 'Selesai',
    dibatalkan: 'Dibatalkan',
    dispute: 'Dispute',
    revisi: 'Revisi',
    refunded: 'Refunded'
  }

  return (
    <span className={`px-3 py-1 rounded-full text-xs font-semibold inline-block ${variants[status] || 'bg-gray-100 text-gray-800'}`}>
      {labels[status] || status}
    </span>
  )
}

export default StatusBadge
