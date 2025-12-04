import { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import Icon from "../../Elements/Icons/Icon";
import TagPill from "../../Elements/Common/TagPill";
import KebabButton from "../../Elements/Buttons/KebabButton";
import { buildMediaUrl } from "../../../utils/mediaUrl";

function StatusBadge({ status }) {
  const label = (status || "").toLowerCase();
  const map = {
    aktif: { dot: "bg-green-500", text: "Aktif" },
    draft: { dot: "bg-yellow-500", text: "Draft" },
    nonaktif: { dot: "bg-red-500", text: "Nonaktif" },
  };
  const conf = map[label] || { dot: "bg-yellow-500", text: status || "Draft" };
  return (
    <span className="ml-auto inline-flex items-center gap-2 text-[13px] text-neutral-700">
      <span className={`h-2.5 w-2.5 rounded-full ${conf.dot}`} />
      {conf.text}
    </span>
  );
}

export default function ServiceCard({
  item,
  onEdit,
  onDelete,
  disabledActions,
}) {
  const [openMenu, setOpenMenu] = useState(false);
  const menuRef = useRef(null);
  const navigate = useNavigate();

  useEffect(() => {
    const close = (e) => {
      if (menuRef.current && !menuRef.current.contains(e.target)) {
        setOpenMenu(false);
      }
    };
    document.addEventListener("mousedown", close);
    return () => document.removeEventListener("mousedown", close);
  }, []);

  const thumbnailUrl = item?.thumbnail ? buildMediaUrl(item.thumbnail) : null;

  // Harga: tampilkan apa adanya, jangan paksa parse biar nggak NaN
  let formattedHarga = "-";
  if (item?.harga !== undefined && item.harga !== null && item.harga !== "") {
    const raw = String(item.harga).trim();
    // kalau sudah ada "Rp" di depan, biarin
    formattedHarga = /^rp/i.test(raw) ? raw : `Rp ${raw}`;
  }

  function handleEditClick() {
    setOpenMenu(false);

    if (disabledActions) return;

    if (typeof onEdit === "function") {
      // Kasih item biar parent bisa pakai id dsb
      onEdit(item);
      return;
    }

    // Fallback: langsung navigate ke halaman edit layanan
    if (item?.id) {
      navigate(`/freelance/service/${item.id}/edit`);
    } else {
      console.warn("[ServiceCard] item.id tidak tersedia untuk navigasi edit");
    }
  }

  function handleDeleteClick() {
    setOpenMenu(false);
    if (disabledActions) return;
    if (typeof onDelete === "function") {
      onDelete(item);
    }
  }

  return (
    <div className="relative rounded-2xl border border-neutral-200 bg-white p-4 shadow-sm transition hover:shadow-md">
      <div className="mb-3 flex items-start justify-between">
        <div className="flex items-start gap-3">
          <div className="h-10 w-10 flex-shrink-0 overflow-hidden rounded-md border bg-neutral-100">
            {thumbnailUrl ? (
              <img
                src={thumbnailUrl}
                alt={item.judul || "Thumbnail layanan"}
                className="h-full w-full object-cover"
              />
            ) : (
              <div className="flex h-full w-full items-center justify-center text-[11px] text-neutral-400">
                <Icon name="image" className="h-4 w-4" />
              </div>
            )}
          </div>
          <div>
            <p className="text-sm font-semibold text-neutral-900">
              {item.judul}
            </p>
            <p className="mt-0.5 line-clamp-2 text-[13px] text-neutral-600">
              {item.deskripsi}
            </p>
          </div>
        </div>

        <div className="relative" ref={menuRef}>
          <KebabButton onClick={() => setOpenMenu((v) => !v)} />
          {openMenu && (
            <div className="absolute right-0 z-20 mt-1 w-28 overflow-hidden rounded-md border border-neutral-200 bg-white text-sm shadow-lg">
              <button
                type="button"
                className="block w-full px-3 py-2 text-left hover:bg-neutral-50 disabled:opacity-50"
                onClick={handleEditClick}
                disabled={disabledActions}
              >
                Edit
              </button>
              <button
                type="button"
                className="block w-full px-3 py-2 text-left text-red-600 hover:bg-red-50 disabled:opacity-50"
                onClick={handleDeleteClick}
                disabled={disabledActions}
              >
                Hapus
              </button>
            </div>
          )}
        </div>
      </div>

      <div className="mb-3 flex flex-wrap gap-2">
        {item.nama_kategori ? <TagPill>{item.nama_kategori}</TagPill> : null}
      </div>

      <div className="mb-3 flex items-center gap-4 text-xs text-neutral-600">
        <span className="inline-flex items-center gap-1">
          <Icon name="time" className="h-4 w-4" />
          {item.created_at}
        </span>
      </div>

      <div className="flex items-center">
        <h3 className="text-base font-semibold text-neutral-900">
          {formattedHarga}
        </h3>
        <StatusBadge status={item.status} />
      </div>
    </div>
  );
}
