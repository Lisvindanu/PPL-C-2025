import React, { useState } from 'react';
import ReportSuccessModal from './ReportSuccessModal';

const reportOptions = [
  'Penilaian mengandung kata-kata kasar atau penghinaan',
  'Penilaian mengandung unsur pornografi',
  'Penilaian bersifat spam',
  'Penilaian menyebarkan informasi pribadi',
  'Penilaian mengandung promosi atau iklan tanpa izin',
  'Penilaian tidak sesuai dengan pengalaman sebenarnya',
  'Penilaian mengandung ujaran kebencian atau diskriminasi',
  'Penilaian menyesatkan atau berisi informasi palsu',
  'Lainnya',
];

export default function ReportModal({ onClose, reviewId }) {
  const [selectedReason, setSelectedReason] = useState('');
  const [otherReasonText, setOtherReasonText] = useState('');
  const [showSuccess, setShowSuccess] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    
    if (!selectedReason) {
      alert('Harap pilih salah satu alasan.');
      return;
    }
    if (selectedReason === 'Lainnya' && !otherReasonText.trim()) {
      alert('Harap isi alasan lain di kotak masukan.');
      return;
    }

    const reportData = {
      reviewId: reviewId,
      reason: selectedReason,
      details: selectedReason === 'Lainnya' ? otherReasonText : null,
    };

    console.log('Laporan Dikirim:', reportData);
    
    setShowSuccess(true);
  };

  const handleCloseAll = () => {
    setShowSuccess(false);
    onClose();
  };

  if (showSuccess) {
    return <ReportSuccessModal onClose={handleCloseAll} />;
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-60 p-4">
      
      <div className="bg-white rounded-lg shadow-2xl w-full max-w-md max-h-[90vh] overflow-y-auto">
        <form onSubmit={handleSubmit} className="p-6 sm:p-8 space-y-6">

          <h2 className="text-2xl font-bold text-gray-900">Laporkan Review</h2>
          
          <div>
            <h3 className="text-lg font-semibold text-gray-800 mb-4">Pilih Alasan</h3>
            
            <div className="space-y-4">
              {reportOptions.map((reason, index) => (
                <div key={index} className="flex items-center">
                  <input
                    id={`reason-${index}`}
                    name="report-reason"
                    type="radio"
                    value={reason}
                    checked={selectedReason === reason}
                    onChange={(e) => setSelectedReason(e.target.value)}
                    className="h-4 w-4 text-blue-600 border-gray-300 focus:ring-blue-500"
                  />
                  <label
                    htmlFor={`reason-${index}`}
                    className="ml-3 block text-sm font-medium text-gray-700"
                  >
                    {reason}
                  </label>
                </div>
              ))}
            </div>
          </div>

          {selectedReason === 'Lainnya' && (
            <div>
              <textarea
                value={otherReasonText}
                onChange={(e) => setOtherReasonText(e.target.value)}
                placeholder="Masukan alasan lain diluar hal yang diatas"
                className="w-full h-28 p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors"
                rows="3"
              ></textarea>
            </div>
          )}

          <div className="space-y-3">
            <button
              type="submit"
              className="w-full bg-blue-600 text-white font-bold py-3 px-4 rounded-lg shadow-md
                         hover:bg-blue-700 hover:shadow-lg focus:outline-none focus:ring-4 
                         focus:ring-blue-300 transition-all duration-300 ease-in-out"
            >
              Kirim laporan
            </button>
            
            <button
              type="button"
              onClick={onClose}
              className="w-full text-center text-gray-600 hover:text-gray-900 transition-colors"
            >
              Batal
            </button>
          </div>

        </form>
      </div>
    </div>
  );
}