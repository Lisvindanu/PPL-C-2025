import { useParams, useNavigate } from "react-router-dom";
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
// integrasi mock by slug:
// import { getMockServiceBySlug } from "../../mock/services";

export default function ServiceDetailPage() {
  const { slug } = useParams();
  const navigate = useNavigate();

  // ----- dummy -----
  const categories = ["Desain Logo", "Cara Penggunaan", "Tentang SkillConnect"];
  const header = {
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
  const detail = {
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
  const order = {
    price: 3500000,
    rating: 4.9,
    reviewCount: 45,
    completed: 107,
    waktu_pengerjaan: "1–3 Minggu",
    batas_revisi: "3x revisi besar",
  };
  const reviews = [
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
  const portfolio = [
    "https://images.unsplash.com/photo-1545235617-9465d2a55698?w=1200&q=80",
    "https://images.unsplash.com/photo-1515879218367-8466d910aaa4?w=1200&q=80",
    "https://images.unsplash.com/photo-1523475496153-3d6ccf0c5d55?w=1200&q=80",
  ];
  const freelancer = {
    avatar:
      "https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=80&q=80",
    name: "Natashia Bunny",
    role: "UI/UX Designer",
    about:
      "I’m a passionate brand identity designer with over 8+ years of experience helping businesses stand out.",
    projectCompleted: 250,
  };

  function orderNow() {
    navigate(`/checkout/${slug}`);
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
