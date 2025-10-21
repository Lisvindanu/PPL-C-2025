import React, { useState, useEffect } from 'react';
import { User, Bell } from 'lucide-react';
import { Text } from '../atoms/Text';

export const Header = () => {
  const [user, setUser] = useState({ name: 'User', role: 'User', email: '' });

  useEffect(() => {
    const userData = typeof window !== 'undefined' 
      ? JSON.parse(localStorage.getItem('user') || 'null') 
      : null;
    
    if (userData) {
      setUser({
        name: userData.name || userData.email || 'User',
        role: userData.role || 'User',
        email: userData.email || ''
      });
    }
  }, []);

  return (
    <div className="bg-skill-bg px-6 py-5 flex justify-between items-start border-b border-skill-secondary">
      <div>
        <Text variant="h1" className="text-gray-900 mb-1">Ringkasan Dashboard</Text>
        <Text variant="caption" className="text-gray-600">
          Ringkasan statistik dan aktivitas platform Skill Connect
        </Text>
      </div>
      <div className="flex items-center gap-3">
        <button className="w-9 h-9 bg-white rounded-full flex items-center justify-center hover:bg-skill-tertiary transition-colors shadow-sm">
          <Bell size={18} className="text-gray-600" />
        </button>
        <div className="flex items-center gap-2 bg-white rounded-full px-3 py-1.5 shadow-sm hover:shadow-md transition-shadow">
          <div className="w-7 h-7 bg-gray-300 rounded-full flex items-center justify-center">
            <User size={14} />
          </div>
          <div>
            <Text className="font-semibold text-xs">{user.name}</Text>
            <Text className="text-xs text-gray-600">{user.role}</Text>
          </div>
        </div>
      </div>
    </div>
  );
};