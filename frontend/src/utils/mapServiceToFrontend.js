// Map backend service object to frontend shape expected by cards and detail pages
// Keeps naming consistent: price, category, freelancer, rating, reviews, orders, estimasi, revisi, thumbnail
export const mapServiceDetailToFrontend = (backendService) => {
  if (!backendService || typeof backendService !== 'object') return null;

  const formatWaktuPengerjaan = (days) => {
    if (!days) return '7-14 hari';
    if (typeof days === 'number') {
      if (days === 1) return '1 hari';
      if (days <= 7) return `${days} hari`;
      if (days <= 14) return `7-14 hari`;
      if (days <= 30) return `${Math.ceil(days / 7)} minggu`;
      return `${Math.ceil(days / 30)} bulan`;
    }
    return days;
  };

  const formatBatasRevisi = (revisi) => {
    if (!revisi) return '2x Revisi';
    if (typeof revisi === 'number') {
      return `${revisi}x Revisi`;
    }
    return revisi;
  };

  return {
    id: backendService.id,
    title: backendService.judul || backendService.title || '',
    slug: backendService.slug || '',
    description: backendService.deskripsi || backendService.description || '',
    price: backendService.harga ?? backendService.price ?? 0,
    category: backendService.kategori?.nama_kategori || backendService.category || 'Lainnya',
    freelancer: backendService.freelancer?.nama_lengkap || backendService.freelancer || 'Freelancer',
    rating: backendService.rating_rata_rata ?? backendService.rating ?? 0,
    reviews: backendService.jumlah_rating ?? backendService.jumlah_review ?? backendService.reviews ?? 0,
    orders: backendService.total_pesanan ?? backendService.orders ?? 0,
    estimasi: formatWaktuPengerjaan(backendService.waktu_pengerjaan),
    revisi: formatBatasRevisi(backendService.batas_revisi),
    thumbnail: backendService.thumbnail || '/asset/layanan/Layanan.png',
    gambar: backendService.gambar || [],
    // Keep original for reference
    waktu_pengerjaan: backendService.waktu_pengerjaan,
    batas_revisi: backendService.batas_revisi
  };
};