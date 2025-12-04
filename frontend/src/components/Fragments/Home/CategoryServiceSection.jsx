import { useRef } from "react";
import { motion } from "framer-motion";
import ServiceCardItem from "../molecules/ServiceCardItem";

export default function CategoryServiceSection({ category, services, onServiceClick, onCategoryClick }) {
  const scrollContainerRef = useRef(null);

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
    <div className="mb-16">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h3 className="text-2xl font-bold text-neutral-900 mb-1">
            {category.title}
          </h3>
          <p className="text-neutral-600">{services.length} layanan tersedia</p>
        </div>
        <button
          onClick={() => onCategoryClick && onCategoryClick(category.slug)}
          className="whitespace-nowrap rounded-full px-4 py-2 text-sm font-medium text-neutral-700 bg-[#D8E3F3] hover:bg-[#4782BE]/40 hover:text-[#1D375B] transition-all duration-200"
        >
          Lainnya
        </button>
      </div>

      {/* Services Carousel */}
      <div className="flex items-center gap-4">
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

        {/* Services Cards */}
        <div
          ref={scrollContainerRef}
          className="flex gap-6 overflow-x-auto pb-4 scrollbar-hide flex-1"
          style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
        >
          {services.map((service) => (
            <ServiceCardItem
              key={service.id}
              service={service}
              onClick={() => onServiceClick && onServiceClick(service)}
            />
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
    </div>
  );
}
