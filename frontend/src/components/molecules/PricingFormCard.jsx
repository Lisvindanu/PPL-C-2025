import Card from "../atoms/Card";
import Label from "../atoms/Label";
import Input from "../atoms/Input";
import SelectBox from "../atoms/SelectBox";
import Icon from "../atoms/Icon";
import Button from "../atoms/Button";

const DURATIONS = [
  "1 Minggu / 1 Bulan",
  "1 Bulan - 2 Bulan",
  "1 Bulan - 5 Bulan",
  "1 Bulan - 1 Tahun",
];

export default function PricingFormCard({ values, onChange, onCancel, onSubmit }) {
  return (
    <Card
      className="h-full flex flex-col"
      title="Harga"
      subtitle="Izinkan Pelanggan membayar sesuai keinginan mereka"
    >
      <div className="flex-1 space-y-4">
        <div className="space-y-2">
          <Label>
            Waktu Pengerjaan <span className="text-red-500">*</span>
          </Label>
          <SelectBox
            value={values.durasi || ""}
            onChange={(e) => onChange({ durasi: e.target.value })}
            leftIcon={<Icon name="time" size="sm" />}
          >
            <option value="" disabled>
              Please Select
            </option>
            {DURATIONS.map((d) => (
              <option key={d} value={d}>
                {d}
              </option>
            ))}
          </SelectBox>
        </div>

        <div className="space-y-2">
          <Label>
            Kategori <span className="text-red-500">*</span>
          </Label>
          <Input
            placeholder="UI/UX Design"
            value={values.kategori || ""}
            onChange={(e) => onChange({ kategori: e.target.value })}
          />
        </div>

        <div className="space-y-2">
          <Label>
            Harga Dasar <span className="text-red-500">*</span>
          </Label>
          <Input
            placeholder="2.000.000"
            inputMode="numeric"
            value={values.hargaDasar || ""}
            onChange={(e) => onChange({ hargaDasar: e.target.value })}
          />
        </div>
      </div>

      <div className="mt-4">
        <div className="flex items-center justify-between gap-3">
          {/* kiri */}
          <Button
            variant="outline"
            className="w-full sm:w-auto text-[#3B82F6] border-[#3B82F6] hover:bg-[#3B82F6]/5"
            onClick={onCancel}
          >
            Membatalkan
          </Button>

          {/* kanan */}
          <Button
            className="w-full sm:w-auto bg-[#2563EB] hover:opacity-95 text-white"
            onClick={onSubmit}
          >
            Menambahkan
          </Button>
        </div>
      </div>
    </Card>
  );
}
