import React from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

export const OrderChart = ({ data = [] }) => {
  // Normalize input data to { month, orders }
  const chartData = React.useMemo(() => {
    if (!data || data.length === 0) return [];
    if (Array.isArray(data)) {
      // Normalize then sort by calendar month (Jan -> Dec) when possible
      const monthNameToIndex = {
        januari: 1, februari: 2, maret: 3, april: 4, mei: 5, juni: 6,
        juli: 7, agustus: 8, september: 9, oktober: 10, november: 11, desember: 12
      };

      const normalized = data.map(d => {
        const raw = d.month || d.label || d.name || '';
        const monthLower = String(raw).toLowerCase().trim();

        // Try to parse numeric month (1-12)
        const numeric = parseInt(monthLower, 10);
        let monthIndex = Number.isFinite(numeric) && numeric >= 1 && numeric <= 12 ? numeric : null;
        if (!monthIndex && monthNameToIndex[monthLower]) monthIndex = monthNameToIndex[monthLower];

        return {
          month: raw,
          monthIndex,
          orders: d.orders ?? d.value ?? d.count ?? 0
        };
      });

      // If most entries have monthIndex, sort by it (ascending Jan -> Dec)
      const haveIndex = normalized.filter(n => n.monthIndex !== null).length;
      if (haveIndex >= Math.max(1, Math.floor(normalized.length / 2))) {
        normalized.sort((a, b) => (a.monthIndex || 0) - (b.monthIndex || 0));
      }

      // Return without monthIndex for chart
      return normalized.map(n => ({ month: n.month, orders: n.orders }));
    }
    return [];
  }, [data]);

  return (
    <div className="bg-white rounded-3xl p-6 h-full shadow-sm hover:shadow-md transition-shadow border border-gray-200">
      <h2 className="text-xl font-semibold mb-1 text-gray-900">Total Pesanan</h2>
      <p className="text-sm mb-6 text-gray-600">Total pesanan client 1 tahun terakhir</p>

      <div className="w-full h-56 md:h-96">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={chartData} margin={{ top: 20, right: 20, left: -20, bottom: 40 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="#E5E7EB" />
            <XAxis dataKey="month" tick={{ fontSize: 10, fill: '#666' }} axisLine={{ stroke: '#D8E3F3' }} tickLine={false} interval={0} angle={-35} textAnchor="end" height={70} />
            <YAxis tick={{ fontSize: 11, fill: '#666' }} axisLine={{ stroke: '#D8E3F3' }} tickLine={false} allowDecimals={false} />
            <Tooltip contentStyle={{ backgroundColor: '#fff', border: '1px solid #E5E7EB', borderRadius: 8, boxShadow: '0 4px 6px rgba(0,0,0,0.1)' }} />
            <Line type="monotone" dataKey="orders" stroke="#4782BE" strokeWidth={2.5} dot={{ r: 3 }} activeDot={{ r: 5 }} />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};
