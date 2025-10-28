import React from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

export const OrderChart = ({ data }) => {
  // Helper function to format month labels to full form
  const formatMonthLabel = (monthStr) => {
    if (!monthStr) return 'Unknown';
    
    const monthMapping = {
      'Januari': 'Januari', 'January': 'Januari', 'Jan': 'Januari',
      'Februari': 'Februari', 'February': 'Februari', 'Feb': 'Februari',
      'Maret': 'Maret', 'March': 'Maret', 'Mar': 'Maret',
      'April': 'April', 'Apr': 'April',
      'Mei': 'Mei', 'May': 'Mei',
      'Juni': 'Juni', 'June': 'Juni', 'Jun': 'Juni',
      'Juli': 'Juli', 'July': 'Juli', 'Jul': 'Juli',
      'Agustus': 'Agustus', 'August': 'Agustus', 'Agu': 'Agustus', 'Aug': 'Agustus',
      'September': 'September', 'Sep': 'September', 'Sept': 'September',
      'Oktober': 'Oktober', 'October': 'Oktober', 'Okt': 'Oktober', 'Oct': 'Oktober',
      'November': 'November', 'Nov': 'November',
      'Desember': 'Desember', 'December': 'Desember', 'Des': 'Desember', 'Dec': 'Desember'
    };
    
    // Check if monthStr contains any of the month names
    for (const [key, value] of Object.entries(monthMapping)) {
      if (monthStr.includes(key)) {
        return value;
      }
    }
    
    // If it's in YYYY-MM format, convert to full Indonesian format
    if (monthStr.includes('-')) {
      const [year, month] = monthStr.split('-');
      const monthIndex = parseInt(month) - 1;
      const months = ['Januari', 'Februari', 'Maret', 'April', 'Mei', 'Juni',
                     'Juli', 'Agustus', 'September', 'Oktober', 'November', 'Desember'];
      return months[monthIndex] || monthStr;
    }
    
    return monthStr;
  };

  // Helper function to get month order
  const getMonthOrder = (monthStr) => {
    const indonesianMonths = ['Januari', 'Februari', 'Maret', 'April', 'Mei', 'Juni',
                             'Juli', 'Agustus', 'September', 'Oktober', 'November', 'Desember'];
    const shortMonths = ['Jan', 'Feb', 'Mar', 'Apr', 'Mei', 'Jun', 'Jul', 'Agu', 'Sep', 'Okt', 'Nov', 'Des'];
    const englishMonths = ['January', 'February', 'March', 'April', 'May', 'June',
                          'July', 'August', 'September', 'October', 'November', 'December'];
    
    // Check Indonesian month names
    for (let i = 0; i < indonesianMonths.length; i++) {
      if (monthStr.includes(indonesianMonths[i])) return i;
    }
    
    // Check short month names
    for (let i = 0; i < shortMonths.length; i++) {
      if (monthStr.includes(shortMonths[i])) return i;
    }
    
    // Check English month names
    for (let i = 0; i < englishMonths.length; i++) {
      if (monthStr.toLowerCase().includes(englishMonths[i].toLowerCase())) return i;
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
        { month: 'Januari', orders: 0, monthOrder: 0 },
        { month: 'Februari', orders: 0, monthOrder: 1 },
        { month: 'Maret', orders: 0, monthOrder: 2 },
        { month: 'April', orders: 0, monthOrder: 3 },
        { month: 'Mei', orders: 0, monthOrder: 4 },
        { month: 'Juni', orders: 0, monthOrder: 5 },
        { month: 'Juli', orders: 0, monthOrder: 6 },
        { month: 'Agustus', orders: 0, monthOrder: 7 },
        { month: 'September', orders: 0, monthOrder: 8 },
        { month: 'Oktober', orders: 2, monthOrder: 9 },
        { month: 'November', orders: 0, monthOrder: 10 },
        { month: 'Desember', orders: 0, monthOrder: 11 }
      ];
    }
    
    // Sort by month order
    return processedData.sort((a, b) => a.monthOrder - b.monthOrder);
  }, [data]);

  return (
    <div className="bg-white rounded-3xl p-6 h-full shadow-sm hover:shadow-md transition-shadow border border-gray-200">
      <h2 className="text-xl font-semibold mb-1 text-gray-900">Total Pesanan</h2>
      <p className="text-sm mb-6 text-gray-600">Total pesanan client 1 tahun terakhir</p>
      
      <ResponsiveContainer width="100%" height={400}>
        <LineChart data={chartData} margin={{ top: 20, right: 20, left: -20, bottom: 40 }}>
          <CartesianGrid strokeDasharray="0" stroke="#D8E3F3" vertical={false} />
          <XAxis 
            dataKey="month" 
            tick={{ fontSize: 10, fill: '#666' }}
            axisLine={{ stroke: '#D8E3F3' }}
            tickLine={false}
            interval={0}
            angle={-35}
            textAnchor="end"
            height={70}
          />
          <YAxis 
            tick={{ fontSize: 11, fill: '#666' }}
            axisLine={{ stroke: '#D8E3F3' }}
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
            stroke="#4782BE" 
            strokeWidth={2.5}
            dot={{ fill: '#4782BE', r: 4 }}
            activeDot={{ r: 6 }}
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
};
