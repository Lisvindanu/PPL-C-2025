import { useState, useRef, useEffect } from "react";
import { useNavigate } from "react-router-dom";

function DropdownMenu({ title, items, onItemClick }) {
  const [isOpen, setIsOpen] = useState(false);
  const ref = useRef(null);

  useEffect(() => {
    function handleClickOutside(e) {
      if (ref.current && !ref.current.contains(e.target)) {
        setIsOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <div
      ref={ref}
      className="relative"
      onMouseEnter={() => setIsOpen(true)}
      onMouseLeave={() => setIsOpen(false)}
    >
      <button
        className="flex items-center gap-1 px-4 py-2 text-sm font-medium text-neutral-700 hover:text-[#1D375B] transition-all duration-200"
      >
        {title}
        <svg
          className={`w-4 h-4 transition-transform ${isOpen ? "rotate-180" : ""}`}
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M19 9l-7 7-7-7"
          />
        </svg>
      </button>

      {isOpen && (
        <div className="absolute left-0 top-full w-64 bg-white rounded-xl shadow-lg border border-neutral-200 py-2 z-50">
          {items.map((item, index) => (
            <button
              key={index}
              onClick={() => {
                onItemClick && onItemClick(item.slug || item.path);
                setIsOpen(false);
              }}
              className="w-full text-left px-4 py-2 text-sm text-neutral-700 hover:bg-[#D8E3F3]/50 hover:text-[#1D375B] transition-colors"
            >
              {item.label}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}

export default function NavService() {
  const navigate = useNavigate();

  const kategoriItems = [
    { label: "Pengembangan Website", slug: "pengembangan-website" },
    { label: "Pengembangan Aplikasi Mobile", slug: "pengembangan-aplikasi-mobile" },
    { label: "UI/UX Design", slug: "ui-ux-design" },
    { label: "Data Science & Machine Learning", slug: "data-science-machine-learning" },
    { label: "Cybersecurity & Testing", slug: "cybersecurity-testing" },
    { label: "Copy Writing", slug: "copy-writing" },
  ];

  const caraPenggunaanItems = [
    { label: "Daftar sebagai Freelancer", path: "/register/freelancer" },
    { label: "Cara Mulai Jual Pekerjaan", path: "/cara-jual-pekerjaan" },
    { label: "Pembayaran", path: "/pembayaran" },
    { label: "Jaminan Pekerjaan", path: "/jaminan-pekerjaan" },
    { label: "Blog Informasi", path: "/blog" },
    { label: "FAQ", path: "/faq" },
    { label: "Atur Penggunaan Data Personal", path: "/privasi-data" },
    { label: "Produk", path: "/produk" },
  ];

  const tentangItems = [
    { label: "Bekerja dengan SkillConnect", path: "/tentang/bekerja" },
    { label: "Syarat dan ketentuan", path: "/syarat-ketentuan" },
    { label: "Kebijakan privasi", path: "/kebijakan-privasi" },
  ];

  const handleKategoriClick = (slug) => {
    navigate(`/services?category=${slug}`);
  };

  const handleMenuClick = (path) => {
    navigate(path);
  };

  return (
    <div className="border-b border-neutral-200 bg-white">
      <div className="mx-auto max-w-7xl px-3 sm:px-4">
        <div className="flex items-center gap-1">
          <DropdownMenu
            title="Kategori"
            items={kategoriItems}
            onItemClick={handleKategoriClick}
          />
          <DropdownMenu
            title="Cara Penggunaan"
            items={caraPenggunaanItems}
            onItemClick={handleMenuClick}
          />
          <DropdownMenu
            title="Tentang SkillConnect"
            items={tentangItems}
            onItemClick={handleMenuClick}
          />
        </div>
      </div>
    </div>
  );
}
