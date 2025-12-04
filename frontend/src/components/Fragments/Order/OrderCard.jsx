import Button from "../../Elements/Buttons/Button";
import { Clock, RotateCcw, ShieldCheck, Headset, Star } from "lucide-react";

function Row({ icon: IconCmp, label, value }) {
  return (
    <div className="flex items-center justify-between text-sm text-neutral-700">
      <div className="flex items-center gap-2">
        <span className="flex h-8 w-8 items-center justify-center rounded-full bg-[#EEF2FF]">
          <IconCmp className="h-4 w-4 text-[#1D4ED8]" />
        </span>
        <span>{label}</span>
      </div>
      {value && (
        <span className="text-sm font-semibold text-neutral-900">{value}</span>
      )}
    </div>
  );
}

/**
 * Komponen rating
 *
 */
function StarRating({ value = 0, max = 5 }) {
  const rating = Math.max(0, Math.min(max, Number(value) || 0));
  const rounded = Math.round(rating * 2) / 2; // misal 4.3 -> 4.5

  return (
    <div className="flex items-center gap-0.5">
      {Array.from({ length: max }).map((_, index) => {
        const starIndex = index + 1;
        const filled = starIndex <= Math.floor(rounded);
        const isHalf = !filled && starIndex - rounded === 0.5;

        return (
          <Star
            key={starIndex}
            className={`h-4 w-4 ${
              filled || isHalf
                ? "fill-[#FBBF24] text-[#FBBF24]"
                : "text-neutral-300"
            }`}
          />
        );
      })}
    </div>
  );
}

export default function OrderCard({
  price,
  rating = 0,
  reviewCount = 0,
  completed = 0,
  waktu_pengerjaan,
  batas_revisi,
  onOrder,
  onContact,
}) {
  const safeRating = Number.isFinite(Number(rating)) ? Number(rating) : 0;
  const safeReviews = Number.isFinite(Number(reviewCount))
    ? Number(reviewCount)
    : 0;
  const safeCompleted = Number.isFinite(Number(completed))
    ? Number(completed)
    : 0;

  return (
    <aside className="rounded-2xl border border-neutral-200 bg-white p-4 sm:p-5 shadow-sm">
      {/* Header harga */}
      <div className="mb-3">
        <p className="text-xs font-semibold uppercase tracking-wide text-neutral-500">
          Harga
        </p>
        <p className="mt-1 text-2xl font-semibold text-[#2563EB]">
          Rp. {Number(price || 0).toLocaleString("id-ID")}
        </p>
      </div>

      {/* Rating & statistik pesanan */}
      <div className="mb-3 flex items-center gap-2 text-sm text-[#585859]">
        <StarRating value={safeRating} />
        <span>{safeRating.toFixed(1)}</span>
        <span>•</span>
        <span>{safeReviews} reviews</span>
        <span>•</span>
        <span>{safeCompleted} selesai</span>
      </div>

      <hr className="mb-3 border-neutral-200" />

      {/* Info waktu, revisi, proteksi, CS */}
      <div className="space-y-2">
        <Row
          icon={Clock}
          label="Estimasi Pengerjaan"
          value={waktu_pengerjaan}
        />
        <Row
          icon={RotateCcw}
          label="Revamb / Revisi"
          value={batas_revisi != null ? `${batas_revisi}` : "3x revisi besar"}
        />
        <Row icon={ShieldCheck} label="Pembayaran dilindungi platform" />
        <Row icon={Headset} label="Didukung customer servis 24/7" />
      </div>

      {/* Tombol aksi */}
      <div className="mt-5 flex flex-col gap-2">
        <Button
          variant="order"
          onClick={onOrder}
          className="w-full px-4 py-2.5 text-sm font-semibold shadow focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#0F172A]/60 focus-visible:ring-offset-2"
        >
          Pesan Sekarang
        </Button>

        <Button
          variant="outline"
          onClick={onContact}
          className="w-full rounded-xl border-none bg-[#F3F4F6] px-4 py-2.5 text-sm font-semibold text-[#111827] hover:bg-[#E5E7EB]"
        >
          Hubungi Freelancer
        </Button>
      </div>
    </aside>
  );
}
