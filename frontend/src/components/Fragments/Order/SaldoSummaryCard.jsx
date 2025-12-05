/**
 * SaldoSummaryCard - Summary card untuk menampilkan saldo/uang
 * Digunakan di halaman OrdersIncomingPage untuk summary cards di atas
 */

// Helper: format currency
const formatRupiah = (num) => {
  return `Rp ${Number(num || 0).toLocaleString("id-ID")}`;
};

export default function SaldoSummaryCard({
  title,
  value,
  icon,
  variant = "primary", // primary (green), secondary (blue)
  className = "",
}) {
  const variants = {
    primary: "bg-emerald-500",
    secondary: "bg-sky-500",
    success: "bg-green-500",
    warning: "bg-orange-500",
    info: "bg-blue-500",
  };

  const bgColor = variants[variant] || variants.primary;

  return (
    <div className={`${bgColor} rounded-xl p-5 text-white ${className}`}>
      <div className="flex items-center gap-3">
        <div className="w-10 h-10 bg-white/20 rounded-lg flex items-center justify-center">
          {icon}
        </div>
        <div>
          <p className="text-white/80 text-sm">{title}</p>
          <p className="text-2xl font-bold">{formatRupiah(value)}</p>
        </div>
      </div>
    </div>
  );
}

// Icon presets yang bisa dipakai
export const SaldoIcon = () => (
  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
  </svg>
);

export const TransferIcon = () => (
  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 9V7a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2m2 4h10a2 2 0 002-2v-6a2 2 0 00-2-2H9a2 2 0 00-2 2v6a2 2 0 002 2zm7-5a2 2 0 11-4 0 2 2 0 014 0z" />
  </svg>
);
