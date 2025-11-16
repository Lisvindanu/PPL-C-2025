import React, { useState, useEffect } from 'react';
import { CircleUser, Bell } from 'lucide-react'; 
import { Text } from '../atoms/Text';

export const Header = ({ title = 'Ringkasan Operasional', subtitle = 'Ringkasan statistik dan aktivitas platform Skill Connect' }) => {
  const [user, setUser] = useState({ name: 'User', role: 'admin', email: 'admin@skillconnect.com' });
  
  useEffect(() => {
    const userData = typeof window !== 'undefined' 
      ? JSON.parse(localStorage.getItem('user') || 'null') 
      : null;
    
    if (userData) {
      setUser({
        name: userData.name || userData.email || 'John Doe',
        role: userData.role || 'Administrator',
        email: userData.email || 'admin@skillconnect.com'
      });
    }
  }, []);
  
 return (
    <div className="bg-white px-6 py-5 flex justify-between items-start border-b border-[#D8E3F3]">
      <div>
        {}
        <Text variant="h1" className="text-gray-900 mb-1">{title}</Text> 
        {}
        <Text variant="caption" className="text-gray-600">
          {subtitle}
        </Text>
      </div>
      {}
      <div className="flex items-center gap-5"> 
        <button className="flex items-center justify-center hover:text-[#4782BE] transition-colors">
          <Bell size={20} className="text-gray-800" />
        </button>
      
        <div className="flex items-center gap-2">
          <div className="flex items-center justify-center">
            <CircleUser size={20} className="text-gray-800" /> 
          </div>
          <div>
            <Text className="font-medium text-sm text-gray-900 leading-none">{user.email}</Text>
            <Text className="text-xs text-gray-600 leading-none">{user.role}</Text>
          </div>
        </div>
      </div>
    </div>
  );
};