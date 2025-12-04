import React, { useEffect, useMemo, useState } from "react";
import { useSearchParams } from "react-router-dom";
import Navbar from "../../components/organisms/Navbar";
import Footer from "../../components/organisms/Footer";
import SearchServiceCardItem from "../../components/molecules/SearchServiceCardItem";
import Pagination from "../../components/atoms/Pagination";
import { useServiceSearch } from "../../hooks/useServiceSearch";
import SearchFilterSidebar from "../../components/molecules/SearchFilterSidebar";
import SearchSortBar from "../../components/molecules/SearchSortBar";

// ====== CONFIG & CONSTANTS ======

// Opsi range harga (untuk UI + mapping ke query harga_min / harga_max)
const PRICE_OPTIONS = [
  { id: "any", label: "Semua harga", min: null, max: null },
  { id: "low", label: "< Rp 2.000.000", min: null, max: 2000000 },
  {
    id: "mid",
    label: "Rp 2.000.000 - Rp 3.000.000",
    min: 2000000,
    max: 3000000,
  },
  { id: "high", label: "> Rp 3.000.000", min: 3000000, max: null },
];

// Mapping supaya filter rating kerasa beda antar level
const RATING_THRESHOLD_MAP = {
  5: 4.8,
  4: 4.5,
  3: 4.0,
  2: 3.5,
  1: 3.0,
};

const PAGE_SIZE = 12;
const API_LIMIT = 60;
const SEARCH_DEBOUNCE = 500; // ms

// ====== BASE URL BACKEND (API vs FILE) ======

const RAW_API_BASE = import.meta.env.VITE_API_BASE_URL || "";
const API_BASE_URL = RAW_API_BASE.replace(/\/+$/, "");

let FILE_BASE_URL = API_BASE_URL;
try {
  const u = new URL(API_BASE_URL);
  FILE_BASE_URL = `${u.protocol}//${u.host}`;
} catch {
  FILE_BASE_URL = API_BASE_URL.replace(/\/api$/i, "");
}

