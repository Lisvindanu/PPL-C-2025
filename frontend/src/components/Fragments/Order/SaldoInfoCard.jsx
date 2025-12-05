/**
 * SaldoInfoCard - Card untuk menampilkan info saldo di sidebar
 * Digunakan di halaman OrdersIncomingPage (kolom kanan)
 */
import Card from "../../Elements/Layout/Card";

// Helper: format currency
const formatRupiah = (num) => {
  return `Rp ${Number(num || 0).toLocaleString("id-ID")}`;
};

// Icon components
const SaldoIcon = () => (
  <svg className="w-5 h-5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
  </svg>
);

const LockIcon = () => (
  <svg className="w-5 h-5 text-orange-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
  </svg>
);

const InfoIcon = () => (
  <svg className="w-5 h-5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
  </svg>
);

/**
 * SaldoTersediaCard - Card saldo yang tersedia untuk ditarik
 */
export function SaldoTersediaCard({
  saldo = 0,
  minPenarikan = 50000,
  processingTime = "1-2 hari kerja",
  onTarikSaldo,
  className = "",
}) {
  return (
    <Card className={className}>
      <div className="flex items-center gap-3 mb-4">
        <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
          <SaldoIcon />
        </div>
        <div>
          <p className="text-sm text-gray-500">Saldo Tersedia</p>
          <p className="text-xl font-bold text-gray-900">{formatRupiah(saldo)}</p>
        </div>
      </div>

      <button
        onClick={onTarikSaldo}
        className="w-full bg-blue-500 hover:bg-blue-600 text-white font-medium py-2.5 px-4 rounded-lg transition-colors"
      >
        Tarik Saldo
      </button>

      <div className="mt-4 pt-4 border-t border-gray-100">
        <div className="flex justify-between text-sm">
          <span className="text-gray-500">Minimum Penarikan</span>
          <span className="text-gray-700">{formatRupiah(minPenarikan)}</span>
        </div>
        <div className="flex justify-between text-sm mt-2">
          <span className="text-gray-500">Processing Time</span>
          <span className="text-blue-600">{processingTime}</span>
        </div>
      </div>
    </Card>
  );
}

/**
 * DanaDitahanCard - Card dana yang masih ditahan
 */
export function DanaDitahanCard({
  totalDitahan = 0,
  inProgress = 0,
  pendingReview = 0,
  className = "",
}) {
  return (
    <Card className={className}>
      <div className="flex items-center gap-3 mb-4">
        <div className="w-10 h-10 bg-orange-100 rounded-full flex items-center justify-center">
          <LockIcon />
        </div>
        <div>
          <p className="text-sm text-gray-500">Dana ditahan</p>
          <p className="text-xl font-bold text-gray-900">{formatRupiah(totalDitahan)}</p>
        </div>
      </div>

      <div className="space-y-3">
        <div className="flex justify-between items-center">
          <span className="text-sm text-gray-600">In Progress</span>
          <span className="text-sm font-medium text-gray-900">{formatRupiah(inProgress)}</span>
        </div>
        <div className="flex justify-between items-center">
          <span className="text-sm text-gray-600">Pending Review</span>
          <span className="text-sm font-medium text-gray-900">{formatRupiah(pendingReview)}</span>
        </div>
      </div>
    </Card>
  );
}

/**
 * InfoPembayaranCard - Card informasi pembayaran
 */
export function InfoPembayaranCard({
  items = [
    "Dana ditahan escrow hingga approve",
    "Otomatis masuk saldo setelah approve",
    "Penarikan diproses 1x1",
  ],
  className = "",
}) {
  return (
    <Card className={`!bg-blue-50 !border-blue-200 ${className}`}>
      <div className="flex items-center gap-2 mb-3">
        <InfoIcon />
        <h3 className="font-semibold text-blue-900">Informasi Pembayaran</h3>
      </div>
      <ul className="space-y-2 text-sm text-blue-800">
        {items.map((item, index) => (
          <li key={index} className="flex items-start gap-2">
            <span className="text-blue-500 mt-0.5">•</span>
            <span>{item}</span>
          </li>
        ))}
      </ul>
    </Card>
  );
}

// Default export as combined component
export default {
  SaldoTersediaCard,
  DanaDitahanCard,
  InfoPembayaranCard,
};
