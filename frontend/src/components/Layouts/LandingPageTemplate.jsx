import { useState } from "react";
import Navbar from "../Fragments/Common/Navbar";
import HeroSection from "../Fragments/Home/HeroSection";
import CategoryGrid from "../Fragments/Home/CategoryGrid";
import FilterKategori from "../Fragments/Service/FilterKategori";
import ServicesGrid from "../Fragments/Home/ServicesGrid";
import RecommendationSection from "../Fragments/Home/RecommendationSection";
import Footer from "../Fragments/Common/Footer";

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
