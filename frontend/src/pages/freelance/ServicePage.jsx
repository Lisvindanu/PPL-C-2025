import Navbar from "../../components/organisms/Navbar";
import DashboardHeaderBar from "../../components/molecules/DashboardHeaderBar";
import AddServiceCallout from "../../components/molecules/AddServiceCallout";
import BlockListSection from "../../components/molecules/BlockListSection";
import Footer from "../../components/organisms/Footer";

export default function ServicePage() {
  return (
    <div className="min-h-screen bg-[#F7F8FA]">
      <Navbar />
      <DashboardHeaderBar
        title="Freelancer"
        subPage="Service Page"
        active="produk"
      />

      {/* Konten bawah */}
      <div className="mt-2">
        <AddServiceCallout />
      </div>
      <BlockListSection />
      <Footer />
    </div>
  );
}
