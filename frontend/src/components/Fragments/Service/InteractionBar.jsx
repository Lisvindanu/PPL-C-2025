import { useState } from "react";
import { Heart, Share2 } from "lucide-react";

export default function InteractionBar() {
  const [fav, setFav] = useState(false);

  function share() {
    const url = typeof window !== "undefined" ? window.location.href : "";
    navigator.clipboard?.writeText(url);
  }

  return (
    <div className="mt-3 rounded-xl border border-neutral-200 bg-white px-4 py-2 flex items-center justify-between">
      {/* Favorite */}
      <button
        type="button"
        onClick={() => setFav((v) => !v)}
        className={`inline-flex items-center gap-2 text-sm font-medium transition ${
          fav ? "text-red-500" : "text-neutral-900"
        }`}
      >
        <Heart
          className={`w-4 h-4 ${
            fav
              ? "text-red-500 fill-[#f54337]"
              : "text-neutral-900 fill-transparent"
          }`}
        />
        <span>Favorite</span>
      </button>

      {/* Share */}
      <button
        type="button"
        onClick={share}
        className="inline-flex items-center gap-2 text-sm font-medium text-neutral-900 hover:text-[#1f5eff] transition"
      >
        <Share2 className="w-4 h-4" />
        <span>Share</span>
      </button>
    </div>
  );
}
