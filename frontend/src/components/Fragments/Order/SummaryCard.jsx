import React from 'react';

export default function SummaryCard({ 
  title, 
  value, 
  subtitle, 
  textColor = "text-[#4782BE]",
  className = "" 
}) {
  return (
    <div className={`bg-white rounded-lg shadow-sm p-6 ${className}`}>
      <h3 className="text-sm font-medium text-gray-600 mb-2">{title}</h3>
      <p className={`text-3xl font-bold ${textColor}`}>
        {value}
      </p>
      {subtitle && (
        <p className="text-sm text-gray-500 mt-2">{subtitle}</p>
      )}
    </div>
  );
}

