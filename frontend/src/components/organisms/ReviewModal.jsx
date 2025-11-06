import React, { useState } from 'react';
import StarRating from '../molecules/StarRating';
import SuccessModal from './SuccessModal'; // BARIS BARU: Impor SuccessModal

export default function ReviewModal({ onClose }) {
  const [ratings, setRatings] = useState({
    quality: 0,
    communication: 0,
    timeliness: 0,
  });
  const [comment, setComment] = useState('');

  // BARIS BARU: State untuk mengontrol modal sukses
  const [showSuccess, setShowSuccess] = useState(false);

  const handleSetRating = (key, value) => {
    setRatings((prev) => ({ ...prev, [key]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (ratings.quality === 0 || ratings.communication === 0 || ratings.timeliness === 0) {
      alert('Harap isi semua kriteria rating bintang.');
      return;
    }
    
    console.log('Data Ulasan yang Dikirim:', { ratings, comment });
    
    // PERUBAHAN DI SINI:
    // Kita tidak langsung memanggil alert() atau onClose()
    // Kita set state 'showSuccess' menjadi true
    setShowSuccess(true);
  };

  // BARIS BARU: Fungsi untuk menutup kedua modal
  const handleCloseAll = () => {
    setShowSuccess(false); // Tutup modal sukses
    onClose();             // Tutup modal review (fungsi dari DashboardPage)
  };

  // BARIS BARU: Jika showSuccess true, tampilkan SuccessModal
  if (showSuccess) {
    return <SuccessModal onClose={handleCloseAll} />;
  }

  // Jika showSuccess false, tampilkan ReviewModal (seperti biasa)
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-60 p-4">
      <div className="bg-white rounded-xl shadow-2xl w-full max-w-md max-h-[90vh] overflow-y-auto">
        <div className="p-6 sm:p-8 space-y-6">

          {/* Header */}
          <div className="flex justify-between items-start">
            <div>
              <h2 className="text-2xl font-bold text-gray-900">Berikan Ulasan untuk Freelancer Anda</h2>
              <p className="text-sm text-gray-600 mt-1">Bantu freelancer ini membangun reputasinya.</p>
            </div>
            <span className="font-bold text-lg text-blue-600">Skill Connect</span>
          </div>

          {/* Info Freelancer (Molekul) */}
          <div className="flex items-center space-x-4 p-4 bg-gray-50 rounded-lg">
            <img
              className="w-16 h-16 rounded-full"
              src="https://via.placeholder.com/150"
              alt="David"
            />
            <div>
              <h3 className="text-xl font-bold text-gray-900">David</h3>
              <p className="text-sm text-gray-600">UI/UX Desainer | Figma Desainer | Web & Mobile App Desainer</p>
            </div>
          </div>

          <h4 className="text-lg font-semibold text-gray-800">Perancangan ulang situs web perusahaan</h4>

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-5">
            
            {/* Baris Rating (Molekul) */}
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
              <span className="text-gray-700 font-medium mb-2 sm:mb-0">Kualitas pekerjaan</span>
              <StarRating
                rating={ratings.quality}
                setRating={(value) => handleSetRating('quality', value)}
              />
            </div>
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
              <span className="text-gray-700 font-medium mb-2 sm:mb-0">Komunikasi</span>
              <StarRating
                rating={ratings.communication}
                setRating={(value) => handleSetRating('communication', value)}
              />
            </div>
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
              <span className="text-gray-700 font-medium mb-2 sm:mb-0">Ketaatan terhadap batas waktu</span>
              <StarRating
                rating={ratings.timeliness}
                setRating={(value) => handleSetRating('timeliness', value)}
              />
            </div>

            {/* Text Area (Atom) */}
            <div>
              <textarea
                value={comment}
                onChange={(e) => setComment(e.target.value)}
                placeholder="Jelaskan pengalaman Anda bekerja dengan freelancer ini."
                className="w-full h-32 p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors"
                rows="4"
              ></textarea>
            </div>

            {/* Button (Atom) */}
            <button
              type="submit"
              className="w-full bg-blue-600 text-white font-bold py-3 px-4 rounded-lg shadow-md
                         hover:bg-blue-700 hover:shadow-lg focus:outline-none focus:ring-4 
                         focus:ring-blue-300 transition-all duration-300 ease-in-out"
            >
              Kirim Ulasan
            </button>
            
            <button
              type="button"
              onClick={onClose} // Ini masih menutup ReviewModal (Nanti Saja)
              className="w-full text-center text-gray-600 hover:text-gray-900 transition-colors"
            >
              Nanti Saja
            </button>

          </form>
        </div>
      </div>
    </div>
  );
}