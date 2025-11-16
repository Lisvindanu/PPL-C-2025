import Icon from '../atoms/Icon'

export default function PortfolioSection({ isEditing }) {
  return (
    <div className="mt-8 pt-6 border-t border-gray-200">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-3">
          <h4 className="text-lg font-semibold text-gray-900">Portofolio</h4>
          {isEditing && (
            <button className="p-1 text-blue-500 hover:text-blue-700">
              <Icon name="plus" />
            </button>
          )}
        </div>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
        {[1, 2, 3].map((item) => (
          <div key={item} className="relative group">
            <img 
              src={`https://images.unsplash.com/photo-${1500000000000 + item}?w=300&h=200&fit=crop`}
              alt={`Portfolio ${item}`}
              className="w-full h-48 object-cover rounded-lg"
            />
            <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-30 transition-all duration-200 rounded-lg flex items-center justify-center">
              <p className="text-white opacity-0 group-hover:opacity-100 transition-opacity duration-200 text-sm font-medium text-center px-2">
                Ilustrasi Buku Cerita untuk Anak-anak - Terbang ke Bulan
              </p>
           </div>
          </div>
        ))}
      </div>
      
      {/* Pagination DIHAPUS DARI SINI
        karena sudah dipindahkan ke ProfileLayout.jsx
      */}
    </div>
  )
}