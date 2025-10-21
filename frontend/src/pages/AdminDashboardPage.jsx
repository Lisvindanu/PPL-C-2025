import React, { useState, useEffect } from 'react';
import { User, ShoppingCart, DollarSign, CheckCircle } from 'lucide-react';
import { DashboardLayout } from '../components/templates/DashboardLayout';
import { adminService } from '../services/adminService';

export default function AdminDashboardPage() {
  const [stats, setStats] = useState([]);
  const [userData, setUserData] = useState([]);
  const [orderData, setOrderData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      setError(null);

      // Fetch dashboard stats
      const dashboardResponse = await adminService.getDashboard({ timeRange: 'today' });
      
      if (!dashboardResponse.success) {
        throw new Error(dashboardResponse.message || 'Failed to fetch dashboard data');
      }

      const apiData = dashboardResponse.data;
      
      // Transform API data ke format stats cards 
      const transformedStats = [
        {
          title: "Total Pengguna",
          value: apiData.totalUsers?.toLocaleString('id-ID') || "0",
          icon: <User size={20} />,
          bgColor: "bg-skill-primary"
        },
        {
          title: "Total Pesanan",
          value: apiData.totalOrders?.toLocaleString('id-ID') || "0",
          icon: <ShoppingCart size={20} />,
          bgColor: "bg-skill-tertiary"
        },
        {
          title: "Pesanan Selesai",
          value: `${apiData.completedOrders?.toLocaleString('id-ID') || "0"} (${apiData.completionRate || "0%"})`,
          icon: <CheckCircle size={20} />,
          bgColor: "bg-skill-primary"
        },
        {
          title: "Total Pendapatan",
          value: `Rp ${parseFloat(apiData.totalRevenue || 0).toLocaleString('id-ID')}`,
          icon: <DollarSign size={20} />,
          bgColor: "bg-skill-tertiary"
        }
      ];

      setStats(transformedStats);

      // Fetch user analytics
      await fetchUserAnalytics();
      
      // Fetch order analytics
      await fetchOrderAnalytics();
      
      setLoading(false);
    } catch (err) {
      console.error('Error fetching dashboard data:', err);
      setError(err.message || 'Terjadi kesalahan saat memuat data dashboard.');
      setLoading(false);
    }
  };

  const fetchUserAnalytics = async () => {
    try {
      const response = await adminService.getUserStatusDistribution();
      
      if (response.success && response.data) {
        setUserData(response.data);
      } else {
        setUserData([]);
      }
    } catch (error) {
      console.error('Error fetching user analytics:', error);
      setUserData([]);
    }
  };

  const fetchOrderAnalytics = async () => {
    try {
      const response = await adminService.getOrderTrends();
      
      if (response.success && response.data) {
        setOrderData(response.data);
      } else {
        setOrderData([]);
      }
    } catch (error) {
      console.error('Error fetching order analytics:', error);
      setOrderData([]);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen bg-skill-bg">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-skill-primary border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600">Memuat dashboard...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center h-screen bg-skill-bg">
        <div className="text-center max-w-md">
          <div className="bg-red-100 border border-red-400 text-red-700 px-6 py-4 rounded-lg mb-4">
            <p className="font-bold text-lg mb-2">Terjadi Kesalahan</p>
            <p className="text-sm">{error}</p>
          </div>
          <button 
            onClick={fetchDashboardData}
            className="bg-skill-primary text-white px-6 py-2 rounded-lg hover:bg-opacity-90 transition-all"
          >
            Coba Lagi
          </button>
        </div>
      </div>
    );
  }

  return (
    <DashboardLayout 
      stats={stats}
      userData={userData}
      orderData={orderData}
      activeMenu="dashboard"
    />
  );
}