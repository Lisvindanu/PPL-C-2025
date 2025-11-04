import { useState } from "react";
import { Heart, Share2 } from "lucide-react";

export default function InteractionBar() {
  const [fav, setFav] = useState(false);

  function share() {
    const url = typeof window !== "undefined" ? window.location.href : "";
    navigator.clipboard?.writeText(url);
  }

  return (
    <div className="flex items-center gap-3">
      <button
        type="button"
        onClick={() => setFav((v) => !v)}
        className={`inline-flex items-center gap-2 rounded-full border px-3 py-1.5 text-sm transition ${
          fav
            ? "bg-[#FFE8EA] border-[#FFB3BE] text-[#E11D48]"
            : "bg-white border-neutral-200 text-neutral-700 hover:bg-neutral-50"
        }`}
      >
        <Heart className="w-4 h-4" fill={fav ? "#E11D48" : "transparent"} />
        <span>Favorite</span>
      </button>

      <button
        type="button"
        onClick={share}
        className="inline-flex items-center gap-2 rounded-full border border-neutral-200 bg-white px-3 py-1.5 text-sm text-neutral-700 hover:bg-neutral-50"
      >
        <Share2 className="w-4 h-4" />
        <span>Share</span>
      </button>
    </div>
  );
}
