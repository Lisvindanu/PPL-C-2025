import Breadcrumb from "../../Elements/Layout/Breadcrumb";
import DashboardSubnav from "./DashboardSubnav";

export default function DashboardHeaderBar({
  title = "Freelancer",
  subPage = "Service Page",
  active = "produk",
}) {
  return (
    <div className="w-full bg-white border-b border-neutral-200">
      <div className="mx-auto max-w-7xl px-4">
        {/* Row 1: Title */}
        <div className="pt-3">
          <h1 className="text-xl font-semibold text-neutral-900">{title}</h1>
        </div>

        {/* Row 2: Breadcrumb + Subnav */}
        <div className="py-3 md:py-4">
          <div className="flex flex-col gap-2 md:grid md:grid-cols-[1fr_auto_1fr] md:items-center">
            {/* Breadcrumb kiri */}
            <div className="justify-self-start">
              <Breadcrumb
                items={[
                  { label: "Dashboard", href: "/freelance/dashboard" },
                  { label: subPage },
                ]}
              />
            </div>

            {/* Subnav center */}
            <div className="justify-self-center">
              <DashboardSubnav active={active} />
            </div>

            {/* Spacer kanan (untuk grid center) */}
            <div aria-hidden className="hidden md:block justify-self-end" />
          </div>
        </div>
      </div>
    </div>
  );
}
