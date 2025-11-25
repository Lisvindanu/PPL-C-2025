import React, { useMemo } from 'react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { BarChart3 } from 'lucide-react';

export default function EnhancedTransactionChart({
  data = [],
  selectedMonth,
  selectedYear,
  monthLabel
}) {

  // Calculate statistics (tetap dipertahankan karena formatCurrency menggunakannya, 
  // namun elemen visualnya di chart akan dihapus)
  const stats = useMemo(() => {
    if (!data || data.length === 0) {
      return {
        avgOrders: 0,
        avgRevenue: 0,
        totalOrders: 0,
        totalRevenue: 0,
        maxOrders: 0,
        maxRevenue: 0
      };
    }

    const totalOrders = data.reduce((sum, item) => sum + (parseInt(item.orders) || 0), 0);
    const totalRevenue = data.reduce((sum, item) => sum + (parseFloat(item.revenue) || 0), 0);
    const avgOrders = totalOrders / data.length;
    const avgRevenue = totalRevenue / data.length;
    
    const maxOrdersItem = data.reduce((max, item) => 
      (parseInt(item.orders) || 0) > (parseInt(max.orders) || 0) ? item : max
    , data[0] || {orders: 0});
    
    const maxRevenueItem = data.reduce((max, item) => 
      (parseFloat(item.revenue) || 0) > (parseFloat(max.revenue) || 0) ? item : max
    , data[0] || {revenue: 0});

    // Menghitung trend tidak diperlukan di sini karena tidak ditampilkan
    
    return {
      avgOrders: Math.round(avgOrders),
      avgRevenue: Math.round(avgRevenue),
      maxOrders: parseInt(maxOrdersItem.orders) || 0,
      maxRevenue: parseFloat(maxRevenueItem.revenue) || 0,
      totalOrders,
      totalRevenue,
    };
  }, [data]);

  const formatCurrency = (value) => {
    if (value >= 1000000) {
      return `Rp ${(value / 1000000).toFixed(1)}jt`;
    }
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      minimumFractionDigits: 0
    }).format(value);
  };

  const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-white p-4 rounded-lg shadow-lg border border-gray-200">
          <p className="font-semibold text-gray-800 mb-2">{label}</p>
          {payload.map((entry, index) => (
            <div key={index} className="flex items-center justify-between gap-4">
              <span className="text-sm" style={{ color: entry.color }}>
                {/* Menampilkan nama data (Orders/Revenue) di Tooltip */}
                {entry.name}:
              </span>
              <span className="font-semibold" style={{ color: entry.color }}>
                {entry.name === 'Orders' ? entry.value.toLocaleString('id-ID') : formatCurrency(entry.value)}
              </span>
            </div>
          ))}
        </div>
      );
    }
    return null;
  };
  
  // Fungsi handleExport dihapus

  if (!data || data.length === 0) {
    return (
      <div className="bg-white rounded-xl shadow-sm p-8 border border-gray-200">
        <div className="text-center py-12">
          <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <BarChart3 className="w-10 h-10 text-gray-400" />
          </div>
          <h3 className="text-lg font-semibold text-gray-800 mb-2">Belum Ada Data</h3>
          <p className="text-gray-500">Tidak ada transaksi di periode yang dipilih</p>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200">
      {/* Header */}
      <div className="p-6 border-b border-gray-200">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div>
            <h2 className="text-xl font-bold text-gray-800">Tren Transaksi</h2>
            <p className="text-sm text-gray-500 mt-1">
              {monthLabel} {selectedYear}
            </p>
          </div>
          
          {/* Export Button dihapus */}
          <div className="flex items-center gap-2">
            {/* Tidak ada tombol di sini lagi */}
          </div>
        </div>
      </div>

      {/* Chart */}
      <div className="p-6">
        <ResponsiveContainer width="100%" height={400}>
          <AreaChart data={data} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
            <defs>
              <linearGradient id="colorOrders" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#4782BE" stopOpacity={0.8}/>
                <stop offset="95%" stopColor="#4782BE" stopOpacity={0.1}/>
              </linearGradient>
              <linearGradient id="colorRevenue" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#10B981" stopOpacity={0.8}/>
                <stop offset="95%" stopColor="#10B981" stopOpacity={0.1}/>
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
            <XAxis 
              dataKey="label" 
              tick={{ fill: '#6b7280', fontSize: 12 }}
              tickLine={{ stroke: '#e5e7eb' }}
            />
            {/* YAxis Orders (Kiri) - label dihilangkan */}
            <YAxis 
              yAxisId="left"
              tick={{ fill: '#6b7280', fontSize: 12 }}
              tickLine={{ stroke: '#e5e7eb' }}
              // Label Orders Dihilangkan: label={{ value: 'Orders', angle: -90, position: 'insideLeft', fill: '#4782BE', offset: 10 }}
            />
            {/* YAxis Revenue (Kanan) - label dihilangkan */}
            <YAxis 
              yAxisId="right" 
              orientation="right"
              tick={{ fill: '#6b7280', fontSize: 12 }}
              tickLine={{ stroke: '#e5e7eb' }}
              tickFormatter={formatCurrency}
              // Label Revenue Dihilangkan: label={{ value: 'Revenue', angle: 90, position: 'insideRight', fill: '#10B981', offset: 10 }}
            />
            <Tooltip content={<CustomTooltip />} />
            
            {/* Legend dihilangkan */}
            {/* ReferenceLine (Avg Orders dan Avg Revenue) dihilangkan */}

            <Area 
              yAxisId="left"
              type="monotone" 
              dataKey="orders" 
              stroke="#4782BE" 
              strokeWidth={2}
              fillOpacity={1}
              fill="url(#colorOrders)"
              name="Orders"
            />
            <Area 
              yAxisId="right"
              type="monotone" 
              dataKey="revenue" 
              stroke="#10B981" 
              strokeWidth={2}
              fillOpacity={1}
              fill="url(#colorRevenue)"
              name="Revenue"
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}