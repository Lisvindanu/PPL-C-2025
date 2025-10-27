import React from 'react';
import { Text } from '../atoms/Text';

export const StatCard = ({ title, value, icon, bgColor = "bg-white" }) => (
  <div className={`${bgColor} rounded-3xl p-5 flex items-center justify-between hover:shadow-md transition-shadow border border-[#D8E3F3]`}>
    <div>
      <Text variant="caption" className="text-gray-600 mb-1">{title}</Text>
      <Text variant="h1" className="text-gray-900">{value}</Text>
    </div>
    <div className="flex items-center justify-center">
      {React.cloneElement(icon, { strokeWidth: 2 })}
    </div>
  </div>
);