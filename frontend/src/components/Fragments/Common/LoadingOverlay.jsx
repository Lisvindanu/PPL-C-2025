import Spinner from '../../Elements/Common/Spinner'

export default function LoadingOverlay({ show, text = 'Loading...' }) {
  if (!show) return null
  return (
    <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
      <div className="bg-[#4782BE] text-white px-6 py-4 rounded-lg flex items-center gap-3 shadow-lg">
        <Spinner size={24} />
        <span className="font-medium">{text}</span>
      </div>
    </div>
  )
}


