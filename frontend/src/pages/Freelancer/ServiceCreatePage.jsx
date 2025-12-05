import { useState } from "react";
import Navbar from "../../components/Fragments/Common/Navbar";
import DashboardHeaderBar from "../../components/Fragments/Dashboard/DashboardHeaderBar";
import MediaFormCard from "../../components/Fragments/Service/MediaFormCard";
import PricingFormCard from "../../components/Fragments/Service/PricingFormCard";
import Footer from "../../components/Fragments/Common/Footer";

import useCategories from "../../hooks/useCategories";
import useCreateService from "../../hooks/useCreateService";

export default function ServiceCreatePage() {
  const [form, setForm] = useState({
    thumbnail: null, // 1 file
    gambar: [], // max 5 file
    batas_revisi: "", // int
    judul: "", // varchar(255)
    deskripsi: "", // text
    waktu_pengerjaan: "", // int (hari)
    kategori_id: "", // fk kategori
    harga: "", // decimal(10,2) – string di UI
  });

  const [uiError, setUiError] = useState("");

  const { categories, loadingCategories, categoriesError } = useCategories();
  const { createService, submitting, submitError } = useCreateService();

  function update(partial) {
    setForm((prev) => ({ ...prev, ...partial }));
  }

  function cancel() {
    window.history.back();
  }

  async function submit() {
    setUiError("");

    if (!form.thumbnail) {
      setUiError("Thumbnail layanan wajib diisi.");
      return;
    }

    if (
      !form.judul ||
      !form.deskripsi ||
      !form.waktu_pengerjaan ||
      !form.kategori_id ||
      !form.harga ||
      !form.batas_revisi
    ) {
      setUiError("Harap lengkapi semua field yang bertanda *.");
      return;
    }

    try {
      await createService(form);
      window.location.href = "/freelance/service";
    } catch {
      // error sudah di-set di submitError oleh hook, jadi di sini cukup diam
    }
  }

  const mergedError = uiError || submitError || categoriesError;

  return (
    <div className="min-h-screen bg-[#F7F8FA]">
      <Navbar />
      <DashboardHeaderBar
        title="Freelancer"
        subPage="Create Service"
        active="produk"
      />

      <main className="mx-auto max-w-7xl px-4 py-4">
        <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
          <MediaFormCard values={form} onChange={update} />

          <PricingFormCard
            values={form}
            onChange={update}
            onCancel={cancel}
            onSubmit={submit}
            categories={categories}
            loading={submitting}
            loadingCategories={loadingCategories}
            error={mergedError}
          />
        </div>
      </main>
      <Footer />
    </div>
  );
}
