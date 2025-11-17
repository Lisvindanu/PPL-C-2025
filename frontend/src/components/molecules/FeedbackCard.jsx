// src/components/molecules/FeedbackCard.jsx
import React from 'react';
import StarIcon from '../atoms/StarIcon'; // Impor Atom yang baru kita buat

// BARIS BARU: Tambahkan 'onReportClick' di props
export default function FeedbackCard({ name, company, date, rating, reviewText, onReportClick }) {
  return (
    // Kartu dengan shadow dan border
    <div className="bg-white rounded-xl shadow-lg p-6 border border-gray-200">
      
      {/* Header Kartu */}
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-center space-x-3">
          {/* Placeholder Avatar */}
          <div className="w-12 h-12 rounded-full bg-blue-500 flex-shrink-0">
          </div>
          <div>
            <h4 className="font-bold text-lg text-gray-900">{name}</h4>
            <p className="text-sm text-gray-500">{company}</p>
          </div>
        </div>
        <p className="text-sm text-gray-500 flex-shrink-0 ml-2">{date}</p>
      </div>

      {/* Isi Review */}
      <p className="text-gray-700 mb-5">
        "{reviewText}"
      </p>

      {/* Footer Kartu */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-1">
          {/* Loop untuk 5 bintang */}
          {[...Array(5)].map((_, i) => (
            <StarIcon key={i} filled={i < Math.floor(rating)} />
          ))}
          <span className="font-bold ml-2 text-gray-800">{rating.toFixed(1)}</span>
        </div>

        {/* PERUBAHAN DI SINI: Tombol 'Laporkan' sekarang memicu 'onReportClick' */}
        <button 
          onClick={onReportClick} 
          className="text-sm text-gray-500 hover:text-gray-700 bg-gray-100 hover:bg-gray-200 px-3 py-1 rounded-md transition-colors"
        >
          Laporkan
        </button>
      </div>
    </div>
  );
}