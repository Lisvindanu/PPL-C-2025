import React from 'react';
import Icon from '../atoms/Icon';
import { Text } from '../atoms/Text';

export const StatCard = ({ title, value, icon, bgColor = "bg-skill-primary" }) => (
  <div className={`${bgColor} rounded-3xl p-5 flex items-center justify-between hover:shadow-md transition-shadow`}>
    <div>
      <Text variant="caption" className="text-gray-600 mb-1">{title}</Text>
      <Text variant="h1" className="text-gray-900">{value}</Text>
    </div>
    <Icon className="w-12 h-12 bg-white rounded-full shadow-sm">
      {icon}
    </Icon>
  </div>
);