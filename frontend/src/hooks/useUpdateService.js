import { useState } from "react";

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

export default function useUpdateService() {
  const [updating, setUpdating] = useState(false);
  const [error, setError] = useState("");

  async function updateService(id, form) {
    setUpdating(true);
    setError("");

    try {
      const token = getToken();
      if (!token) {
        throw new Error("Unauthorized: token tidak ditemukan");
      }

      const fd = new FormData();

      if (form.judul) fd.append("judul", form.judul);
      if (form.deskripsi) fd.append("deskripsi", form.deskripsi);
      if (form.kategori_id) fd.append("kategori_id", form.kategori_id);
      if (form.harga) fd.append("harga", form.harga);
      if (form.waktu_pengerjaan) {
        fd.append("waktu_pengerjaan", form.waktu_pengerjaan);
      }
      if (
        form.batas_revisi !== undefined &&
        form.batas_revisi !== null &&
        form.batas_revisi !== ""
      ) {
        fd.append("batas_revisi", form.batas_revisi);
      }

      // Thumbnail:
      // - Jika user upload baru → kirim file
      // - Jika user menghapus thumbnail (values.thumbnail === "" dan tidak ada file) → kirim string kosong
      if (form.thumbnailFile) {
        fd.append("thumbnail", form.thumbnailFile);
      } else if (form.thumbnail === "") {
        fd.append("thumbnail", "");
      }

      // Galeri:
      // Existing path yang masih dipertahankan
      const existingGallery = Array.isArray(form.gambar) ? form.gambar : [];
      existingGallery.forEach((path) => {
        if (path) {
          fd.append("gambar", path);
        }
      });

      // File baru
      const newFiles = Array.isArray(form.gambarFiles) ? form.gambarFiles : [];
      newFiles.forEach((file) => {
        fd.append("gambar", file);
      });

      const res = await fetch(`${API_BASE_URL}/services/${id}`, {
        method: "PUT",
        headers: {
          Authorization: `Bearer ${token}`,
        },
        body: fd,
      });

      const json = await res.json().catch(() => ({}));

      if (!res.ok || json.status === "error") {
        throw new Error(json.message || "Gagal mengupdate layanan");
      }

      return json.data;
    } catch (err) {
      setError(err.message || "Terjadi kesalahan saat mengupdate layanan");
      throw err;
    } finally {
      setUpdating(false);
    }
  }

  return { updateService, updating, error };
}
