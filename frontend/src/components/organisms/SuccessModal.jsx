import React from 'react';


export default function SuccessModal({ onClose }) {
  return (
    // Latar belakang modal
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 p-4">
      
      {/* Kontainer Modal */}
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-sm">
        <div className="p-8 text-center space-y-4">

          <h2 className="text-2xl font-bold text-gray-900">
            Ulasan telah berhasil dikirim
          </h2>
          
          <p className="text-gray-600">
            Terimakasih masukannya!
          </p>

          {/* Tombol Tutup */}
          <button
            onClick={onClose} // Menggunakan fungsi onClose yang dikirim dari parent
            className="w-full bg-gray-200 text-gray-800 font-semibold py-3 px-4 rounded-lg
                       hover:bg-gray-300 focus:outline-none focus:ring-4 
                       focus:ring-gray-300 transition-all duration-300"
          >
            Tutup
          </button>

        </div>
      </div>
    </div>
  );
}