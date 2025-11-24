import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { serviceService } from "../services/serviceService";

// formatter sederhana
const toIDR = (n) => {
  const num = Number(n ?? 0);
  return `Rp. ${num.toLocaleString("id-ID")}`;
};

const fmtDateID = (iso) => {
  if (!iso) return "";
  try {
    const d = new Date(iso);
    return d.toLocaleDateString("id-ID", {
      day: "2-digit",
      month: "long",
      year: "numeric",
    });
  } catch {
    return iso;
  }
};

function normalizeSvc(s) {
  const nama_kategori =
    s?.nama_kategori || s?.kategori?.nama || s?.category?.name || "";

  const rawStatus = String(s?.status || "").toLowerCase();
  const status =
    rawStatus === "aktif"
      ? "Aktif"
      : rawStatus === "nonaktif"
      ? "Nonaktif"
      : "Draft";

  return {
    id: s?.id,
    judul: s?.judul || "",
    deskripsi: s?.deskripsi || "",
    thumbnail: s?.thumbnail || "",
    nama_kategori,
    created_at_raw: s?.created_at || s?.createdAt || null,
    created_at: fmtDateID(s?.created_at || s?.createdAt),
    harga_raw: s?.harga ?? 0,
    harga: toIDR(s?.harga),
    status,
  };
}

export function useMyServices({ page = 1, limit = 6 } = {}) {
  return useQuery({
    queryKey: ["my-services", page, limit],
    queryFn: async () => {
      const res = await serviceService.getMyServices({ page, limit });

      if (import.meta.env.DEV) {
        console.log("[useMyServices] raw result:", res);
      }

      const maybe =
        res?.services ??
        res?.data?.services ??
        res?.data?.items ??
        res?.items ??
        res?.data ??
        [];
      const list = Array.isArray(maybe) ? maybe : [];

      const services = list.map(normalizeSvc);
      const pagination = res?.pagination ||
        res?.data?.pagination || {
          page,
          limit,
          totalPages: 1,
          totalItems: services.length,
        };

      return { services, pagination };
    },

    // ✅ Keep old data while fetching page lain (UX halus)
    keepPreviousData: true,

    // ✅ PENTING: tiap kali komponen yang pakai hook ini di-mount,
    // selalu refetch dari server, meskipun cache dianggap masih "fresh"
    refetchOnMount: "always",

    // Biar nggak refetch tiap pindah tab/focus kalau kamu nggak mau
    refetchOnWindowFocus: false,
    refetchOnReconnect: "always",

    // Kalau global staleTime tim kamu besar, ini override khusus query ini
    staleTime: 0,
  });
}

export function useDeleteService() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (serviceId) => {
      const res = await serviceService.deleteMyService(serviceId);
      if (!res?.success) {
        throw new Error(res?.message || "Gagal menghapus layanan");
      }
      return true;
    },
    onSuccess: () => {
      // ⬅️ tetap invalidate untuk jaga-jaga
      qc.invalidateQueries({ queryKey: ["my-services"] });
    },
  });
}
