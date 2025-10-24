import { useState } from "react";

export default function SearchBarLanding({ onSearch }) {
  const [query, setQuery] = useState("");

  const handleSearch = () => {
    if (onSearch) {
      onSearch(query);
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === "Enter") {
      handleSearch();
    }
  };

  return (
    <div className="w-full max-w-3xl mx-auto relative">
      <input
        type="text"
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        onKeyPress={handleKeyPress}
        placeholder="Logo minimalis untuk restoran"
        className="w-full px-6 py-4 rounded-full border-2 border-white/30 bg-white/10 backdrop-blur-sm text-white placeholder-white/70 focus:outline-none focus:border-white/50 transition-all duration-300"
      />
      <div className="absolute right-6 top-1/2 transform -translate-y-1/2 text-white pointer-events-none">
        <i className="fas fa-search text-xl" />
      </div>
    </div>
  );
}
