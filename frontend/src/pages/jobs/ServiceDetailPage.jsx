import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { serviceService } from "../../services/serviceService";
import Navbar from "../../components/organisms/Navbar";
import Chip from "../../components/atoms/Chip";
import ServiceHeaderCard from "../../components/molecules/ServiceHeaderCard";
import ServiceTabs from "../../components/molecules/ServiceTabs";
import OrderCard from "../../components/molecules/OrderCard";
import InteractionBar from "../../components/molecules/InteractionBar";
import ReviewsSection from "../../components/organisms/ReviewsSection";
import PortfolioGrid from "../../components/molecules/PortfolioGrid";
import AboutFreelancerCard from "../../components/molecules/AboutFreelancerCard";
import Footer from "../../components/organisms/Footer";

// Helper function to map backend service data to frontend format
const mapServiceToFrontend = (backendService) => {
  // Format waktu pengerjaan (number of days)
  const formatWaktuPengerjaan = (days) => {
    if (!days) return '1–3 Minggu'
    if (typeof days === 'number') {
      if (days === 1) return '1 hari'
      if (days <= 7) return `${days} hari`
      if (days <= 14) return '1–2 Minggu'
      if (days <= 30) return `${Math.ceil(days / 7)} Minggu`
      return `${Math.ceil(days / 30)} Bulan`
    }
    return days
  }

  // Format batas revisi
  const formatBatasRevisi = (revisi) => {
    if (!revisi) return '3x revisi besar'
    if (typeof revisi === 'number') {
      return `${revisi}x revisi besar`
    }
    return revisi
  }

  return {
    id: backendService.id,
    title: backendService.judul || backendService.title || '',
    slug: backendService.slug || '',
    description: backendService.deskripsi || '',
    price: backendService.harga || backendService.price || 0,
    category: backendService.kategori?.nama_kategori || backendService.category || 'Lainnya',
    categorySlug: backendService.kategori?.slug || '',
    freelancer: {
      id: backendService.freelancer?.id || '',
      name: backendService.freelancer?.nama_lengkap || backendService.freelancer || 'Freelancer',
      avatar: backendService.freelancer?.avatar || 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=80&q=80',
      role: backendService.kategori?.nama_kategori || 'Freelancer',
      about: backendService.freelancer?.bio || 'Freelancer profesional',
      projectCompleted: backendService.total_pesanan || 0
    },
    rating: backendService.rating_rata_rata || backendService.rating || 0,
    reviewCount: backendService.jumlah_rating || backendService.jumlah_review || backendService.reviews || 0,
    completed: backendService.total_pesanan || backendService.orders || 0,
    waktu_pengerjaan: formatWaktuPengerjaan(backendService.waktu_pengerjaan),
    batas_revisi: formatBatasRevisi(backendService.batas_revisi),
    thumbnail: backendService.thumbnail || '/asset/layanan/Layanan.png',
    gambar: backendService.gambar || [],
    features: backendService.features || []
  }
}

