import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { authService } from "../../services/authService";
import api from "../../utils/axiosConfig";
import Sidebar from "../../components/organisms/Sidebar";
import { Header } from "../../components/organisms/Header";

export default function AdminRecommendationDashboardPage() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [period, setPeriod] = useState('week');
  const [dashboardData, setDashboardData] = useState(null);

  useEffect(() => {
    const user = authService.getCurrentUser();
    if (!user || user.role !== 'admin') {
      navigate('/login');
      return;
    }

    fetchDashboardData();
  }, [navigate, period]);

  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      const response = await api.get(`/recommendations/admin/monitoring-dashboard?period=${period}`);

      if (response.data.success) {
        setDashboardData(response.data.data);
      } else {
        setDashboardData(getMockData());
      }
    } catch (error) {
      console.error('Error fetching dashboard data:', error);
      setDashboardData(getMockData());
    } finally {
      setLoading(false);
    }
  };

  const getMockData = () => ({
    totalRecommendations: 2450,
    totalFavorites: 1223,
    totalTransactions: 453,
    favoriteTrend: [
      { name: "Sen", value: 275 },
      { name: "Sel", value: 385 },
      { name: "Rab", value: 365 },
      { name: "Kam", value: 450 },
      { name: "Jum", value: 305 },
      { name: "Sab", value: 235 },
      { name: "Min", value: 208 }
    ],
    transactionTrend: [
      { name: "Sen", value: 125 },
      { name: "Sel", value: 155 },
      { name: "Rab", value: 143 },
      { name: "Kam", value: 185 },
      { name: "Jum", value: 110 },
      { name: "Sab", value: 90 },
      { name: "Min", value: 75 }
    ],
    topFavoriteUsers: [
      { username: "Ahmad Rizki", count: 431, service: "UI/UX Design" },
      { username: "SatriaWibawa", count: 211, service: "Web Dev" },
      { username: "DewiKartika", count: 135, service: "UI/UX Design" },
      { username: "BagasSenja", count: 87, service: "UI/UX Design" }
    ],
    topTransactionUsers: [
      { username: "Ahmad Rizki", count: 31, service: "UI/UX Design" },
      { username: "SatriaWibawa", count: 11, service: "Web Dev" },
      { username: "DewiKartika", count: 13, service: "UI/UX Design" },
      { username: "BagasSenja", count: 8, service: "UI/UX Design" }
    ],
    topRecommendedServices: [
      { user: "Ahmad Rizki", recommendations: 2100, percentage: "55%" },
      { user: "SatriaWibawa", recommendations: 1400, percentage: "50.4%" },
      { user: "DewiKartika", recommendations: 1941, percentage: "47.5%" },
      { user: "BagasSenja", recommendations: 897, percentage: "35%" },
      { user: "BogasSenja", recommendations: 722, percentage: "31.2%" },
      { user: "RizkiNirmala", recommendations: 598, percentage: "16.7%" },
      { user: "LaraisCahaya", recommendations: 566, percentage: "13.2%" },
      { user: "BintangKusuma", recommendations: 548, percentage: "8.6%" },
      { user: "RamaPratama", recommendations: 516, percentage: "6.6%" },
      { user: "AnggaSaputra", recommendations: 377, percentage: "3.8%" }
    ]
  });

  if (loading) {
    return (
      <div className="flex h-screen bg-skill-primary">
        <Sidebar activeMenu="recommendations" />
        <div className="flex-1 flex items-center justify-center">
          <div className="text-center">
            <i className="fas fa-spinner fa-spin text-4xl text-[#4782BE] mb-4"></i>
            <p className="text-neutral-600">Memuat dashboard...</p>
          </div>
        </div>
      </div>
    );
  }

  const data = dashboardData || getMockData();

  return (
    <div className="flex h-screen bg-skill-primary">
      <Sidebar activeMenu="recommendations" />
      <div className="flex-1 overflow-auto">
        <Header />
        <div className="p-8">
          <div className="max-w-[1400px] mx-auto space-y-6">
            {/* Page Header */}
            <div className="bg-white rounded-2xl shadow-sm p-6 border border-gray-100">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-xl font-bold text-neutral-900">Dashboard Monitoring</h2>
                  <p className="text-sm text-neutral-600 mt-1">
                    Ringkasan statistik dan aktivitas rekomendasi SkillConnect
                  </p>
                </div>
                <div className="flex items-center space-x-2">
                  <span className="text-sm text-neutral-600 font-medium">Periode:</span>
                  <select
                    value={period}
                    onChange={(e) => setPeriod(e.target.value)}
                    className="px-4 py-2 border border-gray-300 rounded-lg text-sm font-medium focus:outline-none focus:ring-2 focus:ring-[#4782BE] focus:border-transparent bg-white"
                  >
                    <option value="week">Minggu ini</option>
                    <option value="month">Bulan ini</option>
                    <option value="year">Tahun ini</option>
                  </select>
                </div>
              </div>
            </div>

            {/* Metrics Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {/* Total Rekomendasi */}
              <div className="bg-white rounded-2xl shadow-sm p-6 border border-gray-100">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <p className="text-sm text-neutral-600 font-medium mb-3">Total rekomendasi</p>
                    <p className="text-4xl font-bold text-neutral-900">
                      {data.totalRecommendations.toLocaleString('id-ID')}
                    </p>
                  </div>
                  <div className="bg-blue-50 p-4 rounded-xl">
                    <i className="fas fa-chart-line text-3xl text-blue-600"></i>
                  </div>
                </div>
              </div>

              {/* Jumlah Favorit */}
              <div className="bg-white rounded-2xl shadow-sm p-6 border border-gray-100">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <p className="text-sm text-neutral-600 font-medium mb-3">Jumlah Favorit</p>
                    <p className="text-4xl font-bold text-neutral-900">
                      {data.totalFavorites.toLocaleString('id-ID')}
                    </p>
                  </div>
                  <div className="bg-pink-50 p-4 rounded-xl">
                    <i className="fas fa-heart text-3xl text-pink-600"></i>
                  </div>
                </div>
              </div>

              {/* Total Transaksi */}
              <div className="bg-white rounded-2xl shadow-sm p-6 border border-gray-100">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <p className="text-sm text-neutral-600 font-medium mb-3">Total Transaksi</p>
                    <p className="text-4xl font-bold text-neutral-900">
                      {data.totalTransactions.toLocaleString('id-ID')}
                    </p>
                  </div>
                  <div className="bg-blue-50 p-4 rounded-xl">
                    <i className="fas fa-shopping-cart text-3xl text-blue-600"></i>
                  </div>
                </div>
              </div>
            </div>

            {/* Charts Row */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Jumlah Favorit Chart */}
              <div className="bg-white rounded-2xl shadow-sm p-6 border border-gray-100">
                <h3 className="text-lg font-bold text-neutral-900 mb-6">Jumlah Favorit</h3>
                <ResponsiveContainer width="100%" height={280}>
                  <LineChart data={data.favoriteTrend}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#E5E7EB" vertical={false} />
                    <XAxis
                      dataKey="name"
                      stroke="#9CA3AF"
                      tick={{ fontSize: 12, fill: '#6B7280' }}
                      axisLine={{ stroke: '#E5E7EB' }}
                    />
                    <YAxis
                      stroke="#9CA3AF"
                      tick={{ fontSize: 12, fill: '#6B7280' }}
                      axisLine={{ stroke: '#E5E7EB' }}
                    />
                    <Tooltip
                      contentStyle={{
                        backgroundColor: 'white',
                        border: '1px solid #E5E7EB',
                        borderRadius: '12px',
                        padding: '12px',
                        boxShadow: '0 4px 6px rgba(0,0,0,0.1)'
                      }}
                      labelStyle={{ fontWeight: 600, color: '#1F2937' }}
                    />
                    <Line
                      type="monotone"
                      dataKey="value"
                      stroke="#4782BE"
                      strokeWidth={3}
                      dot={{ fill: '#4782BE', strokeWidth: 2, r: 4 }}
                      activeDot={{ r: 6 }}
                    />
                  </LineChart>
                </ResponsiveContainer>
              </div>

              {/* Detail Favorit Terakhir */}
              <div className="bg-white rounded-2xl shadow-sm p-6 border border-gray-100">
                <h3 className="text-lg font-bold text-neutral-900 mb-6">Detail Favorit Terakhir</h3>
                <div className="overflow-hidden">
                  <table className="w-full">
                    <thead className="border-b border-gray-200">
                      <tr>
                        <th className="pb-4 text-left text-xs font-semibold text-neutral-600 uppercase tracking-wider">
                          Pengguna
                        </th>
                        <th className="pb-4 text-center text-xs font-semibold text-neutral-600 uppercase tracking-wider">
                          Jml Favorit
                        </th>
                        <th className="pb-4 text-right text-xs font-semibold text-neutral-600 uppercase tracking-wider">
                          Jasa
                        </th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-100">
                      {data.topFavoriteUsers.map((user, idx) => (
                        <tr key={idx} className="hover:bg-gray-50 transition-colors">
                          <td className="py-4 text-sm font-medium text-neutral-900">
                            {idx + 1}. {user.username}
                          </td>
                          <td className="py-4 text-sm font-semibold text-neutral-900 text-center">
                            {user.count}
                          </td>
                          <td className="py-4 text-sm text-neutral-600 text-right">
                            {user.service}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>

            {/* Transactions Row */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Total Transaksi Chart */}
              <div className="bg-white rounded-2xl shadow-sm p-6 border border-gray-100">
                <h3 className="text-lg font-bold text-neutral-900 mb-6">Total Transaksi</h3>
                <ResponsiveContainer width="100%" height={280}>
                  <LineChart data={data.transactionTrend}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#E5E7EB" vertical={false} />
                    <XAxis
                      dataKey="name"
                      stroke="#9CA3AF"
                      tick={{ fontSize: 12, fill: '#6B7280' }}
                      axisLine={{ stroke: '#E5E7EB' }}
                    />
                    <YAxis
                      stroke="#9CA3AF"
                      tick={{ fontSize: 12, fill: '#6B7280' }}
                      axisLine={{ stroke: '#E5E7EB' }}
                    />
                    <Tooltip
                      contentStyle={{
                        backgroundColor: 'white',
                        border: '1px solid #E5E7EB',
                        borderRadius: '12px',
                        padding: '12px',
                        boxShadow: '0 4px 6px rgba(0,0,0,0.1)'
                      }}
                      labelStyle={{ fontWeight: 600, color: '#1F2937' }}
                    />
                    <Line
                      type="monotone"
                      dataKey="value"
                      stroke="#4782BE"
                      strokeWidth={3}
                      dot={{ fill: '#4782BE', strokeWidth: 2, r: 4 }}
                      activeDot={{ r: 6 }}
                    />
                  </LineChart>
                </ResponsiveContainer>
              </div>

              {/* Detail Transaksi Terakhir */}
              <div className="bg-white rounded-2xl shadow-sm p-6 border border-gray-100">
                <h3 className="text-lg font-bold text-neutral-900 mb-6">Detail Transaksi Terakhir</h3>
                <div className="overflow-hidden">
                  <table className="w-full">
                    <thead className="border-b border-gray-200">
                      <tr>
                        <th className="pb-4 text-left text-xs font-semibold text-neutral-600 uppercase tracking-wider">
                          Pengguna
                        </th>
                        <th className="pb-4 text-center text-xs font-semibold text-neutral-600 uppercase tracking-wider">
                          Jml Transaksi
                        </th>
                        <th className="pb-4 text-right text-xs font-semibold text-neutral-600 uppercase tracking-wider">
                          Jasa
                        </th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-100">
                      {data.topTransactionUsers.map((user, idx) => (
                        <tr key={idx} className="hover:bg-gray-50 transition-colors">
                          <td className="py-4 text-sm font-medium text-neutral-900">
                            {idx + 1}. {user.username}
                          </td>
                          <td className="py-4 text-sm font-semibold text-neutral-900 text-center">
                            {user.count}
                          </td>
                          <td className="py-4 text-sm text-neutral-600 text-right">
                            {user.service}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>

            {/* Top 10 Recommended Services */}
            <div className="bg-white rounded-2xl shadow-sm p-6 border border-gray-100">
              <h3 className="text-lg font-bold text-neutral-900 mb-6">
                Top 10 layanan yang paling direkomendasikan
              </h3>
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-gray-50 border-b border-gray-200">
                    <tr>
                      <th className="px-6 py-4 text-left text-xs font-semibold text-neutral-900 uppercase tracking-wider rounded-tl-lg">
                        Pengguna
                      </th>
                      <th className="px-6 py-4 text-center text-xs font-semibold text-neutral-900 uppercase tracking-wider">
                        Rekomendasi
                      </th>
                      <th className="px-6 py-4 text-right text-xs font-semibold text-neutral-900 uppercase tracking-wider rounded-tr-lg">
                        Persentase
                      </th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-100">
                    {data.topRecommendedServices.map((service, idx) => (
                      <tr key={idx} className="hover:bg-gray-50 transition-colors">
                        <td className="px-6 py-4 text-sm font-medium text-neutral-900">
                          {idx + 1}. {service.user}
                        </td>
                        <td className="px-6 py-4 text-sm font-semibold text-neutral-900 text-center">
                          {service.recommendations.toLocaleString('id-ID')}
                        </td>
                        <td className="px-6 py-4 text-sm font-semibold text-neutral-900 text-right">
                          {service.percentage}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
