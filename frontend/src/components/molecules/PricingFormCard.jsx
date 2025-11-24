import Card from "../atoms/Card";
import Label from "../atoms/Label";
import Input from "../atoms/Input";
import SelectBox from "../atoms/SelectBox";
import Button from "../atoms/Button";

export default function PricingFormCard({
  values,
  onChange,
  onCancel,
  onSubmit,
  categories = [],
  loading = false,
  loadingCategories = false,
  error = "",
}) {
  // ===== Helpers angka =====
  function handleIntFieldChange(e, field) {
    const raw = e.target.value || "";
    const numeric = raw.replace(/\D/g, "");
    onChange({ [field]: numeric });
  }

  function handleHargaChange(e) {
    const raw = e.target.value || "";
    // hanya digit + titik
    let cleaned = raw.replace(/[^0-9.]/g, "");

    // pisah integer & decimal
    const parts = cleaned.split(".");
    let intPart = parts[0] || "";
    let decPart = parts[1] || "";

    // batasi panjang integer & decimal
    intPart = intPart.slice(0, 10);
    decPart = decPart.slice(0, 2);

    let result = intPart;
    if (raw.includes(".")) {
      // user sudah ngetik titik → izinkan "123." sementara
      result = decPart.length ? `${intPart}.${decPart}` : `${intPart}.`;
    }

    onChange({ harga: result });
  }

  // Format rupiah untuk display
  function formatRupiah(value) {
    if (!value) return "";
    return new Intl.NumberFormat("id-ID").format(value);
  }

  return (
    <Card
      className="h-full flex flex-col"
      title="Harga"
      subtitle="Izinkan Pelanggan membayar sesuai keinginan mereka"
    >
      <div className="flex-1 space-y-4">
        {/* Waktu Pengerjaan (hari, INT) */}
        <div className="space-y-2">
          <Label>
            Waktu Pengerjaan <span className="text-red-500">*</span>
          </Label>
          <Input
            placeholder="Contoh: 7 (dalam hari)"
            inputMode="numeric"
            value={values.waktu_pengerjaan || ""}
            onChange={(e) => handleIntFieldChange(e, "waktu_pengerjaan")}
            disabled={loading}
          />
          <p className="text-xs text-gray-500 mt-1">
            Masukkan estimasi waktu pengerjaan dalam satuan hari (minimal 1 hari)
          </p>
        </div>

        {/* Kategori */}
        <div className="space-y-2">
          <Label>
            Kategori <span className="text-red-500">*</span>
          </Label>
          <SelectBox
            value={values.kategori_id || ""}
            onChange={(e) =>
              onChange({
                kategori_id: e.target.value,
              })
            }
            disabled={loading || loadingCategories}
          >
            <option value="" disabled>
              {loadingCategories
                ? "Memuat kategori..."
                : "Pilih Kategori Layanan"}
            </option>
            {categories.map((cat) => (
              <option key={cat.id} value={cat.id}>
                {cat.nama}
              </option>
            ))}
          </SelectBox>
          <p className="text-xs text-gray-500 mt-1">
            Pilih kategori yang sesuai dengan layanan Anda
          </p>
        </div>

        {/* Harga Dasar (DECIMAL) */}
        <div className="space-y-2">
          <Label>
            Harga Dasar <span className="text-red-500">*</span>
          </Label>
          <Input
            placeholder="Contoh: 500000 atau 500000.50"
            inputMode="decimal"
            value={values.harga || ""}
            onChange={handleHargaChange}
            disabled={loading}
          />
          <div className="text-xs text-gray-500 mt-1 space-y-1">
            <p>Masukkan harga dalam Rupiah (tanpa titik/koma ribuan)</p>
            {values.harga && (
              <p className="font-medium text-gray-700">
                ≈ Rp {formatRupiah(Math.floor(values.harga))}
              </p>
            )}
          </div>
        </div>
      </div>

      {error && (
        <div className="mt-3 p-3 bg-red-50 border border-red-200 rounded-lg">
          <p className="text-sm text-red-600 font-medium">⚠️ {error}</p>
        </div>
      )}

      {/* Action buttons */}
      <div className="mt-4">
        <div className="flex items-center justify-between gap-3">
          <Button
            variant="cancel"
            className="w-full sm:w-auto border-[#102d4f] hover:bg-[#3B82F6]/5"
            onClick={onCancel}
            disabled={loading}
          >
            Batal
          </Button>

          <Button
            variant="create"
            className="w-full sm:w-auto"
            onClick={onSubmit}
            disabled={loading}
          >
            {loading ? "Menyimpan..." : "Simpan Layanan"}
          </Button>
        </div>
      </div>
    </Card>
  );
}
