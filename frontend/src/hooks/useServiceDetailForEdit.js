import { useEffect, useState } from "react";

const API_BASE_URL =
  import.meta.env.VITE_API_BASE_URL ||
  import.meta.env.VITE_API_URL ||
  "http://localhost:5000/api";

function getToken() {
  if (typeof window === "undefined") return null;
  return (
    localStorage.getItem("token") ||
    localStorage.getItem("accessToken") ||
    localStorage.getItem("authToken") ||
    null
  );
}

export default function useServiceDetailForEdit(serviceId) {
  const [service, setService] = useState(null);
  const [loading, setLoading] = useState(Boolean(serviceId));
  const [error, setError] = useState("");

  useEffect(() => {
    if (!serviceId) return;

    let cancelled = false;

    async function fetchDetail() {
      try {
        setLoading(true);
        setError("");

        const token = getToken();
        if (!token) {
          throw new Error("Unauthorized: token tidak ditemukan");
        }

        const url = `${API_BASE_URL}/services/my?page=1&limit=100`;
        const res = await fetch(url, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        const json = await res.json().catch(() => ({}));

        if (!res.ok || json.status !== "success") {
          throw new Error(json.message || "Gagal mengambil data layanan");
        }

        const services = json.data?.services || [];
        const found = services.find((item) => item.id === serviceId);

        if (!found) {
          throw new Error("Layanan tidak ditemukan pada akun Anda");
        }

        if (!cancelled) {
          setService(found);
        }
      } catch (err) {
        if (!cancelled) {
          setError(err.message || "Terjadi kesalahan saat memuat data");
        }
      } finally {
        if (!cancelled) {
          setLoading(false);
        }
      }
    }

    fetchDetail();

    return () => {
      cancelled = true;
    };
  }, [serviceId]);

  return { service, loading, error };
}
