import { useEffect, useRef, useState } from "react";
import NavLink from "../atoms/NavLink";

const DEFAULT_ITEMS = [
  { label: "Narapandang", href: "#" },
  { label: "Pelakon", href: "#" },
  { label: "Laga & Gaya", href: "#" },
  { label: "Wahana", href: "#" },
  { label: "Olah Bola", href: "#" },
  { label: "Cerita Rasa", href: "#" },
  { label: "Horison", href: "#" },
  { label: "Jagat Kita", href: "#" },
  { label: "Mata Elang", href: "#" },
];

const MORE_ITEMS = [
  { label: "Sains", href: "#" },
  { label: "Teknologi", href: "#" },
  { label: "Budaya", href: "#" },
  { label: "Sosok", href: "#" },
];

export default function CategoryMenu() {
  const [open, setOpen] = useState(false);
  const ref = useRef(null);

  useEffect(() => {
    const onDoc = (e) => {
      if (!ref.current) return;
      if (!ref.current.contains(e.target)) setOpen(false);
    };
    document.addEventListener("mousedown", onDoc);
    return () => document.removeEventListener("mousedown", onDoc);
  }, []);

  return (
    <div className="relative w-full" ref={ref}>
      {/* wrapper scrollable + center */}
      <div className="relative">
        {/* Fade kiri/kanan di mobile supaya tidak terlihat 'nabrak' */}
        <div className="pointer-events-none absolute inset-y-0 left-0 w-6 bg-gradient-to-r from-white to-transparent sm:w-8 md:hidden" />
        <div className="pointer-events-none absolute inset-y-0 right-0 w-6 bg-gradient-to-l from-white to-transparent sm:w-8 md:hidden" />

        {/* bar kategori: selalu center; mobile bisa geser horizontal */}
        <div
          className="
            overflow-x-auto no-scrollbar
            "
          role="tablist"
          aria-label="Kategori"
        >
          <ul
            className="
              mx-auto
              flex items-center justify-center gap-2
              px-4 sm:px-6 md:px-8
              py-2
              whitespace-nowrap
              "
          >
            {DEFAULT_ITEMS.map((it) => (
              <li key={it.label} className="shrink-0">
                <NavLink href={it.href}>{it.label}</NavLink>
              </li>
            ))}

            {/* Lainnya */}
            <li className="shrink-0">
              <button
                onClick={() => setOpen((v) => !v)}
                className="inline-flex items-center gap-1 px-2 py-2 text-sm text-neutral-700 hover:text-black"
                aria-haspopup="menu"
                aria-expanded={open}
              >
                Lainnya
                <svg
                  className={`h-4 w-4 transition ${open ? "rotate-180" : ""}`}
                  viewBox="0 0 24 24"
                  fill="none"
                >
                  <path
                    d="M6 9l6 6 6-6"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                  />
                </svg>
              </button>
            </li>
          </ul>
        </div>
      </div>

      {/* dropdown Lainnya */}
      {open && (
        <div
          role="menu"
          className="absolute left-1/2 z-20 mt-2 w-56 -translate-x-1/2 overflow-hidden rounded-xl border border-neutral-200 bg-white shadow-lg"
        >
          {MORE_ITEMS.map((it) => (
            <a
              key={it.label}
              href={it.href}
              className="block px-4 py-2 text-sm hover:bg-neutral-50"
            >
              {it.label}
            </a>
          ))}
        </div>
      )}
    </div>
  );
}
