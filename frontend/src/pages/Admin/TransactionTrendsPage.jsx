import React, { useState, useEffect, useMemo } from 'react';
import { Sidebar } from '../../components/organisms/Sidebar';
import { Header } from '../../components/organisms/Header';
import { adminService } from '../../services/adminService';
import TransactionTrendsContent from '../../components/organisms/TransactionTrendsContent';

export default function TransactionTrendsPage() {
  const [orderData, setOrderData] = useState([]);
  const [revenueData, setRevenueData] = useState([]);
  const [categoryData, setCategoryData] = useState([]);
  const [categoryDataByTime, setCategoryDataByTime] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedMonth, setSelectedMonth] = useState(new Date().getMonth() + 1);
  const [selectedYear, setSelectedYear] = useState(new Date().getFullYear());

  const months = [
    { value: 1, label: 'Januari' },
    { value: 2, label: 'Februari' },
    { value: 3, label: 'Maret' },
    { value: 4, label: 'April' },
    { value: 5, label: 'Mei' },
    { value: 6, label: 'Juni' },
    { value: 7, label: 'Juli' },
    { value: 8, label: 'Agustus' },
    { value: 9, label: 'September' },
    { value: 10, label: 'Oktober' },
    { value: 11, label: 'November' },
    { value: 12, label: 'Desember' }
  ];

  // Generate years (last 5 years + current year)
  const years = useMemo(() => {
    const currentYear = new Date().getFullYear();
    return Array.from({ length: 6 }, (_, i) => currentYear - i);
  }, []);

  useEffect(() => {
    fetchData();
  }, [selectedMonth, selectedYear]);

  const fetchData = async () => {
    try {
      setLoading(true);
      setError(null);

      // Fetch order trends from API
      const orderResponse = await adminService.getOrderTrends({
        month: selectedMonth,
        year: selectedYear
      });

      // Fetch revenue trends from API
      const revenueResponse = await adminService.getRevenueAnalytics({
        month: selectedMonth,
        year: selectedYear
      });

      // Fetch category trends from API
      const categoryResponse = await adminService.getOrderCategoryTrends({
        month: selectedMonth,
        year: selectedYear
      });

      // Fetch category trends by time from API
      const categoryByTimeResponse = await adminService.getOrderCategoryTrendsByTime({
        month: selectedMonth,
        year: selectedYear
      });

      if (orderResponse.success) {
        setOrderData(orderResponse.data || []);
      } else {
        setOrderData([]);
      }

      if (revenueResponse.success) {
        setRevenueData(revenueResponse.data || []);
      } else {
        setRevenueData([]);
      }

      if (categoryResponse.success) {
        setCategoryData(categoryResponse.data || []);
      } else {
        setCategoryData([]);
      }

      if (categoryByTimeResponse.success) {
        setCategoryDataByTime(categoryByTimeResponse.data || []);
      } else {
        setCategoryDataByTime([]);
      }

      setLoading(false);
    } catch (err) {
      console.error('Error fetching transaction trends:', err);
      setError(err.message || 'Terjadi kesalahan saat memuat data tren transaksi.');
      setLoading(false);
    }
  };

  return (
    <div className="flex h-screen bg-[#DBE2EF]">
      <Sidebar activeMenu="transaction-trends" />
      <div className="flex-1 flex flex-col overflow-hidden">
        <Header />
        <div className="flex-1 overflow-y-auto p-6">
          <TransactionTrendsContent
            orderData={orderData}
            revenueData={revenueData}
            categoryData={categoryData}
            categoryDataByTime={categoryDataByTime}
            selectedMonth={selectedMonth}
            selectedYear={selectedYear}
            onMonthChange={setSelectedMonth}
            onYearChange={setSelectedYear}
            months={months}
            years={years}
            loading={loading}
            error={error}
            onRetry={fetchData}
          />
        </div>
      </div>
    </div>
  );
}

