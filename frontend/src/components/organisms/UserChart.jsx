import React from 'react';
import { PieChart, Pie, Cell, ResponsiveContainer } from 'recharts';
import { Text } from '../atoms/Text';

export const UserChart = ({ data }) => {
  const COLORS = ['#A8B88F', '#C8D5B0', '#E0E5C8'];
  
  // Handle different data formats and ensure we have an array
  const chartData = React.useMemo(() => {
    if (!data) {
      return [
        { name: 'Aktif', value: 0 },
        { name: 'Diblokir', value: 0 },
        { name: 'Nonaktif', value: 0 }
      ];
    }
    
    let processedData = [];
    
    // If data is already in the correct format (array of objects with name/value)
    if (Array.isArray(data) && data.length > 0 && data[0].name && data[0].value !== undefined) {
      processedData = data;
    }
    // If data is in Chart.js format (with labels and datasets)
    else if (data.labels && data.datasets && Array.isArray(data.labels)) {
      processedData = data.labels.map((label, index) => ({
        name: label,
        value: data.datasets[0]?.data[index] || 0
      }));
    }
    // If data is an array but not in the right format
    else if (Array.isArray(data)) {
      processedData = data.map((item, index) => ({
        name: item.name || item.label || `Item ${index + 1}`,
        value: item.value || item.count || 0
      }));
    }
    // Single object format
    else if (typeof data === 'object') {
      processedData = Object.keys(data).map(key => ({
        name: key,
        value: data[key] || 0
      }));
    }
    
    // Ensure we always have the 3 main categories
    const categoryNames = ['Aktif', 'Diblokir', 'Nonaktif'];
    const completeData = categoryNames.map(categoryName => {
      const existing = processedData.find(item => 
        item.name.toLowerCase() === categoryName.toLowerCase()
      );
      return existing || { name: categoryName, value: 0 };
    });
    
    return completeData;
  }, [data]);
  
  const total = chartData.reduce((sum, item) => sum + (item.value || 0), 0);
  
  return (
    <div className="bg-skill-secondary rounded-3xl p-6 h-full shadow-sm hover:shadow-md transition-shadow">
      <Text variant="h2" className="mb-1 text-gray-900">Total Pengguna</Text>
      <Text variant="caption" className="mb-6 text-gray-600">Riwayat akun pengguna website SkillConnect</Text>
      
      <div className="relative flex items-center justify-center mb-8">
        <div style={{ width: '280px', height: '280px', position: 'relative' }}>
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={chartData}
                cx="50%"
                cy="50%"
                innerRadius={80}
                outerRadius={120}
                paddingAngle={0}
                dataKey="value"
                startAngle={90}
                endAngle={450}
              >
                {chartData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} stroke="none" />
                ))}
              </Pie>
            </PieChart>
          </ResponsiveContainer>
          
          {/* Center total number */}
          <div className="absolute" style={{ top: '50%', left: '50%', transform: 'translate(-50%, -50%)' }}>
            <Text className="text-center text-3xl font-bold text-gray-900">
              {total.toLocaleString()}
            </Text>
          </div>
          
          {/* Labels positioned dynamically inside the donut ring */}
          {chartData.map((entry, index) => {
            if (entry.value === 0) return null; // Don't show label for 0 values
            
            const percentage = total > 0 ? ((entry.value / total) * 100).toFixed(2) : '0.00';
            
            // Calculate position based on slice angle
            let cumulativeValue = 0;
            for (let i = 0; i < index; i++) {
              cumulativeValue += chartData[i].value || 0;
            }
            
            // Starting angle is 90 degrees (top), going clockwise
            const startAngle = 90 + (cumulativeValue / total) * 360;
            const sliceAngle = ((entry.value || 0) / total) * 360;
            const midAngle = startAngle + sliceAngle / 2; // Middle of the slice
            
            // Convert to radians for positioning
            const angleRad = (midAngle * Math.PI) / 180;
            
            // Position in the middle of the donut ring
            // Chart is 280px, center at 140px, ring is between radius 80-120, so middle is at 100px from center
            const radiusPixels = 100;
            const centerX = 140; // Half of 280px
            const centerY = 140;
            const x = centerX + Math.cos(angleRad) * radiusPixels;
            const y = centerY + Math.sin(angleRad) * radiusPixels;
            
            return (
              <div 
                key={index} 
                className="absolute pointer-events-none" 
                style={{ 
                  left: `${x}px`, 
                  top: `${y}px`,
                  transform: 'translate(-50%, -50%)'
                }}
              >
                <Text className="text-xs text-gray-700 whitespace-nowrap text-center font-medium">{entry.name}</Text>
                <Text className="text-xs font-bold text-gray-900 text-center">{percentage}%</Text>
              </div>
            );
          })}
        </div>
      </div>

      <div className="grid grid-cols-3 gap-4 pt-4 border-t border-gray-300">
        {chartData.map((entry, index) => (
          <div key={index} className="text-center">
            <Text className="text-gray-700 mb-1 text-xs">{entry.name}</Text>
            <Text className="text-xl font-bold text-gray-900">{entry.value?.toLocaleString() || '0'}</Text>
          </div>
        ))}
      </div>
    </div>
  );
};