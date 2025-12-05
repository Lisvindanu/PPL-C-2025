import { useState } from "react";
import api from "../utils/axiosConfig";

function sanitizeInt(value) {
  const raw = String(value ?? "");
  const numeric = raw.replace(/\D/g, "");
  return numeric;
}

function sanitizeDecimal(value) {
  const raw = String(value ?? "");
  let cleaned = raw.replace(/[^0-9.]/g, "");

  const parts = cleaned.split(".");
  let intPart = parts[0] || "";
  let decPart = parts[1] || "";

  intPart = intPart.slice(0, 10);
  decPart = decPart.slice(0, 2);

  let result = intPart;
  if (cleaned.includes(".")) {
    result = decPart.length ? `${intPart}.${decPart}` : intPart; // kalau cuma "123." → kirim "123"
  }
  return result;
}

export default function useCreateService() {
  const [submitting, setSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState("");

  async function createService(form) {
    setSubmitError("");

    const fd = new FormData();
    fd.append("judul", form.judul);
    fd.append("deskripsi", form.deskripsi);

    const waktu = sanitizeInt(form.waktu_pengerjaan);
    const batas = sanitizeInt(form.batas_revisi);
    const harga = sanitizeDecimal(form.harga);

    fd.append("waktu_pengerjaan", waktu);
    fd.append("batas_revisi", batas);
    fd.append("kategori_id", form.kategori_id);
    fd.append("harga", harga);

    if (form.thumbnail) {
      fd.append("thumbnail", form.thumbnail);
    }

    if (Array.isArray(form.gambar)) {
      form.gambar.forEach((file) => {
        fd.append("gambar", file);
      });
    }

    try {
      setSubmitting(true);
      const res = await api.post("/services", fd, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      const ok = res?.data?.status === "success";
      if (!ok) {
        throw new Error(res?.data?.message || "Gagal menambahkan layanan");
      }

      return res.data;
    } catch (err) {
      console.error("Error create service:", err);
      const msg =
        err?.response?.data?.message ||
        err?.message ||
        "Terjadi kesalahan saat menyimpan layanan.";
      setSubmitError(msg);
      throw err;
    } finally {
      setSubmitting(false);
    }
  }

  return { createService, submitting, submitError };
}
