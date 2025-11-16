import { useEffect, useRef, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import Icon from "../atoms/Icon";

/**
 * Helpers aman
 */
function cn(...a) {
  return a.filter(Boolean).join(" ");
}
function toNumber(v, f = 0) {
  const n = Number(v);
  return Number.isFinite(n) ? n : f;
}
function formatPriceID(v) {
  return `Rp. ${toNumber(v, 0).toLocaleString("id-ID")}`;
}
function timeAgoISO(iso) {
  try {
    const d = new Date(iso);
    if (Number.isNaN(d.getTime())) return "-";
    const diff = Date.now() - d.getTime();
    const days = Math.floor(diff / (1000 * 60 * 60 * 24));
    if (days <= 0) return "Hari ini";
    if (days === 1) return "1 Hari Lalu";
    return `${days} Hari Lalu`;
  } catch {
    return "-";
  }
}

/**
 * Badge status pojok kanan bawah
 */
function StatusBadge({ status }) {
  const s = (status || "").toLowerCase();
  const map = {
    aktif: { dot: "bg-green-500", text: "text-green-700", bg: "bg-green-50" },
    draft: { dot: "bg-amber-500", text: "text-amber-700", bg: "bg-amber-50" },
    nonaktif: { dot: "bg-red-500", text: "text-red-700", bg: "bg-red-50" },
  };
  const c = map[s] || map.nonaktif;
  return (
    <div
      className={cn(
        "absolute bottom-3 right-3 inline-flex items-center gap-2 rounded-full border border-black/5 px-3 py-1.5 text-xs",
        c.bg,
        c.text
      )}
    >
      <span className={cn("h-2 w-2 rounded-full", c.dot)} />
      <span className="capitalize">{status || "Nonaktif"}</span>
    </div>
  );
}

/**
 * Tag kecil abu
 */
function TinyTag({ children }) {
  return (
    <span className="rounded-md border border-neutral-200 bg-neutral-50 px-2 py-1 text-[11px] text-neutral-600">
      {children}
    </span>
  );
}

/**
 * Kebab menu (3 titik vertikal)
 */
function Kebab({ onEdit, onDelete }) {
  const [open, setOpen] = useState(false);
  const ref = useRef(null);
  useEffect(() => {
    const off = (e) => {
      if (ref.current && !ref.current.contains(e.target)) setOpen(false);
    };
    document.addEventListener("mousedown", off);
    return () => document.removeEventListener("mousedown", off);
  }, []);
  return (
    <div className="relative" ref={ref}>
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        className="rounded-full p-1.5 hover:bg-neutral-100"
        aria-label="More"
      >
        <Icon name="dots-vertical" />
      </button>
      {open && (
        <div className="absolute right-0 z-20 mt-2 w-28 overflow-hidden rounded-lg border border-neutral-200 bg-white shadow-lg">
          <button
            type="button"
            onClick={() => {
              setOpen(false);
              onEdit?.();
            }}
            className="flex w-full items-center gap-2 px-3 py-2 text-sm hover:bg-neutral-50"
          >
            <Icon name="edit" />
            Edit
          </button>
          <div className="h-px bg-neutral-200" />
          <button
            type="button"
            onClick={() => {
              setOpen(false);
              onDelete?.();
            }}
            className="flex w-full items-center gap-2 px-3 py-2 text-sm text-red-600 hover:bg-red-50"
          >
            <Icon name="trash" />
            Hapus
          </button>
        </div>
      )}
    </div>
  );
}

/**
 * MyServiceCard
 */
export default function MyServiceCard({ svc, onEdit, onDelete }) {
  const navigate = useNavigate();

  // data aman
  const title = svc?.judul || "-";
  const desc = svc?.deskripsi || "";
  const cover =
    svc?.thumbnail ||
    (Array.isArray(svc?.gambar) && svc.gambar.length > 0
      ? svc.gambar[0]
      : null);
  const price = formatPriceID(svc?.harga);
  const updatedAgo = svc?.updated_at ? timeAgoISO(svc.updated_at) : "-";
  const tags =
    Array.isArray(svc?.tags) && svc.tags.length
      ? svc.tags
      : Array.isArray(svc?.label) && svc.label.length
      ? svc.label
      : []; // fallback lain kalau ada

  return (
    <div className="relative rounded-2xl border border-neutral-200 bg-white shadow-sm transition hover:shadow-md">
      {/* body utama */}
      <div className="p-4">
        {/* baris atas: avatar kecil + judul + kebab */}
        <div className="mb-3 flex items-start justify-between">
          <div className="flex min-w-0 items-start gap-3">
            <div className="h-12 w-12 overflow-hidden rounded-lg border border-neutral-200 bg-neutral-100">
              <img
                src={
                  cover ||
                  "https://images.unsplash.com/photo-1587614382346-4ec70e388b28?w=300&q=60&fit=crop"
                }
                alt="thumb"
                className="h-full w-full object-cover"
              />
            </div>
            <div className="min-w-0">
              <p className="line-clamp-1 text-sm font-semibold text-neutral-900">
                {title}
              </p>
              <p className="mt-1 line-clamp-2 text-[13px] leading-relaxed text-neutral-600">
                {desc}
              </p>
            </div>
          </div>

          <Kebab
            onEdit={() => {
              if (onEdit) onEdit(svc);
              else navigate(`/freelance/service/${svc.id}/edit`);
            }}
            onDelete={() => onDelete?.(svc)}
          />
        </div>

        {/* media banner besar */}
        <Link
          to={`/jobs/${svc?.slug || svc?.id}`}
          className="relative block overflow-hidden rounded-xl border border-neutral-200"
        >
          {cover ? (
            <img src={cover} alt={title} className="h-40 w-full object-cover" />
          ) : (
            <div className="h-40 w-full bg-neutral-100" />
          )}
          <StatusBadge status={svc?.status} />
        </Link>

        {/* tags */}
        {tags.length > 0 && (
          <div className="mt-3 flex flex-wrap gap-2">
            {tags.slice(0, 3).map((t, i) => (
              <TinyTag key={`${t}-${i}`}>{t}</TinyTag>
            ))}
          </div>
        )}

        {/* meta row (ikon + waktu) */}
        <div className="mt-3 flex items-center justify-between text-xs text-neutral-600">
          <div className="inline-flex items-center gap-2">
            <Icon name="document" className="text-neutral-500" />
            <span>Paruh Waktu</span>
            <span className="mx-2 h-1 w-1 rounded-full bg-neutral-300" />
            <Icon name="clock" className="text-neutral-500" />
            <span>{updatedAgo}</span>
          </div>
          {/* titik kecil dekoratif biar mirip desain */}
          <span className="h-1 w-1 rounded-full bg-neutral-300" />
        </div>

        {/* price row */}
        <div className="mt-2 text-sm font-semibold text-neutral-900">
          {price}
        </div>
      </div>
    </div>
  );
}
