import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import Navbar from "../../components/organisms/Navbar";
import DashboardHeaderBar from "../../components/molecules/DashboardHeaderBar";
import MediaEditFormCard from "../../components/molecules/MediaEditFormCard";
import PricingEditFormCard from "../../components/molecules/PricingEditFormCard";
import Footer from "../../components/organisms/Footer";

import useCategories from "../../hooks/useCategories";
import useServiceDetailForEdit from "../../hooks/useServiceDetailForEdit";
import useUpdateService from "../../hooks/useUpdateService";

export default function ServiceEditPage() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [form, setForm] = useState({
    judul: "",
    deskripsi: "",
    kategori_id: "",
    harga: "",
    waktu_pengerjaan: "",
    batas_revisi: "",
    thumbnail: "", // path existing
    gambar: [], // array path existing
    thumbnailFile: null, // File baru
    gambarFiles: [], // File[] baru
  });

  const [uiError, setUiError] = useState("");

  const { categories, loadingCategories, categoriesError } = useCategories();
  const {
    service,
    loading: loadingDetail,
    error: detailError,
  } = useServiceDetailForEdit(id);

  const { updateService, updating, error: submitError } = useUpdateService();

  useEffect(() => {
    if (service) {
      setForm({
        judul: service.judul || "",
        deskripsi: service.deskripsi || "",
        kategori_id: service.kategori_id || "",
        harga:
          service.harga !== undefined && service.harga !== null
            ? String(service.harga)
            : "",
        waktu_pengerjaan:
          service.waktu_pengerjaan !== undefined &&
          service.waktu_pengerjaan !== null
            ? String(service.waktu_pengerjaan)
            : "",
        batas_revisi:
          service.batas_revisi !== undefined && service.batas_revisi !== null
            ? String(service.batas_revisi)
            : "",
        thumbnail: service.thumbnail || "",
        gambar: Array.isArray(service.gambar) ? service.gambar : [],
        thumbnailFile: null,
        gambarFiles: [],
      });
    }
  }, [service]);

  function update(partial) {
    setForm((prev) => ({ ...prev, ...partial }));
  }

  function cancel() {
    navigate("/freelance/service");
  }

  async function submit() {
    setUiError("");

    if (!form.thumbnail && !form.thumbnailFile) {
      setUiError("Thumbnail layanan wajib diisi.");
      return;
    }

    if (
      !form.judul ||
      !form.deskripsi ||
      !form.waktu_pengerjaan ||
      !form.kategori_id ||
      !form.harga ||
      form.batas_revisi === "" ||
      form.batas_revisi === null
    ) {
      setUiError("Harap lengkapi semua field yang bertanda *.");
      return;
    }

    try {
      await updateService(id, form);
      navigate("/freelance/service");
    } catch {
      // error sudah di-set di hook
    }
  }

  const mergedError = uiError || submitError || categoriesError || detailError;

  const isLoadingInitial = loadingDetail || loadingCategories;

  return (
    <div className="min-h-screen bg-[#F7F8FA]">
      <Navbar />
      <DashboardHeaderBar
        title="Freelancer"
        subPage="Edit Service"
        active="produk"
      />

      <main className="mx-auto max-w-7xl px-4 py-4">
        {isLoadingInitial && (
          <div className="mb-4 text-sm text-[#6B7280]">
            Memuat data layanan...
          </div>
        )}

        <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
          <MediaEditFormCard values={form} onChange={update} />

          <PricingEditFormCard
            values={form}
            onChange={update}
            onCancel={cancel}
            onSubmit={submit}
            categories={categories}
            loading={updating || isLoadingInitial}
            loadingCategories={loadingCategories}
            error={mergedError}
          />
        </div>
      </main>

      <Footer />
    </div>
  );
}
