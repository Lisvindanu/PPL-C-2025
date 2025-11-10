import React, { useState, useMemo } from 'react';
import { Sidebar } from '../components/organisms/Sidebar';
import { Header } from '../components/organisms/Header';
import { ReportListSection } from '../components/organisms/ReportListSection';
import ReportDetailSection  from '../components/organisms/ReportDetailSection';

// --- DATA DUMMY (Akan diganti dengan React Query useQuery) ---
const initialReports = [
  { id: 1, freelancerName: 'Kamala .P', reason: 'Penilaian bersifat spam', date: '21 Okt 2025', reviewContent: 'Client banyak bicara dan terlalu banyak nanya untuk hal detail', status: 'pending' },
  { id: 2, freelancerName: 'Buddy', reason: 'Penilaian menyebarkan informasi pribadi', date: '21 Okt 2025', reviewContent: 'Dia menulis alamat rumah saya di komentar publik.', status: 'pending' },
  { id: 3, freelancerName: 'Chris', reason: 'Penilaian menyesatkan atau berisi informasi palsu', date: '21 Okt 2025', reviewContent: 'Semua klaim dia tentang kecepatan kerjanya bohong besar.', status: 'pending' },
  { id: 4, freelancerName: 'Matter', reason: 'Penilaian mengandung unsur pornografi', date: '21 Okt 2025', reviewContent: 'Konten sensitif...', status: 'pending' },
  { id: 5, freelancerName: 'Jeff', reason: 'Penilaian bersifat spam', date: '21 Okt 2025', reviewContent: 'Hanya emoji berulang.', status: 'pending' },
  { id: 6, freelancerName: 'Prakash', reason: 'Penilaian menyesatkan atau berisi informasi palsu', date: '21 Okt 2025', reviewContent: 'Informasi palsu tentang kualifikasi.', status: 'pending' },
];
// ----------------------------------------------------------------

const AdminReviewPage = () => {
  // State untuk data fetching/filtering
  // const { data: reports, isLoading } = useGetReportsQuery(); // Ganti dengan React Query Hook
  const reports = initialReports;
  const [selectedReportId, setSelectedReportId] = useState(reports[0]?.id || null);

  const selectedReport = useMemo(() => {
    return reports.find(r => r.id === selectedReportId);
  }, [selectedReportId, reports]);

  const handleSelectReport = (id) => {
    setSelectedReportId(id);
  };

  // --- HANDLER AKSI (Akan diganti dengan React Query useMutation) ---
  const handleRejectReport = (id) => {
    console.log(`[ACTION] Tolak Laporan ID: ${id}`);
    alert(`Laporan ID ${id} ditolak. (Logik API Mutation di sini)`);
    // Ganti dengan useMutation.mutate()
  };

  const handleDeleteReport = (id) => {
    console.log(`[ACTION] Hapus Review (dan Hapus Laporan) ID: ${id}`);
    alert(`Review dan Laporan ID ${id} dihapus. (Logik API Mutation di sini)`);
    // Ganti dengan useMutation.mutate()
  };

  return (
    <div className="flex h-screen bg-[#DBE2EF]">
      {/* 1. SIDEBAR ORGANISM */}
      <Sidebar currentPath="/admin/review" /> 

      <div className="flex flex-col flex-1 overflow-hidden">
        {/* 2. HEADER ORGANISM */}
        <Header title="Tinjauan Laporan" subtitle="Detail laporan yang harus ditinjau" />

        <main className="flex-1 p-8 overflow-y-auto">
          <div className="grid grid-cols-12 gap-8 h-full">
            
            {/* KIRI: Daftar Laporan (ReportListSection) */}
            <section className="col-span-7 h-full">
              <ReportListSection 
                reports={reports} 
                onSelectReport={handleSelectReport} 
                selectedReportId={selectedReportId}
              />
            </section>

            {/* KANAN: Detail Laporan (ReportDetailSection) */}
            <section className="col-span-5 h-full">
              <ReportDetailSection 
                report={selectedReport} 
                onReject={handleRejectReport}
                onDelete={handleDeleteReport}
              />
            </section>
          </div>
        </main>
      </div>
    </div>
  );
};

export default AdminReviewPage;