export default function SearchPage() {
  const [searchParams, setSearchParams] = useSearchParams();

  // keyword di input (selalu sinkron sama ?q= di URL)
  const initialKeyword = searchParams.get("q") || "";
  const [keyword, setKeyword] = useState(initialKeyword);

  // filter states
  const [selectedCategories, setSelectedCategories] = useState([]);
  const [selectedPriceId, setSelectedPriceId] = useState("any");
  const [priceMin, setPriceMin] = useState("");
  const [priceMax, setPriceMax] = useState("");
  const [minRating, setMinRating] = useState(null);
  const [sortBy, setSortBy] = useState("relevance");
  const [priceSort, setPriceSort] = useState("");
  const [page, setPage] = useState(1);

  // Kalau URL berubah (misal user search dari navbar), sync ke input
  useEffect(() => {
    const q = searchParams.get("q") || "";
    setKeyword(q);
    setPage(1);
  }, [searchParams]);

  const activeKeyword = searchParams.get("q") || "";

  // ========================================
  // Live search dengan debounce
  // ========================================
  useEffect(() => {
    const trimmed = keyword.trim();
    const currentQ = activeKeyword;

    const handler = setTimeout(() => {
      if (trimmed === currentQ) return;

      const params = new URLSearchParams(searchParams);

      if (trimmed) {
        params.set("q", trimmed);
      } else {
        params.delete("q");
      }

      setSearchParams(params);
      setPage(1);
    }, SEARCH_DEBOUNCE);

    return () => clearTimeout(handler);
  }, [keyword, activeKeyword, searchParams, setSearchParams]);

  // Enter → langsung tembak search tanpa nunggu debounce
  const handleSearchSubmit = (e) => {
    e.preventDefault();
    const params = new URLSearchParams(searchParams);
    const trimmed = keyword.trim();

    if (trimmed) {
      params.set("q", trimmed);
    } else {
      params.delete("q");
    }

    setSearchParams(params);
    setPage(1);
  };

  // Handlers filter
  const handleToggleCategory = (category) => {
    setSelectedCategories((prev) =>
      prev.includes(category)
        ? prev.filter((c) => c !== category)
        : [...prev, category]
    );
    setPage(1);
  };

  const handleChangePrice = (id) => {
    setSelectedPriceId(id);
    setPriceMin("");
    setPriceMax("");
    setPage(1);
  };

  const handleChangeRating = (rating) => {
    setMinRating((prev) => (prev === rating ? null : rating));
    setPage(1);
  };

  const handleChangeSortTab = (id) => {
    setSortBy(id);
    setPage(1);
  };

  const handleChangePriceSort = (value) => {
    setPriceSort(value);
    setPage(1);
  };

  const handleChangePriceMin = (value) => {
    setPriceMin(value);
    setPage(1);
  };

  const handleChangePriceMax = (value) => {
    setPriceMax(value);
    setPage(1);
  };

  const handleApplyPriceFilter = () => {
    setPage(1);
  };

  // ========================================
  // Hitung harga_min & harga_max efektif
  // ========================================
  const priceConf = PRICE_OPTIONS.find((p) => p.id === selectedPriceId);

  const effectiveMin = useMemo(() => {
    const formMin =
      priceMin !== "" && !Number.isNaN(Number(priceMin))
        ? Number(priceMin)
        : null;

    if (formMin != null) return formMin;
    if (priceConf?.min != null) return priceConf.min;
    return undefined;
  }, [priceMin, priceConf]);

  const effectiveMax = useMemo(() => {
    const formMax =
      priceMax !== "" && !Number.isNaN(Number(priceMax))
        ? Number(priceMax)
        : null;

    if (formMax != null) return formMax;
    if (priceConf?.max != null) return priceConf.max;
    return undefined;
  }, [priceMax, priceConf]);

  const ratingThreshold = useMemo(() => {
    if (minRating == null) return undefined;
    const mapped = RATING_THRESHOLD_MAP[minRating];
    if (typeof mapped === "number") return mapped;
    return minRating;
  }, [minRating]);

  // ========================================
  // Mapping sort UI -> sortBy & sortOrder API
  // ========================================
  let apiSortBy = "created_at";
  let apiSortOrder = "DESC";

  if (priceSort === "price_asc") {
    apiSortBy = "harga";
    apiSortOrder = "ASC";
  } else if (priceSort === "price_desc") {
    apiSortBy = "harga";
    apiSortOrder = "DESC";
  } else {
    if (sortBy === "latest") {
      apiSortBy = "created_at";
      apiSortOrder = "DESC";
    } else if (sortBy === "bestseller") {
      apiSortBy = "total_pesanan";
      apiSortOrder = "DESC";
    } else {
      // "relevance"
      apiSortBy = "rating_rata_rata";
      apiSortOrder = "DESC";
    }
  }

  // ========================================
  // Call API search (hook)
  // ========================================
  const {
    services: apiServices,
    pagination: apiPagination, // disimpan kalau nanti mau dipakai
    isLoading,
    isError,
    error,
  } = useServiceSearch({
    q: activeKeyword,
    status: "aktif",
    page: 1, // paginasi di frontend
    limit: API_LIMIT,
    harga_min: effectiveMin,
    harga_max: effectiveMax,
    rating_min: ratingThreshold,
    sortBy: apiSortBy,
    sortOrder: apiSortOrder,
  });

  // ========================================
  // Normalisasi data dari backend
  // ========================================
  const normalizedServices = useMemo(() => {
    if (!Array.isArray(apiServices)) return [];

    return apiServices.map((svc) => {
      const priceNumber =
        typeof svc.harga === "number"
          ? svc.harga
          : typeof svc.price === "number"
          ? svc.price
          : Number(svc.harga || svc.price || 0);

      const ratingNumber =
        typeof svc.rating_rata_rata === "number"
          ? svc.rating_rata_rata
          : typeof svc.rating === "number"
          ? svc.rating
          : 0;

      const reviewsNumber =
        typeof svc.jumlah_rating === "number"
          ? svc.jumlah_rating
          : typeof svc.reviews === "number"
          ? svc.reviews
          : 0;

      const ordersCount =
        typeof svc.total_pesanan === "number"
          ? svc.total_pesanan
          : typeof svc.ordersCount === "number"
          ? svc.ordersCount
          : 0;

      // Resolve thumbnail URL
      const rawThumb =
        svc.thumbnail ||
        (Array.isArray(svc.gambar) && svc.gambar[0]) ||
        (Array.isArray(svc.foto_layanan) && svc.foto_layanan[0]);

      let thumbnail;

      if (rawThumb) {
        if (/^https?:\/\//i.test(rawThumb)) {
          thumbnail = rawThumb;
        } else {
          const cleaned = String(rawThumb).replace(/^\/+/, "");
          const baseForFiles = FILE_BASE_URL || API_BASE_URL || "";

          if (baseForFiles) {
            if (cleaned.toLowerCase().startsWith("public/")) {
              thumbnail = `${baseForFiles}/${cleaned}`;
            } else {
              thumbnail = `${baseForFiles}/public/${cleaned}`;
            }
          } else {
            if (cleaned.toLowerCase().startsWith("public/")) {
              thumbnail = `/${cleaned}`;
            } else {
              thumbnail = `/public/${cleaned}`;
            }
          }
        }
      }

      const freelancerName =
        svc.freelancer_name ||
        svc.freelancer ||
        [svc.nama_depan, svc.nama_belakang].filter(Boolean).join(" ");

      return {
        id: svc.id,
        slug: svc.slug,
        title: svc.judul || svc.title || "Layanan",
        category: svc.nama_kategori || svc.category || "",
        freelancer: freelancerName,
        rating: ratingNumber,
        reviews: reviewsNumber,
        price: priceNumber,
        thumbnail,
        createdAt: svc.created_at || svc.createdAt,
        ordersCount,
      };
    });
  }, [apiServices]);

  // Kategori di sidebar diambil dari hasil search
  const categories = useMemo(() => {
    const set = new Set();
    normalizedServices.forEach((svc) => {
      if (svc.category) set.add(svc.category);
    });
    return Array.from(set);
  }, [normalizedServices]);

  // Filter kategori (client-side)
  const filteredServices = useMemo(() => {
    if (!selectedCategories.length) return normalizedServices;
    return normalizedServices.filter((svc) =>
      selectedCategories.includes(svc.category)
    );
  }, [normalizedServices, selectedCategories]);

  const totalResults = filteredServices.length;
  const totalPages =
    totalResults > 0 ? Math.ceil(totalResults / PAGE_SIZE) : 1;

  const pagedServices = useMemo(() => {
    const start = (page - 1) * PAGE_SIZE;
    return filteredServices.slice(start, start + PAGE_SIZE);
  }, [filteredServices, page]);

  useEffect(() => {
    if (page > totalPages) {
      setPage(1);
    }
  }, [page, totalPages]);

  const queryLabel = activeKeyword || keyword || "Semua Layanan";

  // ========================================
  // Render
  // ========================================
  return (
    <div className="min-h-screen bg-[#F7F8FA]">
      <Navbar />

      {/* Search input di bagian atas halaman */}
      <div className="border-b bg-white">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-4">
          <form
            onSubmit={handleSearchSubmit}
            className="flex w-full max-w-xl items-center gap-3 rounded-full border border-neutral-200 bg-[#F9FAFB] px-4 py-2 shadow-sm"
          >
            <i className="fas fa-search text-neutral-400" />
            <input
              type="text"
              value={keyword}
              onChange={(e) => setKeyword(e.target.value)}
              placeholder="Cari layanan (contoh: UI/UX Desainer Website)"
              className="w-full border-none bg-transparent text-sm text-neutral-800 outline-none placeholder:text-neutral-400"
            />
          </form>
        </div>
      </div>

      {/* Main content */}
      <main className="mx-auto flex max-w-7xl flex-col gap-8 px-4 py-8 lg:flex-row lg:py-10">
        {/* Sidebar Filter */}
        <SearchFilterSidebar
          categories={categories}
          selectedCategories={selectedCategories}
          onToggleCategory={handleToggleCategory}
          priceOptions={PRICE_OPTIONS}
          selectedPriceId={selectedPriceId}
          onChangePrice={handleChangePrice}
          minRating={minRating}
          onChangeRating={handleChangeRating}
          priceMin={priceMin}
          priceMax={priceMax}
          onChangePriceMin={handleChangePriceMin}
          onChangePriceMax={handleChangePriceMax}
          onApplyPriceFilter={handleApplyPriceFilter}
        />

        {/* Right side: hasil + cards */}
        <section className="flex-1">
          {/* Header hasil pencarian */}
          <div className="mb-4 flex flex-col gap-1">
            <p className="text-xs text-neutral-500">
              Hasil pencarian untuk:{" "}
              <span className="font-semibold text-[#111827]">
                {queryLabel}
              </span>
            </p>
            <p className="text-xs text-neutral-500">
              {totalResults} layanan ditemukan
            </p>
          </div>

          {/* Sort bar (chip & dropdown harga) */}
          <SearchSortBar
            sortBy={sortBy}
            onChangeSortTab={handleChangeSortTab}
            priceSort={priceSort}
            onChangePriceSort={handleChangePriceSort}
          />

          {/* Grid layanan */}
          <div className="mt-6">
            {isLoading ? (
              <div className="flex flex-col items-center rounded-2xl border border-neutral-200 bg-white py-12 text-center">
                <div className="mb-2 text-sm font-medium text-neutral-700">
                  Memuat layanan...
                </div>
                <div className="h-1.5 w-40 overflow-hidden rounded-full bg-neutral-100">
                  <div className="h-full w-1/2 animate-pulse rounded-full bg-neutral-300" />
                </div>
              </div>
            ) : isError ? (
              <div className="flex flex-col items-center rounded-2xl border border-dashed border-red-200 bg-white py-12 text-center">
                <div className="mb-1 text-base font-semibold text-red-600">
                  Terjadi kesalahan
                </div>
                <p className="max-w-sm text-sm text-neutral-600">
                  {error?.message ||
                    "Gagal memuat layanan. Coba beberapa saat lagi."}
                </p>
              </div>
            ) : pagedServices.length === 0 ? (
              <div className="flex flex-col items-center rounded-2xl border border-dashed border-neutral-200 bg-white py-16 text-center">
                <div className="mb-3 text-4xl">🔍</div>
                <p className="mb-1 text-base font-semibold text-neutral-900">
                  Layanan tidak ditemukan
                </p>
                <p className="max-w-sm text-sm text-neutral-600">
                  Coba gunakan kata kunci lain atau kurangi filter yang
                  diterapkan.
                </p>
              </div>
            ) : (
              <>
                {/* 3 kolom di desktop, sesuai Figma */}
                <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
                  {pagedServices.map((svc) => (
                    <SearchServiceCardItem
                      key={svc.id}
                      service={svc}
                      onClick={() => {
                        window.location.href = `/services/${svc.slug}`;
                      }}
                    />
                  ))}
                </div>

                <div className="mt-8 flex justify-center">
                  <Pagination
                    page={page}
                    totalPages={totalPages}
                    onChange={setPage}
                  />
                </div>
              </>
            )}
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
