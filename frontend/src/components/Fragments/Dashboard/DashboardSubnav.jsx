import { useNavigate } from "react-router-dom";
import Icon from "../../Elements/Icons/Icon";

const ITEMS = [
  {
    key: "dashboard",
    label: "Dashboard",
    icon: "home",
    to: "/freelance/orders",
  },
  { key: "produk", label: "Produk", icon: "box", to: "/freelance/service" },
  {
    key: "analisis",
    label: "Analisis",
    icon: "chart",
    to: "/analytics/earnings",
  },
  {
    key: "settings",
    label: "Settings",
    icon: "settings",
    to: "/profile/edit",
  },
];

export default function DashboardSubnav({ active = "produk" }) {
  const navigate = useNavigate();

  return (
    <div
      className="
        relative
        max-w-full
      "
    >
      <div className="pointer-events-none absolute inset-y-0 left-0 w-4 bg-gradient-to-r from-white to-transparent md:hidden" />
      <div className="pointer-events-none absolute inset-y-0 right-0 w-4 bg-gradient-to-l from-white to-transparent md:hidden" />

      <div
        className="
          flex
          overflow-x-auto
          no-scrollbar
          md:overflow-visible
        "
        role="tablist"
        aria-label="Navigasi Dashboard"
      >
        <div
          className="
            mx-auto
            flex items-center gap-2
            px-1 md:px-0
            py-1
            md:justify-center
          "
        >
          {ITEMS.map((item) => {
            const isActive = active === item.key;
            return (
              <button
                key={item.key}
                type="button"
                onClick={() => navigate(item.to)}
                className={`inline-flex items-center gap-2 rounded-full border px-4 py-2 text-sm transition
                  ${
                    isActive
                      ? "border-neutral-300 bg-neutral-100 text-[#1F5EFF]"
                      : "border-transparent text-black hover:border-neutral-200 hover:bg-neutral-50"
                  }`}
                aria-current={isActive ? "page" : undefined}
              >
                <Icon name={item.icon} size="sm" />
                <span className="whitespace-nowrap">{item.label}</span>
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
}
