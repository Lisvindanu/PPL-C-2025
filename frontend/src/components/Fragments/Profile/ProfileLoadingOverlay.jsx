export default function ProfileLoadingOverlay({ loading }) {
  if (!loading) return null

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-[#FFFFFF] border-2 border-[#4782BE] p-6 rounded-lg shadow-lg">
        <div className="flex items-center gap-3">
          <div className="w-6 h-6 border-4 border-[#4782BE] border-t-transparent rounded-full animate-spin"></div>
          <p className="text-[#1D375B] font-medium">Loading...</p>
        </div>
      </div>
    </div>
  )
}
