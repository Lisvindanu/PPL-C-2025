import Navbar from "../organisms/Navbar";
import HeroSection from "../organisms/HeroSection";
import CategoryGrid from "../organisms/CategoryGrid";
import ServicesGrid from "../organisms/ServicesGrid";
import Footer from "../organisms/Footer";

export default function LandingPageTemplate({ onSearch, onCategoryClick, onServiceClick }) {
  return (
    <div className="min-h-screen">
      <Navbar />
      <HeroSection onSearch={onSearch} />
      <CategoryGrid onCategoryClick={onCategoryClick} />
      <ServicesGrid
        onServiceClick={onServiceClick}
        onCategoryClick={onCategoryClick}
      />
      <Footer />
    </div>
  );
}
