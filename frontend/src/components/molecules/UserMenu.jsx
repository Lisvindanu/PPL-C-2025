import { useEffect, useRef, useState } from "react";
import Avatar from "../atoms/Avatar";

export default function UserMenu({
  name,
  email,
  avatarSrc,
  onProfile,
  onSettings,
  onLogout,
}) {
  const [open, setOpen] = useState(false);
  const ref = useRef(null);

  useEffect(() => {
    function onDoc(e) {
      if (!ref.current) return;
      if (!ref.current.contains(e.target)) setOpen(false);
    }
    document.addEventListener("mousedown", onDoc);
    return () => document.removeEventListener("mousedown", onDoc);
  }, []);

  return (
    <div ref={ref} className="relative">
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        className="flex items-center gap-3 rounded-2xl px-2 py-1 hover:bg-neutral-100"
        aria-haspopup="menu"
        aria-expanded={open}
      >
        <Avatar src={avatarSrc} alt={name} size="sm" />
        <div className="hidden md:flex flex-col items-start leading-tight text-left">
          <span className="text-sm font-semibold text-neutral-900">{name}</span>
          <span className="text-[11px] text-neutral-500">{email}</span>
        </div>
        <svg
          className={`h-4 w-4 text-neutral-600 transition ${
            open ? "rotate-180" : ""
          }`}
          viewBox="0 0 24 24"
          fill="none"
          aria-hidden="true"
        >
          <path
            d="M6 9l6 6 6-6"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
          />
        </svg>
      </button>

      {open && (
        <div
          role="menu"
          className="absolute right-0 z-20 mt-2 w-56 overflow-hidden rounded-xl border border-neutral-200 bg-white shadow-lg"
        >
          <button
            type="button"
            role="menuitem"
            onClick={onProfile}
            className="w-full px-4 py-2 text-left text-sm hover:bg-neutral-50"
          >
            Profil
          </button>
          <button
            type="button"
            role="menuitem"
            onClick={onSettings}
            className="w-full px-4 py-2 text-left text-sm hover:bg-neutral-50"
          >
            Pengaturan
          </button>
          <div className="my-1 h-px bg-neutral-200" />
          <button
            type="button"
            role="menuitem"
            onClick={onLogout}
            className="w-full px-4 py-2 text-left text-sm text-red-600 hover:bg-red-50"
          >
            Keluar
          </button>
        </div>
      )}
    </div>
  );
}
