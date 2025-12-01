import { useState, useRef } from "react";

const categories = [
  { id: "all", nama: "Semua Kategori", slug: null },
  { id: 1, nama: "Pengembangan website", slug: "pengembangan-website" },
  { id: 2, nama: "Pengembangan Aplikasi Mobile", slug: "pengembangan-aplikasi-mobile" },
  { id: 3, nama: "UI/UX Design", slug: "ui-ux-design" },
  { id: 4, nama: "Data Science & Machine Learning", slug: "data-science-machine-learning" },
  { id: 5, nama: "Cybersecurity & Testing", slug: "cybersecurity-testing" },
  { id: 6, nama: "Copy Writing", slug: "copy-writing" },
];

export default function FilterKategori({ onFilterChange, activeFilter: externalActiveFilter }) {
  const scrollContainerRef = useRef(null);

  // Use external activeFilter if provided, otherwise use "all"
  const activeFilterId = externalActiveFilter
    ? categories.find(cat => cat.slug === externalActiveFilter)?.id || "all"
    : "all";

  const handleFilterClick = (categoryId, slug) => {
    if (onFilterChange) {
      onFilterChange(slug);
    }
  };

  // Calculate total services based on filter
  // Mock count - in production would come from API
  const getTotalServices = () => {
    if (!externalActiveFilter) return 60; // All services
    // Return count for specific category (mock - in production from API)
    const categoryServicesCount = {
      "pengembangan-website": 10,
      "pengembangan-aplikasi-mobile": 10,
      "ui-ux-design": 10,
      "data-science-machine-learning": 10,
      "cybersecurity-testing": 10,
      "copy-writing": 10,
    };
    return categoryServicesCount[externalActiveFilter] || 0;
  };

  const scroll = (direction) => {
    if (scrollContainerRef.current) {
      const scrollAmount = direction === "left" ? -300 : 300;
      scrollContainerRef.current.scrollBy({
        left: scrollAmount,
        behavior: "smooth",
      });
    }
  };

  return (
    <section className="py-8 px-4 bg-white border-b border-neutral-200">
      <div className="max-w-7xl mx-auto">
        <h3 className="text-xl font-bold text-neutral-900 mb-4">Filter Kategori</h3>

        {/* Filter Pills with Scroll Buttons */}
        <div className="flex items-center gap-4 mb-4">
          {/* Scroll Left Button */}
          <button
            type="button"
            onClick={(e) => {
              e.preventDefault();
              scroll("left");
            }}
            className="flex-shrink-0 w-10 h-10 rounded-full bg-gradient-to-br from-[#D8E3F3] to-[#9DBBDD] flex items-center justify-center hover:from-[#4782BE] hover:to-[#1D375B] transition-all duration-300 shadow-md hover:shadow-xl group"
          >
            <i className="fas fa-chevron-left text-lg text-[#1D375B] group-hover:text-white transition-colors" />
          </button>

          {/* Filter Pills */}
          <div
            ref={scrollContainerRef}
            className="flex gap-3 overflow-x-auto pb-2 flex-1"
            style={{
              scrollbarWidth: 'none',
              msOverflowStyle: 'none',
              WebkitOverflowScrolling: 'touch'
            }}
          >
            
            {categories.map((category) => (
              <button
                key={category.id}
                onClick={() => handleFilterClick(category.id, category.slug)}
                className={`flex-shrink-0 whitespace-nowrap rounded-full px-5 py-2 text-sm font-medium transition-all duration-200 ${
                  activeFilterId === category.id
                    ? "bg-[#4782BE] text-white shadow-md"
                    : "bg-[#D8E3F3] text-neutral-700 hover:bg-[#4782BE]/40 hover:text-[#1D375B]"
                }`}
              >
                {category.nama}
              </button>
            ))}
          </div>

          {/* Scroll Right Button */}
          <button
            type="button"
            onClick={(e) => {
              e.preventDefault();
              scroll("right");
            }}
            className="flex-shrink-0 w-10 h-10 rounded-full bg-gradient-to-br from-[#4782BE] to-[#1D375B] flex items-center justify-center hover:shadow-xl transition-all duration-300 shadow-md"
          >
            <i className="fas fa-chevron-right text-lg text-white" />
          </button>
        </div>

        {/* Total Services Count */}
        <p className="text-sm text-neutral-600">
          Menampilkan <span className="font-semibold">{getTotalServices()}</span> layanan
        </p>
      </div>
    </section>
  );
}
