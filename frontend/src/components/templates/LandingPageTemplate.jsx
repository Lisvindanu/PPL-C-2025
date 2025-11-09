import { useState } from "react";
import Navbar from "../organisms/Navbar";
import HeroSection from "../organisms/HeroSection";
import CategoryGrid from "../organisms/CategoryGrid";
import FilterKategori from "../organisms/FilterKategori";
import ServicesGrid from "../organisms/ServicesGrid";
import RecommendationSection from "../organisms/RecommendationSection";
import Footer from "../organisms/Footer";

export default function LandingPageTemplate({ onSearch, onCategoryClick, onServiceClick }) {
  const [activeFilter, setActiveFilter] = useState(null); // null = show all

  const handleFilterChange = (categorySlug) => {
    setActiveFilter(categorySlug);
    console.log("Filter changed to:", categorySlug);
  };

  return (
    <div className="min-h-screen">
      <Navbar />
      <HeroSection onSearch={onSearch} />
      <CategoryGrid onCategoryClick={onCategoryClick} />
      <FilterKategori onFilterChange={handleFilterChange} activeFilter={activeFilter} />
      <ServicesGrid
        onServiceClick={onServiceClick}
        onCategoryClick={onCategoryClick}
        activeFilter={activeFilter}
      />
      <RecommendationSection onServiceClick={onServiceClick} />
      <Footer />
    </div>
  );
}
