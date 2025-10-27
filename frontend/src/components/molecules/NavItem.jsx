import React from 'react';
import Icon from '../atoms/Icon';
import { Text } from '../atoms/Text';

export const NavItem = ({ icon, label, active = false, onClick }) => (
  <button 
    onClick={onClick}
    className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-all ${
      active 
        ? 'bg-[#4782BE] shadow-sm' 
        : 'hover:bg-[#4782BE] hover:bg-opacity-50'
    }`}
  >
    <div className="text-white">{icon}</div>
    <Text className={`font-medium ${active ? 'text-white' : 'text-gray-200'}`}>{label}</Text>
  </button>
);