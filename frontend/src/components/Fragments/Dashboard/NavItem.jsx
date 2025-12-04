import React from 'react';
import Icon from '../../Elements/Icons/Icon';
import { Text } from '../../Elements/Text/Text';

export const NavItem = ({ icon, label, active = false, onClick }) => (
  <button 
    onClick={onClick}
    className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-all ${
      active 
        ? 'bg-[#3F72AF] text-white shadow-sm' 
        : 'hover:bg-gray-100'
    }`}
  >
    <div className={`${active ? 'text-white' : 'text-gray-600'}`}>{icon}</div>
    <Text className={`font-medium ${active ? 'text-white' : 'text-gray-700'}`}>{label}</Text>
  </button>
);