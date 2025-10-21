import React from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { Text } from '../atoms/Text';

export const OrderChart = ({ data }) => {
  // Helper function to format month labels
  const formatMonthLabel = (monthStr) => {
    if (!monthStr) return 'Unknown';
    
    // If it's already in Indonesian format, return as is
    const indonesianMonths = ['Januari', 'Februari', 'Maret', 'April', 'Mei', 'Juni',
                             'Juli', 'Agustus', 'September', 'Oktober', 'November', 'Desember'];
    if (indonesianMonths.some(month => monthStr.includes(month))) {
      return monthStr;
    }
    
    // If it's in YYYY-MM format, convert to Indonesian format
    if (monthStr.includes('-')) {
      const [year, month] = monthStr.split('-');
      const monthIndex = parseInt(month) - 1;
      return indonesianMonths[monthIndex] || monthStr;
    }
    
    return monthStr;
  };

  // Helper function to get month order
  const getMonthOrder = (monthStr) => {
    const indonesianMonths = ['Januari', 'Februari', 'Maret', 'April', 'Mei', 'Juni',
                             'Juli', 'Agustus', 'September', 'Oktober', 'November', 'Desember'];
    const shortMonths = ['Jan', 'Feb', 'Mar', 'Apr', 'Mei', 'Jun', 'Jul', 'Ags', 'Sep', 'Okt', 'Nov', 'Des'];
    
    // Check Indonesian month names
    for (let i = 0; i < indonesianMonths.length; i++) {
      if (monthStr.includes(indonesianMonths[i])) return i;
    }
    
    // Check short month names
    for (let i = 0; i < shortMonths.length; i++) {
      if (monthStr.includes(shortMonths[i])) return i;
    }
    
    return 0;
  };

  // Handle different data formats and ensure we have an array
  const chartData = React.useMemo(() => {
    if (!data) return [];
    
    let processedData = [];
    
    // If data is already in the correct format (array of objects with month/orders)
    if (Array.isArray(data) && data.length > 0 && (data[0].month || data[0].orders)) {
      processedData = data.map(item => ({
        month: formatMonthLabel(item.month),
        orders: item.orders || 0,
        monthOrder: getMonthOrder(formatMonthLabel(item.month))
      }));
    }
    // If data is in Chart.js format (with labels and datasets)
    else if (data.labels && data.datasets && Array.isArray(data.labels)) {
      processedData = data.labels.map((label, index) => ({
        month: formatMonthLabel(label),
        orders: data.datasets[0]?.data[index] || 0,
        monthOrder: getMonthOrder(formatMonthLabel(label))
      }));
    }
    // If data is an array but not in the right format, create default data
    else if (Array.isArray(data)) {
      processedData = data.map((item, index) => ({
        month: formatMonthLabel(item.month || item.label) || `Month ${index + 1}`,
        orders: item.orders || item.value || item.count || 0,
        monthOrder: getMonthOrder(formatMonthLabel(item.month || item.label))
      }));
    }
    // Default fallback data
    else {
      processedData = [
        { month: 'Jan', orders: 0, monthOrder: 0 },
        { month: 'Feb', orders: 0, monthOrder: 1 },
        { month: 'Mar', orders: 0, monthOrder: 2 },
        { month: 'Apr', orders: 0, monthOrder: 3 },
        { month: 'Mei', orders: 0, monthOrder: 4 },
        { month: 'Jun', orders: 0, monthOrder: 5 }
      ];
    }
    
    // Sort by month order
    return processedData.sort((a, b) => a.monthOrder - b.monthOrder);
  }, [data]);

  return (
    <div className="bg-skill-secondary rounded-3xl p-6 h-full shadow-sm hover:shadow-md transition-shadow">
      <Text variant="h2" className="mb-1 text-gray-900">Total Pesanan</Text>
      <Text variant="caption" className="mb-6 text-gray-600">Total pesanan client 1 tahun terakhir</Text>
      
      <ResponsiveContainer width="100%" height={280}>
        <LineChart data={chartData} margin={{ top: 10, right: 10, left: -20, bottom: 5 }}>
          <CartesianGrid strokeDasharray="0" stroke="#c8d5c8" vertical={false} />
          <XAxis 
            dataKey="month" 
            tick={{ fontSize: 11, fill: '#666' }}
            axisLine={{ stroke: '#c8d5c8' }}
            tickLine={false}
          />
          <YAxis 
            tick={{ fontSize: 11, fill: '#666' }}
            axisLine={{ stroke: '#c8d5c8' }}
            tickLine={false}
            domain={[0, 'dataMax']}
            tickCount={6}
          />
          <Tooltip 
            contentStyle={{ 
              backgroundColor: '#fff', 
              border: 'none',
              borderRadius: '8px',
              boxShadow: '0 2px 8px rgba(0,0,0,0.1)'
            }}
          />
          <Line 
            type="monotone" 
            dataKey="orders" 
            stroke="#A8B88F" 
            strokeWidth={2}
            dot={{ fill: '#A8B88F', r: 3 }}
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
};