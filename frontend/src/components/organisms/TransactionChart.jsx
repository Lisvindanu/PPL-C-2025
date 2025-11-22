import React, { useMemo } from 'react';
import { ComposedChart, Bar, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

export default function TransactionChart({ 
  data = [], 
  categoryData = [],
  categoryDataByTime = [],
  selectedMonth, 
  selectedYear,
  monthLabel = ""
}) {
  const formatCurrency = (value) => {
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      minimumFractionDigits: 0
    }).format(value);
  };

  // Get top categories (limit to 3 for cleaner chart)
  const topCategories = useMemo(() => {
    if (!categoryDataByTime || categoryDataByTime.length === 0) return [];
    // Get categories sorted by total orders
    const categoryTotals = {};
    categoryDataByTime.forEach(item => {
      if (!categoryTotals[item.kategori_nama]) {
        categoryTotals[item.kategori_nama] = 0;
      }
      categoryTotals[item.kategori_nama] += item.orders;
    });
    const sortedCategories = Object.keys(categoryTotals)
      .sort((a, b) => categoryTotals[b] - categoryTotals[a])
      .slice(0, 3); // Only top 3 categories
    return sortedCategories;
  }, [categoryDataByTime]);

  // Transform category data by time into chart format
  const chartDataWithCategories = useMemo(() => {
    // Use time series data as base
    if (data.length === 0) return [];

    // Map data with category information
    return data.map(dataPoint => {
      const result = {
        label: dataPoint.label,
        revenue: dataPoint.revenue || 0,
        orders: dataPoint.orders || 0, // Only in tooltip
      };

      // Find category data for this period
      const categoryDataForPeriod = categoryDataByTime.filter(item => {
        if (selectedMonth && selectedYear) {
          // Daily: categoryDataByTime uses YYYY-MM-DD, data uses day number
          const dayNum = parseInt(dataPoint.label);
          if (!isNaN(dayNum)) {
            const monthNum = String(selectedMonth).padStart(2, '0');
            const dateStr = `${selectedYear}-${monthNum}-${String(dayNum).padStart(2, '0')}`;
            try {
              const itemDate = new Date(item.period + 'T00:00:00');
              const targetDate = new Date(dateStr + 'T00:00:00');
              return itemDate.getTime() === targetDate.getTime();
            } catch {
              return item.period === dateStr;
            }
          }
        } else {
          // Monthly: categoryDataByTime uses YYYY-MM, data uses month name
          const monthNames = ['Januari', 'Februari', 'Maret', 'April', 'Mei', 'Juni',
            'Juli', 'Agustus', 'September', 'Oktober', 'November', 'Desember'];
          const monthIndex = monthNames.indexOf(dataPoint.label);
          if (monthIndex !== -1) {
            const currentYear = new Date().getFullYear();
            const monthStr = String(monthIndex + 1).padStart(2, '0');
            const periodStr = `${currentYear}-${monthStr}`;
            return item.period === periodStr;
          }
        }
        return false;
      });

      // Add category data - use actual order count
      let totalCategoryOrders = 0;
      topCategories.forEach(catName => {
        const catData = categoryDataForPeriod.find(item => item.kategori_nama === catName);
        const orderCount = catData ? parseInt(catData.orders) || 0 : 0;
        result[catName] = orderCount;
        totalCategoryOrders += orderCount;
      });

      // If orders is 0 or not set, use sum of category orders
      if (!result.orders || result.orders === 0) {
        result.orders = totalCategoryOrders;
      }

      return result;
    });
  }, [data, categoryDataByTime, selectedMonth, selectedYear, topCategories]);

  if (chartDataWithCategories.length === 0) {
    return (
      <div className="flex items-center justify-center h-96 text-gray-500">
        <div className="text-center">
          <p className="text-lg mb-2">Tidak ada data</p>
          <p className="text-sm">Tidak ada transaksi pada periode yang dipilih</p>
        </div>
      </div>
    );
  }

  // Generate consistent color for each category based on name hash
  // Colors are in blue theme range to match application design
  const generateCategoryColor = (categoryName) => {
    // Hash function to convert string to number
    let hash = 0;
    for (let i = 0; i < categoryName.length; i++) {
      hash = categoryName.charCodeAt(i) + ((hash << 5) - hash);
    }
    
    // Base blue theme colors (blue range: 180-240 degrees in HSL)
    // Application theme uses blues like #4782BE, #9DBBDD, #6BA3D8, #4A90C2, #2E6FA5
    // We'll generate variations within blue-cyan range (180-240 degrees)
    const baseHue = 200; // Base blue hue
    const hueRange = 60; // Range from cyan (180) to blue (240)
    const hue = baseHue + (Math.abs(hash) % hueRange); // 200-260, but we'll clamp to 180-240
    
    // Clamp hue to blue-cyan range (180-240)
    const clampedHue = Math.max(180, Math.min(240, hue));
    
    // Saturation: 40-70% (vibrant but not too bright, matching theme)
    const saturation = 40 + (Math.abs(hash >> 8) % 31); // 40-70%
    
    // Lightness: 45-70% (readable, matching theme colors)
    const lightness = 45 + (Math.abs(hash >> 16) % 26); // 45-70%
    
    // Convert HSL to RGB
    const h = clampedHue / 360;
    const s = saturation / 100;
    const l = lightness / 100;
    
    const c = (1 - Math.abs(2 * l - 1)) * s;
    const x = c * (1 - Math.abs((h * 6) % 2 - 1));
    const m = l - c / 2;
    
    let r, g, b;
    if (h < 1/6) {
      r = c; g = x; b = 0;
    } else if (h < 2/6) {
      r = x; g = c; b = 0;
    } else if (h < 3/6) {
      r = 0; g = c; b = x;
    } else if (h < 4/6) {
      r = 0; g = x; b = c;
    } else if (h < 5/6) {
      r = x; g = 0; b = c;
    } else {
      r = c; g = 0; b = x;
    }
    
    r = Math.round((r + m) * 255);
    g = Math.round((g + m) * 255);
    b = Math.round((b + m) * 255);
    
    return `#${r.toString(16).padStart(2, '0')}${g.toString(16).padStart(2, '0')}${b.toString(16).padStart(2, '0')}`;
  };

  // Generate color map for all categories (consistent across renders)
  const categoryColorMap = useMemo(() => {
    const colorMap = {};
    // Get all unique categories from categoryDataByTime
    const allCategories = new Set();
    if (categoryDataByTime && categoryDataByTime.length > 0) {
      categoryDataByTime.forEach(item => {
        if (item.kategori_nama) {
          allCategories.add(item.kategori_nama);
        }
      });
    }
    // Also include categories from categoryData
    if (categoryData && categoryData.length > 0) {
      categoryData.forEach(item => {
        if (item.kategori_nama) {
          allCategories.add(item.kategori_nama);
        }
      });
    }
    
    // Generate color for each unique category
    allCategories.forEach(catName => {
      if (!colorMap[catName]) {
        colorMap[catName] = generateCategoryColor(catName);
      }
    });
    
    return colorMap;
  }, [categoryDataByTime, categoryData]);

  return (
    <div className="bg-white rounded-lg shadow-sm p-6">
      <h2 className="text-xl font-semibold mb-6 text-gray-900">
        Grafik Tren Transaksi - {monthLabel} {selectedYear}
      </h2>
      
      <ResponsiveContainer width="100%" height={500}>
        <ComposedChart 
          data={chartDataWithCategories} 
          margin={{ top: 20, right: 30, left: 20, bottom: 60 }}
          barCategoryGap="10%"
        >
          <CartesianGrid strokeDasharray="3 3" stroke="#E5E7EB" />
          <XAxis 
            dataKey="label"
            tick={{ fontSize: 12, fill: '#666' }}
            axisLine={{ stroke: '#D1D5DB' }}
            tickLine={false}
            angle={-45}
            textAnchor="end"
            height={80}
          />
          <YAxis 
            yAxisId="left"
            tick={{ fontSize: 12, fill: '#666' }}
            axisLine={{ stroke: '#D1D5DB' }}
            tickLine={false}
            allowDecimals={false}
            tickFormatter={(value) => {
              return Math.round(value).toString();
            }}
          />
          <YAxis 
            yAxisId="right"
            orientation="right"
            tick={{ fontSize: 12, fill: '#666' }}
            axisLine={{ stroke: '#D1D5DB' }}
            tickLine={false}
            tickFormatter={(value) => {
              if (value >= 1000000) return `Rp${(value / 1000000).toFixed(1)}M`;
              if (value >= 1000) return `Rp${(value / 1000).toFixed(1)}K`;
              return `Rp${value}`;
            }}
          />
          <Tooltip 
            contentStyle={{ 
              backgroundColor: '#fff', 
              border: '1px solid #E5E7EB',
              borderRadius: '8px',
              boxShadow: '0 4px 6px rgba(0,0,0,0.1)'
            }}
            formatter={(value, name) => {
              if (name === 'revenue') {
                return formatCurrency(value);
              }
              return value;
            }}
            labelFormatter={(label) => {
              const isDaily = selectedMonth && selectedYear;
              return isDaily ? `Hari ke-${label}` : label;
            }}
            content={({ active, payload, label }) => {
              if (active && payload && payload.length) {
                const isDaily = selectedMonth && selectedYear;
                const dataPoint = chartDataWithCategories.find(d => {
                  // Match by label exactly
                  if (d.label === label) return true;
                  // For daily, also try matching day number
                  if (isDaily) {
                    const dayNum = parseInt(label);
                    if (!isNaN(dayNum) && d.label === String(dayNum)) return true;
                  }
                  return false;
                });
                
                // Get actual order counts for categories from categoryDataByTime
                const categoryDataForPeriod = categoryDataByTime.filter(item => {
                  if (selectedMonth && selectedYear) {
                    const dayNum = parseInt(label);
                    if (!isNaN(dayNum)) {
                      const monthNum = String(selectedMonth).padStart(2, '0');
                      const dateStr = `${selectedYear}-${monthNum}-${String(dayNum).padStart(2, '0')}`;
                      try {
                        const itemDate = new Date(item.period + 'T00:00:00');
                        const targetDate = new Date(dateStr + 'T00:00:00');
                        return itemDate.getTime() === targetDate.getTime();
                      } catch {
                        return item.period === dateStr;
                      }
                    }
                  } else {
                    const monthNames = ['Januari', 'Februari', 'Maret', 'April', 'Mei', 'Juni',
                      'Juli', 'Agustus', 'September', 'Oktober', 'November', 'Desember'];
                    const monthIndex = monthNames.indexOf(label);
                    if (monthIndex !== -1) {
                      const currentYear = new Date().getFullYear();
                      const monthStr = String(monthIndex + 1).padStart(2, '0');
                      const periodStr = `${currentYear}-${monthStr}`;
                      return item.period === periodStr;
                    }
                  }
                  return false;
                });

                return (
                  <div className="bg-white border border-gray-200 rounded-lg shadow-lg p-4">
                    <p className="font-semibold mb-2">
                      {isDaily ? `Hari ke-${label}` : label}
                    </p>
                    {payload.map((entry, index) => {
                      // For category entries, show actual order count
                      if (topCategories.includes(entry.name)) {
                        return (
                          <p key={index} style={{ color: entry.color }} className="text-sm">
                            {entry.name}: {entry.value} order
                          </p>
                        );
                      }
                      // For revenue
                      if (entry.name === 'revenue') {
                        return (
                          <p key={index} style={{ color: entry.color }} className="text-sm">
                            Pendapatan: {formatCurrency(entry.value)}
                          </p>
                        );
                      }
                      return null;
                    })}
                    <p className="text-sm text-gray-600 mt-2 pt-2 border-t border-gray-200">
                      <span className="font-semibold">Jumlah Order Total:</span> {
                        dataPoint
                          ? (dataPoint.orders !== undefined && dataPoint.orders !== null && parseInt(dataPoint.orders) > 0
                              ? parseInt(dataPoint.orders)
                              : topCategories.reduce((sum, catName) => sum + (parseInt(dataPoint[catName]) || 0), 0))
                          : 0
                      }
                    </p>
                  </div>
                );
              }
              return null;
            }}
          />
          {/* Category bars - grouped bar chart */}
          {topCategories.map((catName) => (
            <Bar
              key={catName}
              yAxisId="left"
              dataKey={catName}
              name={catName}
              fill={categoryColorMap[catName] || generateCategoryColor(catName)}
              radius={[6, 6, 0, 0]}
              barSize={50}
            />
          ))}
          {/* Revenue line - better for trends */}
          <Line 
            yAxisId="right"
            type="monotone" 
            dataKey="revenue" 
            name="Pendapatan"
            stroke="#10B981" 
            strokeWidth={3}
            dot={{ fill: '#10B981', r: 6 }}
            activeDot={{ r: 8 }}
            strokeDasharray="0"
          />
        </ComposedChart>
      </ResponsiveContainer>
      
      {/* Custom labels at bottom */}
      <div className="mt-4 flex items-center justify-between px-4">
        <div className="flex items-center gap-2">
          <div className="w-4 h-1 bg-[#4782BE] rounded-full"></div>
          <span className="text-sm text-gray-700">Jumlah Order</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-4 h-1 bg-[#10B981] rounded-full"></div>
          <span className="text-sm text-gray-700">Pendapatan</span>
        </div>
      </div>
      
    </div>
  );
}

