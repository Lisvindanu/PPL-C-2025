import { useEffect, useMemo, useRef, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import SearchInput from "../../Elements/Inputs/SearchInput";

const DEBOUNCE_MS = 350;
const MIN_LEN = 2; // mulai live search minimal 2 karakter

export default function SearchBar() {
  const navigate = useNavigate();
  const location = useLocation();
  const params = useMemo(
    () => new URLSearchParams(location.search),
    [location.search]
  );
  const initialQ = params.get("q") || "";

  const [q, setQ] = useState(initialQ);
  const timerRef = useRef(null);
  const didMount = useRef(false);

  // Live search (debounce) — tidak jalan saat mount, dan hanya jika q >= MIN_LEN
  useEffect(() => {
    if (!didMount.current) {
      didMount.current = true;
      return;
    }
    if (timerRef.current) clearTimeout(timerRef.current);

    const text = q.trim();
    if (text.length < MIN_LEN) {
      // jika kurang dari ambang, jangan navigasi ke /search
      return;
    }

    timerRef.current = setTimeout(() => {
      navigate(
        { pathname: "/search", search: `?q=${encodeURIComponent(text)}` },
        { replace: true }
      );
    }, DEBOUNCE_MS);

    return () => clearTimeout(timerRef.current);
  }, [q, navigate]);

  // Enter = pencarian eksplisit (selalu boleh selama tidak kosong)
  function onSubmit(e) {
    e.preventDefault();
    const text = q.trim();
    if (!text) return; // tidak melakukan apa-apa jika kosong
    navigate(
      { pathname: "/search", search: `?q=${encodeURIComponent(text)}` },
      { replace: false }
    );
  }

  return (
    <form
      onSubmit={onSubmit}
      className="relative w-full max-w-xl"
      role="search"
      aria-label="Pencarian"
    >
      <SearchInput
        value={q}
        onChange={(e) => setQ(e.target.value)}
        className="pr-10"
        autoComplete="off"
      />
      {/* ikon kaca pembesar di kanan */}
      <span className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-neutral-400">
        <svg
          width="18"
          height="18"
          viewBox="0 0 24 24"
          fill="none"
          aria-hidden="true"
        >
          <path
            d="M21 21l-4.35-4.35m1.35-5.65a7 7 0 11-14 0 7 7 0 0114 0z"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
          />
        </svg>
      </span>
    </form>
  );
}