export default function ServiceDetailPage() {
  const { id, slug } = useParams(); // Support both id and slug
  const navigate = useNavigate();
  const [serviceData, setServiceData] = useState(null);
  
  // Determine which parameter to use (id takes priority)
  const serviceIdentifier = id || slug;

  // ----- dummy data (fallback) -----
  const dummyCategories = ["Desain Logo", "Cara Penggunaan", "Tentang SkillConnect"];
  const dummyHeader = {
    avatar:
      "https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=80&q=80",
    name: "Natashia Bunny",
    rating: 4.9,
    reviewCount: 45,
    images: [
      "https://images.unsplash.com/photo-1526948128573-703ee1aeb6fa?w=1200&q=80",
      "https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?w=1200&q=80",
    ],
  };
  const dummyDetail = {
    title: "Modern Logo Design Four Bussiness",
    description:
      "Layanan pembuatan logo modern yang kuat, bersih, dan mudah diingat. Cocok untuk brand baru maupun rebranding. Output termasuk logo utama, varian, panduan penggunaan singkat, serta file sumber siap pakai.",
    features: [
      "3 konsep awal",
      "3x revisi besar + 5x revisi kecil",
      "File final (AI, EPS, SVG, PNG)",
      "Mini brand guideline (PDF)",
      "Waktu pengerjaan 1–3 minggu",
    ],
  };
  const dummyOrder = {
    price: 3500000,
    rating: 4.9,
    reviewCount: 45,
    completed: 107,
    waktu_pengerjaan: "1–3 Minggu",
    batas_revisi: "3x revisi besar",
  };
  const dummyReviews = [
    {
      rating: 5,
      title: "Amazing services",
      content:
        "Desainer ramah dan responsif. Hasil akhir sesuai ekspektasi, bahkan lebih baik. Akan repeat order untuk brand berikutnya.",
      avatar: "https://i.pravatar.cc/80?img=12",
      name: "Marco Khan",
    },
    {
      rating: 5,
      title: "Awesome, thank you!",
      content:
        "Proses cepat dan rapi. Mockup presentasi memudahkan stakeholder menyetujui desain.",
      avatar: "https://i.pravatar.cc/80?img=5",
      name: "Zoe Clements",
    },
    {
      rating: 5,
      title: "Everything simple",
      content: "Brief diolah dengan tepat, komunikasi enak. Recommended!",
      avatar: "https://i.pravatar.cc/80?img=31",
      name: "Kristin Hester",
    },
  ];
  const dummyPortfolio = [
    "https://images.unsplash.com/photo-1545235617-9465d2a55698?w=1200&q=80",
    "https://images.unsplash.com/photo-1515879218367-8466d910aaa4?w=1200&q=80",
    "https://images.unsplash.com/photo-1523475496153-3d6ccf0c5d55?w=1200&q=80",
  ];
  const dummyFreelancer = {
    avatar:
      "https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=80&q=80",
    name: "Natashia Bunny",
    role: "UI/UX Designer",
    about:
      "I'm a passionate brand identity designer with over 8+ years of experience helping businesses stand out.",
    projectCompleted: 250,
  };

  // Fetch service data from API
  useEffect(() => {
    // Skip fetch if no identifier
    if (!serviceIdentifier) {
      console.log('[ServiceDetailPage] No service identifier (id/slug), using dummy data');
      return;
    }

    let cancelled = false;
    
    const fetchService = async () => {
      try {
        // Check if identifier is UUID (ID) or slug
        const isUUID = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(serviceIdentifier);
        
        let result;
        if (isUUID) {
          // If it's a UUID, fetch by ID
          if (import.meta.env.DEV) {
            console.log('[ServiceDetailPage] Fetching service by ID:', serviceIdentifier);
          }
          result = await serviceService.getServiceById(serviceIdentifier);
        } else {
          // If it's not a UUID, fetch by slug
          if (import.meta.env.DEV) {
            console.log('[ServiceDetailPage] Fetching service by slug:', serviceIdentifier);
          }
          result = await serviceService.getServiceBySlug(serviceIdentifier);
        }
        
        if (cancelled) return;
        
        if (result.success && result.service) {
          const mappedService = mapServiceToFrontend(result.service);
          setServiceData(mappedService);
          if (import.meta.env.DEV) {
            console.log('[ServiceDetailPage] Service data loaded from API:', mappedService);
          }
        } else {
          if (import.meta.env.DEV) {
            console.log('[ServiceDetailPage] Service not found, using dummy data');
          }
        }
        // If API fails or returns no data, keep using dummy data (no error state)
      } catch (err) {
        if (cancelled) return;
        console.error('[ServiceDetailPage] Error fetching service:', err);
        // Keep using dummy data on error
      }
    };

    fetchService();

    return () => {
      cancelled = true;
    };
  }, [serviceIdentifier]);

  // Use API data if available, otherwise use dummy data
  const categories = serviceData 
    ? [serviceData.category, "Cara Penggunaan", "Tentang SkillConnect"]
    : dummyCategories;
  
  const header = serviceData ? {
    avatar: serviceData.freelancer.avatar,
    name: serviceData.freelancer.name,
    rating: serviceData.rating,
    reviewCount: serviceData.reviewCount,
    images: serviceData.gambar.length > 0 
      ? serviceData.gambar 
      : [serviceData.thumbnail || '/asset/layanan/Layanan.png'],
  } : dummyHeader;
  
  const detail = serviceData ? {
    title: serviceData.title,
    description: serviceData.description || dummyDetail.description,
    features: serviceData.features.length > 0 
      ? serviceData.features 
      : dummyDetail.features,
  } : dummyDetail;
  
  const order = serviceData ? {
    price: serviceData.price,
    rating: serviceData.rating,
    reviewCount: serviceData.reviewCount,
    completed: serviceData.completed,
    waktu_pengerjaan: serviceData.waktu_pengerjaan,
    batas_revisi: serviceData.batas_revisi,
  } : dummyOrder;
  
  const reviews = dummyReviews; // Keep using dummy reviews for now
  
  const portfolio = serviceData 
    ? (serviceData.gambar.length > 0 
        ? serviceData.gambar 
        : [serviceData.thumbnail || '/asset/layanan/Layanan.png'])
    : dummyPortfolio;
  
  const freelancer = serviceData ? {
    avatar: serviceData.freelancer.avatar,
    name: serviceData.freelancer.name,
    role: serviceData.freelancer.role,
    about: serviceData.freelancer.about,
    projectCompleted: serviceData.freelancer.projectCompleted,
  } : dummyFreelancer;

  function orderNow() {
    navigate(`/checkout/${serviceData?.slug || serviceData?.id || serviceIdentifier || slug}`);
  }
  function contact() {
    navigate(`/messages/new?to=${encodeURIComponent(freelancer.name)}`);
  }

  return (
    <div className="min-h-screen bg-[#F7F8FA]">
      <Navbar />

      <main className="mx-auto max-w-7xl px-4 py-4 md:py-6">
        {/* Kategori */}
        <div className="flex flex-wrap gap-2">
          {categories.map((c, i) => (
            <Chip key={i}>{c}</Chip>
          ))}
        </div>

        {/* Title */}
        <h1 className="mt-3 text-xl sm:text-2xl font-semibold text-neutral-900">
          {detail.title}
        </h1>

        {/* Grid utama: kiri (2 kolom), kanan (1 kolom) */}
        <div className="mt-3 grid grid-cols-1 lg:grid-cols-3 gap-4">
          {/* KIRI */}
          <div className="lg:col-span-2 space-y-4">
            <ServiceHeaderCard {...header} />

            {/* Tabs Deskripsi/Fitur */}
            <ServiceTabs
              description={detail.description}
              features={detail.features}
            />

            {/* Portfolio */}
            <section>
              <PortfolioGrid items={portfolio} />
            </section>

            {/* About Freelancer */}
            <section>
              <h3 className="mb-3 text-sm font-semibold">
                About the Freelancer
              </h3>
              <AboutFreelancerCard
                {...freelancer}
                onViewProfile={() =>
                  navigate(`/profile/${encodeURIComponent(freelancer.name)}`)
                }
              />
            </section>
          </div>

          {/* KANAN  */}
          <div className="lg:col-span-1 space-y-3">
            <OrderCard {...order} onOrder={orderNow} onContact={contact} />
            <InteractionBar />
            <ReviewsSection items={reviews.slice(0, 3)} />
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}
