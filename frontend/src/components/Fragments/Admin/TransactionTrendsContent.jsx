import React, { useMemo } from 'react';
import FilterForm from './FilterForm';
import TransactionChart from './TransactionChart';
import SummaryCard from '../Order/SummaryCard';
import CategoryTrendsTable from './CategoryTrendsTable';

export default function TransactionTrendsContent({
  orderData = [],
  revenueData = [],
  categoryData = [],
  categoryDataByTime = [],
  selectedMonth,
  selectedYear,
  onMonthChange,
  onYearChange,
  months = [],
  years = [],
  loading = false,
  error = null,
  onRetry
}) {
  // Combine order and revenue data for chart
  const chartData = useMemo(() => {
    if (!orderData.length && !revenueData.length) return [];

    const isDaily = selectedMonth && selectedYear;
    const maxLength = Math.max(orderData.length, revenueData.length);
    const combined = [];

    for (let i = 0; i < maxLength; i++) {
      const orderItem = orderData[i] || { month: isDaily ? `${i + 1}` : '', orders: 0 };
      const revenueItem = revenueData[i] || { month: isDaily ? `${i + 1}` : '', amount: 0 };

      // Ensure orders is a number
      const ordersValue = orderItem.orders !== undefined && orderItem.orders !== null 
        ? parseInt(orderItem.orders) 
        : 0;

      combined.push({
        label: orderItem.month || revenueItem.month || `${i + 1}`,
        orders: ordersValue,
        revenue: parseFloat(revenueItem.amount) || 0
      });
    }

    return combined;
  }, [orderData, revenueData, selectedMonth, selectedYear]);

  const formatCurrency = (value) => {
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      minimumFractionDigits: 0
    }).format(value);
  };

  const monthLabel = months.find(m => m.value === selectedMonth)?.label || '';
  
  // Calculate total orders - from chartData or from categoryData
  const totalOrders = useMemo(() => {
    // First try from chartData
    const fromChartData = chartData.reduce((sum, item) => {
      const orders = parseInt(item.orders) || 0;
      return sum + orders;
    }, 0);
    
    // If chartData has orders, use it
    if (fromChartData > 0) return fromChartData;
    
    // Otherwise, calculate from categoryData (aggregated totals)
    if (categoryData && categoryData.length > 0) {
      const fromCategoryData = categoryData.reduce((sum, item) => {
        const orders = parseInt(item.orders) || 0;
        return sum + orders;
      }, 0);
      return fromCategoryData;
    }
    
    // Last resort: calculate from categoryDataByTime (time series)
    if (categoryDataByTime && categoryDataByTime.length > 0) {
      const categoryTotals = {};
      categoryDataByTime.forEach(item => {
        const catName = item.kategori_nama;
        const orders = parseInt(item.orders) || 0;
        if (!categoryTotals[catName]) {
          categoryTotals[catName] = 0;
        }
        categoryTotals[catName] += orders;
      });
      return Object.values(categoryTotals).reduce((sum, val) => sum + val, 0);
    }
    
    return 0;
  }, [chartData, categoryData, categoryDataByTime]);
  
  const totalRevenue = chartData.reduce((sum, item) => sum + (parseFloat(item.revenue) || 0), 0);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-96">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-[#4782BE] border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600">Memuat data tren transaksi...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center h-96">
        <div className="text-center max-w-md">
          <div className="bg-red-100 border border-red-400 text-red-700 px-6 py-4 rounded-lg mb-4">
            <p className="font-bold text-lg mb-2">Gagal memuat data</p>
            <p className="text-sm">{error}</p>
          </div>
          {onRetry && (
            <button
              onClick={onRetry}
              className="bg-[#4782BE] text-white px-6 py-2 rounded-lg hover:bg-[#1D375B] transition-all"
            >
              Coba Lagi
            </button>
          )}
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto">
      {/* Filter Section */}
      <FilterForm
        selectedMonth={selectedMonth}
        selectedYear={selectedYear}
        onMonthChange={onMonthChange}
        onYearChange={onYearChange}
        months={months}
        years={years}
        className="mb-6"
      />

      {/* Chart Section */}
      <TransactionChart
        data={chartData}
        categoryData={categoryData}
        categoryDataByTime={categoryDataByTime}
        selectedMonth={selectedMonth}
        selectedYear={selectedYear}
        monthLabel={monthLabel}
      />

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
        <SummaryCard
          title="Total Order"
          value={totalOrders.toLocaleString('id-ID')}
          subtitle={`${monthLabel} ${selectedYear}`}
          textColor="text-[#4782BE]"
        />
        <SummaryCard
          title="Total Pendapatan"
          value={formatCurrency(totalRevenue)}
          subtitle={`${monthLabel} ${selectedYear}`}
          textColor="text-[#10B981]"
        />
      </div>

      {/* Category Trends Table */}
      <div className="mt-6">
        <CategoryTrendsTable data={categoryData} loading={loading} />
      </div>
    </div>
  );
}

