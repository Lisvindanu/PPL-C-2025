import { useState } from "react";
import Navbar from "../../components/organisms/Navbar";
import DashboardHeaderBar from "../../components/molecules/DashboardHeaderBar";
import MediaFormCard from "../../components/molecules/MediaFormCard";
import PricingFormCard from "../../components/molecules/PricingFormCard";

export default function ServiceCreatePage() {
  const [form, setForm] = useState({
    gambar: null,
    video: "",
    judul: "",
    deskripsi: "",
    durasi: "",
    kategori: "",
    hargaDasar: "",
  });

  function update(partial) {
    setForm((p) => ({ ...p, ...partial }));
  }

  function cancel() {
    window.history.back();
  }

  function submit() {
    console.log("submit", form);
  }

  return (
    <div className="min-h-screen bg-[#F7F8FA]">
      <Navbar />
      <DashboardHeaderBar title="Freelancer" subPage="Create Service" active="produk" />

      <main className="mx-auto max-w-7xl px-4 py-4">
        <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
          <MediaFormCard values={form} onChange={update} />
          <PricingFormCard values={form} onChange={update} onCancel={cancel} onSubmit={submit} />
        </div>
      </main>
    </div>
  );
}
