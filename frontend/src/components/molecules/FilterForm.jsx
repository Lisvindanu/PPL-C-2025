import React from 'react';
import Label from '../atoms/Label';
import Select from '../atoms/Select';

export default function FilterForm({ 
  selectedMonth, 
  selectedYear, 
  onMonthChange, 
  onYearChange,
  months = [],
  years = [],
  className = ""
}) {
  return (
    <div className={`bg-white rounded-lg shadow-sm p-6 ${className}`}>
      <div className="flex flex-col md:flex-row items-start md:items-center gap-4">
        <div className="w-full md:flex-1">
          <Label>Pilih Bulan</Label>
          <Select
            value={selectedMonth}
            onChange={(e) => onMonthChange(parseInt(e.target.value))}
            options={months.map(month => ({ value: month.value, label: month.label }))}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#4782BE] focus:border-[#4782BE] outline-none"
          />
        </div>
        <div className="w-full md:flex-1">
          <Label>Pilih Tahun</Label>
          <Select
            value={selectedYear}
            onChange={(e) => onYearChange(parseInt(e.target.value))}
            options={years.map(year => ({ value: year, label: year.toString() }))}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#4782BE] focus:border-[#4782BE] outline-none"
          />
        </div>
      </div>
    </div>
  );
}

