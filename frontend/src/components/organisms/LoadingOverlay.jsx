import Spinner from '../atoms/Spinner'

export default function LoadingOverlay({ show, text = 'Loading...' }) {
  if (!show) return null
  return (
    <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
      <div className="bg-[#5C0C19] text-[#D8CCBC] px-6 py-4 rounded-lg flex items-center gap-3">
        <Spinner size={24} />
        <span>{text}</span>
      </div>
    </div>
  )
}


