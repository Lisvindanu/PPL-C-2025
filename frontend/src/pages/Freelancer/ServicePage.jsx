import Navbar from "../../components/Fragments/Common/Navbar";
import DashboardHeaderBar from "../../components/Fragments/Dashboard/DashboardHeaderBar";
import AddServiceCallout from "../../components/Fragments/Service/AddServiceCallout";
import BlockListSection from "../../components/Fragments/Admin/BlockListSection";
import Footer from "../../components/Fragments/Common/Footer";

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
