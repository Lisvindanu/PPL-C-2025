export default function ProfileLoadingOverlay({ loading }) {
  if (!loading) return null

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white p-4 rounded-lg">
        <p className="text-gray-700">Loading...</p>
      </div>
    </div>
  )
}
