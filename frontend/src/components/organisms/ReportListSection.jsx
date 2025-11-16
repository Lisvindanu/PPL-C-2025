import React from 'react';
import Input from '../atoms/Input';
import ReportTable from '../molecules/ReportTable';

export function ReportListSection({ reports, onSelectReport, selectedReportId }){
  // Data dummy untuk filter periode
  const periods = ['7 Hari Terakhir', '30 Hari Terakhir', 'Semua Waktu'];
  
  // Data dummy untuk ReportTable (seharusnya dari React Query useQuery)
  const dummyReports = reports || [
    { id: 1, freelancerName: 'Kamala .P', reason: 'Penilaian bersifat spam', date: '21 Okt 2025', reviewContent: 'Client banyak bicara dan terlalu banyak nanya untuk hal detail' },
    { id: 2, freelancerName: 'Buddy', reason: 'Penilaian menyebarkan informasi pribadi', date: '21 Okt 2025', reviewContent: 'Dia menulis alamat rumah saya di komentar publik.' },
    { id: 3, freelancerName: 'Chris', reason: 'Penilaian menyesatkan atau berisi informasi palsu', date: '21 Okt 2025', reviewContent: 'Semua klaim dia tentang kecepatan kerjanya bohong besar.' },
    { id: 4, freelancerName: 'Matter', reason: 'Penilaian mengandung unsur pornografi', date: '21 Okt 2025', reviewContent: 'Saya tidak akan menulis isinya di sini.' },
    // ... data lainnya
  ];

  return (
    <div className="flex flex-col bg-white rounded-xl shadow-lg p-6 h-full">
      <div className="flex justify-between items-center mb-4 space-x-4">
        {/* Asumsi Anda memiliki Atom Input/SearchBar */}
        <div className="relative flex-grow">
          <Input 
            placeholder="Cari nama freelancer atau alasan pelaporan" 
            className="pl-10" 
          />
          {/* Asumsi Anda punya Icon */}
          {/* <SearchIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" /> */}
        </div>

        {/* Filter Periode */}
        <select className="px-4 py-2 border border-gray-300 rounded-lg text-sm appearance-none focus:ring-blue-500 focus:border-blue-500">
          {periods.map(p => <option key={p} value={p}>{p}</option>)}
        </select>
      </div>

      <div className="flex-grow overflow-y-auto">
        <ReportTable 
          reports={dummyReports} 
          onSelectReport={onSelectReport}
          selectedReportId={selectedReportId} 
        />
      </div>
    </div>
  );
};

export default ReportListSection;