import StarRating from "../atoms/StarRating";
import Button from "../atoms/Button";
import { Clock, RotateCcw, ShieldCheck, Headset } from "lucide-react";

function Row({ icon: IconCmp, label, value }) {
  return (
    <div className="flex items-center justify-between text-sm text-neutral-700">
      <div className="flex items-center gap-2">
        <IconCmp className="w-4 h-4 text-neutral-500" />
        <span>{label}</span>
      </div>
      <span className="font-medium">{value}</span>
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
  return (
    <aside className="rounded-xl border border-neutral-200 bg-white p-4 sm:p-5 shadow-sm">
      <div className="mb-3">
        <p className="text-xs uppercase text-[#242633]">Harga</p>
        <p className="text-2xl font-semibold text-[#1f5eff]">
          Rp. {Number(price || 0).toLocaleString("id-ID")}
        </p>
      </div>

      <div className="mb-3 flex items-center gap-2 text-sm text-[#585859]">
        <StarRating value={rating} />
        <span>{rating.toFixed(1)}</span>
        <span>•</span>
        <span>{reviewCount} reviews</span>
        <span>•</span>
        <span>{completed} selesai</span>
      </div>

      <div className="space-y-2">
        <Row icon={Clock} label="Waktu Pengerjaan" value={waktu_pengerjaan} />
        <Row icon={RotateCcw} label="Batas Revisi" value={batas_revisi} />
      </div>

      {/* Info proteksi & support */}
      <div className="mt-3 space-y-2 rounded-lg bg-neutral-50 p-3 border border-neutral-200">
        <div className="flex items-center gap-2 text-sm text-neutral-700">
          <ShieldCheck className="w-4 h-4 text-[#16a34a]" />
          <span>Pembayaran dilindungi platform</span>
        </div>
        <div className="flex items-center gap-2 text-sm text-neutral-700">
          <Headset className="w-4 h-4 text-[#3B82F6]" />
          <span>Dukungan customer service 24/7</span>
        </div>
      </div>

      <div className="mt-4 flex flex-col gap-2">
        <Button
          className="bg-[#1f5eff] hover:opacity-95 text-white"
          onClick={onOrder}
        >
          Pesan Sekarang
        </Button>
        <Button
          variant="outline"
          className="border-[#1f5eff] text-[#3B82F6] hover:bg-[#3B82F6]/5"
          onClick={onContact}
        >
          Hubungi Freelancer
        </Button>
      </div>
    </aside>
  );
}
