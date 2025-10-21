import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Menu, Users, Package, ShoppingCart, DollarSign, LogOut } from 'lucide-react';
import Logo from '../atoms/Logo';
import { NavItem } from '../molecules/NavItem';
import { Text } from '../atoms/Text';

export const Sidebar = ({ activeMenu = 'dashboard' }) => {
  const navigate = useNavigate();

  const handleLogout = () => {
    // Clear token and user from localStorage
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    // Redirect to login page
    window.location.href = '/login';
  };

  const menuItems = [
    { id: 'dashboard', icon: <Menu size={18} />, label: 'Dashboard'},
  ];

  return (
    <div className="w-60 bg-skill-primary h-screen flex flex-col shadow-lg">
      <Logo />
      <nav className="flex-1 px-3 py-4 space-y-1">
        {menuItems.map(item => (
          <NavItem 
            key={item.id}
            icon={item.icon}
            label={item.label}
            active={activeMenu === item.id}
            onClick={() => navigate(item.path)}
          />
        ))}
      </nav>
      <button 
        onClick={handleLogout}
        className="flex items-center gap-3 px-4 py-4 text-sm hover:bg-skill-secondary transition-colors border-t border-skill-secondary"
      >
        <LogOut size={18} />
        <Text className="font-medium text-gray-800">Logout</Text>
      </button>
    </div>
  );
};
