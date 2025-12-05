import { useNavigate } from "react-router-dom";

const categories = [
  {
    id: 1,
    nama: "Pengembangan Website",
    slug: "pengembangan-website",
  },
  {
    id: 2,
    nama: "Pengembangan Aplikasi Mobile",
    slug: "pengembangan-aplikasi-mobile",
  },
  {
    id: 3,
    nama: "UI/UX Design",
    slug: "ui-ux-design",
  },
  {
    id: 4,
    nama: "Data Science & Machine Learning",
    slug: "data-science-machine-learning",
  },
  {
    id: 5,
    nama: "Cybersecurity & Testing",
    slug: "cybersecurity-testing",
  },
  {
    id: 6,
    nama: "Copy Writing",
    slug: "copy-writing",
  },
];

export default function NavKategori() {
  const navigate = useNavigate();

  const handleCategoryClick = (slug) => {
    navigate(`/services?category=${slug}`);
  };

  return (
    <div className="border-t border-neutral-200 bg-white">
      <div className="mx-auto max-w-7xl px-3 sm:px-4">
        <div className="flex gap-2 overflow-x-auto py-3 scrollbar-hide">
          {categories.map((category) => (
            <button
              key={category.id}
              onClick={() => handleCategoryClick(category.slug)}
              className="whitespace-nowrap rounded-full px-4 py-2 text-sm font-medium text-neutral-700 bg-[#D8E3F3] hover:bg-[#4782BE]/40 hover:text-[#1D375B] transition-all duration-200"
            >
              {category.nama}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
