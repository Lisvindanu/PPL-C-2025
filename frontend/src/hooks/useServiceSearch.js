// src/hooks/useServiceSearch.js
import { useEffect, useState } from "react";

// Sesuaikan base URL sama environment-mu
// Misal di .env: VITE_API_BASE_URL="http://localhost:5001/api"
const API_BASE_URL =
  import.meta.env.VITE_API_BASE_URL ||
  import.meta.env.VITE_API_URL ||
  "http://localhost:5000/api";

/**
 * Hook untuk memanggil /api/services/search (public).
 *
 * Params yang didukung:
 * - q           : string (keyword, minimal 2 karakter)
 * - status      : draft | aktif | nonaktif (default: aktif)
 * - harga_min   : number (opsional)
 * - harga_max   : number (opsional)
 * - rating_min  : number (opsional)
 * - page        : number (dipakai ke backend, tapi di UI kita paginasi sendiri)
 * - limit       : number (berapa banyak item diambil dari backend)
 * - sortBy      : created_at | harga | rating_rata_rata | total_pesanan | updated_at
 * - sortOrder   : ASC | DESC
 */
export function useServiceSearch(params) {
  const [services, setServices] = useState([]);
  const [pagination, setPagination] = useState({
    total: 0,
    page: params.page ?? 1,
    limit: params.limit ?? 12,
    totalPages: 1,
  });
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  // Normalisasi params supaya stabil untuk dependency useEffect
  const queryKey = JSON.stringify({
    q: params.q?.toString().trim() || "",
    kategori_id: params.kategori_id || undefined,
    status: params.status || "aktif",
    harga_min:
      typeof params.harga_min === "number" ? params.harga_min : undefined,
    harga_max:
      typeof params.harga_max === "number" ? params.harga_max : undefined,
    rating_min:
      typeof params.rating_min === "number" ? params.rating_min : undefined,
    page: params.page ?? 1,
    limit: params.limit ?? 12,
    sortBy: params.sortBy || undefined,
    sortOrder: params.sortOrder || undefined,
  });

  useEffect(() => {
    const controller = new AbortController();
    const parsed = JSON.parse(queryKey);

    const fetchData = async () => {
      const q = parsed.q || "";

      // Kalau keyword kosong / terlalu pendek, jangan tembak API search
      if (!q || q.length < 2) {
        setServices([]);
        setPagination({
          total: 0,
          page: parsed.page || 1,
          limit: parsed.limit || 12,
          totalPages: 1,
        });
        setIsLoading(false);
        setError(null);
        return;
      }

      setIsLoading(true);
      setError(null);

      try {
        const searchParams = new URLSearchParams();

        Object.entries(parsed).forEach(([key, value]) => {
          if (
            value === undefined ||
            value === null ||
            value === "" ||
            Number.isNaN(value)
          )
            return;
          searchParams.set(key, String(value));
        });

        const url = `${API_BASE_URL}/services/search?${searchParams.toString()}`;

        const res = await fetch(url, {
          method: "GET",
          credentials: "include",
          signal: controller.signal,
          headers: {
            "Content-Type": "application/json",
          },
        });

        const json = await res.json().catch(() => null);

        if (!res.ok) {
          const msg =
            json?.message ||
            `Failed to fetch services (status ${res.status})`;
          throw new Error(msg);
        }

        const payload = json?.data || {};
        const list = payload.services || [];
        const pg = payload.pagination || {};

        if (!controller.signal.aborted) {
          setServices(Array.isArray(list) ? list : []);
          setPagination({
            total: pg.total ?? list.length,
            page: pg.page ?? parsed.page ?? 1,
            limit: pg.limit ?? parsed.limit ?? 12,
            totalPages:
              pg.totalPages ??
              (pg.total && pg.limit
                ? Math.ceil(pg.total / pg.limit)
                : 1),
          });
        }
      } catch (err) {
        if (controller.signal.aborted) return;
        setError(err);
        setServices([]);
        setPagination({
          total: 0,
          page: parsed.page || 1,
          limit: parsed.limit || 12,
          totalPages: 1,
        });
      } finally {
        if (!controller.signal.aborted) {
          setIsLoading(false);
        }
      }
    };

    fetchData();

    return () => {
      controller.abort();
    };
  }, [queryKey]);

  return {
    services,
    pagination,
    isLoading,
    isError: Boolean(error),
    error,
  };
}
