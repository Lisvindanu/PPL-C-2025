import React from 'react';
import Icon from '../atoms/Icon';
import { Text } from '../atoms/Text';

export const NavItem = ({ icon, label, active = false, onClick }) => (
  <button 
    onClick={onClick}
    className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-all ${
      active ? 'bg-skill-tertiary shadow-sm' : 'hover:bg-skill-secondary'
    }`}
  >
    <Icon>{icon}</Icon>
    <Text className="font-medium text-gray-800">{label}</Text>
  </button>
);
