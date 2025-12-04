import { useNavigate } from "react-router-dom";
import LandingPageTemplate from "../../components/templates/LandingPageTemplate";

export default function Landing() {
  const navigate = useNavigate();

  const handleSearch = (query) => {
    if (query.trim()) {
      navigate(`/search?q=${encodeURIComponent(query)}`);
    }
  };

  const handleCategoryClick = (slug) => {
    navigate(`/kategori/${slug}`);
  };

  const handleServiceClick = (service) => {
    // Use slug as primary route, fallback to ID
    navigate(`/services/${service.slug || service.id}`);
  };

  return (
    <LandingPageTemplate
      onSearch={handleSearch}
      onCategoryClick={handleCategoryClick}
      onServiceClick={handleServiceClick}
    />
  );
}
