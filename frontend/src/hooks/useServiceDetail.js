import { useQuery } from "@tanstack/react-query";
import { serviceService } from "../services/serviceService";

// ========================
// Helper URL media (gambar / thumbnail dari backend)
// ========================
const buildMediaUrl = (raw) => {
  if (!raw) return "";

  const url = String(raw).trim();
  if (!url) return "";

  // Kalau sudah absolute URL, biarin
  if (/^https?:\/\//i.test(url)) return url;

  // Kalau ini asset lokal FE (misal: /asset/layanan/Layanan.png), jangan di-oprek
  if (url.startsWith("/asset/") || url.startsWith("/assets/")) {
    return url;
  }

  // Base URL backend
  const apiBase = import.meta.env.VITE_API_BASE_URL || "";
  // Buang suffix /api kalau ada
  const backendBase =
    apiBase.replace(/\/api\/?$/, "") || "http://localhost:5000";

  // Hapus leading slash & prefix public/ kalau sudah ada
  const cleanPath = url.replace(/^\/+/, "").replace(/^public\//, "");

  // Hasil akhirnya: http://localhost:5000/public/layanan/xxx.jpg
  return `${backendBase}/public/${cleanPath}`;
};

// ========================
// Helpers gambar
// ========================
const extractUrlFromItem = (item) => {
  if (!item) return null;

  // Sudah string → anggap path/url
  if (typeof item === "string") return item.trim();

  // Object → coba beberapa property umum
  if (typeof item === "object") {
    return (
      item.url ||
      item.path ||
      item.src ||
      item.image_url ||
      item.imageUrl ||
      item.image ||
      null
    );
  }

  return null;
};

const normalizeImages = (gambarRaw, thumbnail) => {
  let images = [];

  // Case 1: Sudah array
  if (Array.isArray(gambarRaw)) {
    images = gambarRaw.map(extractUrlFromItem).filter(Boolean);
  }
  // Case 2: String
  else if (typeof gambarRaw === "string") {
    const trimmed = gambarRaw.trim();
    if (trimmed) {
      try {
        const parsed = JSON.parse(trimmed);

        if (Array.isArray(parsed)) {
          images = parsed.map(extractUrlFromItem).filter(Boolean);
        } else if (parsed && typeof parsed === "object") {
          images = Object.values(parsed)
            .map(extractUrlFromItem)
            .filter(Boolean);
        } else {
          const parts = trimmed
            .split(",")
            .map((p) => p.trim())
            .filter(Boolean);
          images = parts.length > 0 ? parts : [trimmed];
        }
      } catch {
        const parts = trimmed
          .split(",")
          .map((p) => p.trim())
          .filter(Boolean);
        images = parts.length > 0 ? parts : [trimmed];
      }
    }
  }
  // Case 3: Object JSON (misal {0:"url",1:"url"} atau {a:{url:".."}})
  else if (gambarRaw && typeof gambarRaw === "object") {
    images = Object.values(gambarRaw).map(extractUrlFromItem).filter(Boolean);
  }

  // Fallback → pakai thumbnail kalau images kosong
  if ((!images || images.length === 0) && thumbnail) {
    images = [thumbnail];
  }

  // Pastikan hasil akhirnya array string yang sudah dipetakan ke URL backend
  const finalImages = (images || [])
    .map((url) => String(url || "").trim())
    .filter(Boolean)
    .map(buildMediaUrl);

  return finalImages;
};

// ========================
// Mapping backend -> UI
// ========================
const mapServiceToFrontend = (backendService) => {
  const formatWaktuPengerjaan = (days) => {
    if (!days) return "1–3 Minggu";
    if (typeof days === "number") {
      if (days === 1) return "1 hari";
      if (days <= 7) return `${days} hari`;
      if (days <= 14) return "1–2 Minggu";
      if (days <= 30) return `${Math.ceil(days / 7)} Minggu`;
      return `${Math.ceil(days / 30)} Bulan`;
    }
    return days;
  };

  const formatBatasRevisi = (revisi) => {
    if (!revisi && revisi !== 0) return "3x revisi besar";
    if (typeof revisi === "number") return `${revisi}x revisi besar`;
    return revisi;
  };

  const kategori = backendService.kategori || {};
  const freelancer = backendService.freelancer || {};

  const kategoriNama =
    kategori.nama ||
    backendService.kategori_nama ||
    backendService.nama_kategori ||
    backendService.category_name ||
    backendService.categoryName ||
    null;

  const kategoriSlug =
    kategori.slug ||
    backendService.kategori_slug ||
    backendService.slug_kategori ||
    backendService.category_slug ||
    backendService.categorySlug ||
    null;

  // Coba berbagai kemungkinan field nama di object freelancer
  const freelancerName =
    freelancer.nama_lengkap ||
    [freelancer.nama_depan, freelancer.nama_belakang]
      .filter(Boolean)
      .join(" ") ||
    freelancer.nama ||
    freelancer.name ||
    freelancer.full_name ||
    freelancer.fullName ||
    freelancer.username ||
    null;

  const freelancerAvatarRaw =
    freelancer.avatar ||
    freelancer.foto ||
    freelancer.photo ||
    freelancer.image ||
    null;

  const freelancerRole =
    freelancer.judul_profesi ||
    freelancer.profesi ||
    freelancer.job_title ||
    kategoriNama ||
    "Freelancer profesional";

  const freelancerAbout =
    freelancer.deskripsi_lengkap || freelancer.bio || freelancer.about || null;

  const freelancerProjectCompleted =
    freelancer.total_pekerjaan_selesai ||
    freelancer.total_project_selesai ||
    backendService.total_pesanan ||
    0;

  const thumbnailRaw = backendService.thumbnail || "/asset/layanan/Layanan.png";

  // 🎯 gambar utama: kolom `gambar` (JSON) → fallback ke thumbnail
  const gambar = normalizeImages(backendService.gambar, thumbnailRaw);

  if (import.meta.env.DEV) {
    console.log(
      "[useServiceDetail] RAW gambar dari API:",
      backendService.gambar
    );
    console.log("[useServiceDetail] RAW thumbnail dari API:", thumbnailRaw);
    console.log("[useServiceDetail] NORMALIZED gambar (final):", gambar);
    console.log("[useServiceDetail] RAW freelancer dari API:", freelancer);
  }

  return {
    id: backendService.id,
    title: backendService.judul || "",
    slug: backendService.slug || "",
    description: backendService.deskripsi || "",
    price: backendService.harga || 0,
    category: kategoriNama || "Lainnya",
    categorySlug: kategoriSlug || "",
    freelancer: {
      id: freelancer.id || backendService.freelancer_id || "",
      name: freelancerName || "Freelancer",
      avatar:
        (freelancerAvatarRaw && buildMediaUrl(freelancerAvatarRaw)) ||
        "https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=80&q=80",
      role: freelancerRole,
      about: freelancerAbout || "Freelancer profesional",
      projectCompleted: freelancerProjectCompleted,
    },
    rating: backendService.rating_rata_rata || 0,
    reviewCount: backendService.jumlah_rating || 0,
    completed: backendService.total_pesanan || 0,
    waktu_pengerjaan: formatWaktuPengerjaan(backendService.waktu_pengerjaan),
    batas_revisi: formatBatasRevisi(backendService.batas_revisi),
    thumbnail: buildMediaUrl(thumbnailRaw),
    gambar,
    features: backendService.features || [],
  };
};

// Versi slug
export function useServiceDetail(slug) {
  return useQuery({
    queryKey: ["service-detail", slug],
    enabled: !!slug && slug !== "undefined",
    queryFn: async () => {
      const res = await serviceService.getServiceBySlug(slug);

      // Expect structure: { success: boolean, service, message? }
      if (!res.success || !res.service) {
        const err = new Error(res.message || "Failed to get service detail");
        if (res.message === "Service not found") {
          err.statusCode = 404;
        }
        throw err;
      }

      return mapServiceToFrontend(res.service);
    },
  });
}
