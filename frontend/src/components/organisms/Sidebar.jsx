import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  LayoutDashboard, 
  LogOut, 
  UserPen, 
  Wrench, 
  ArrowLeftRight, 
  Eye, 
  Star, 
  FileText,
  TrendingUp
} from 'lucide-react'; 
import Logo from '../atoms/Logo';
import { NavItem } from '../molecules/NavItem';
import { Text } from '../atoms/Text';
import { X } from 'lucide-react';

export const Sidebar = ({ activeMenu = 'dashboard' }) => {
  const navigate = useNavigate();
  const [mobileOpen, setMobileOpen] = useState(false);

  useEffect(() => {
    function handler() {
      setMobileOpen(prev => !prev);
    }
    window.addEventListener('toggleMobileSidebar', handler);
    return () => window.removeEventListener('toggleMobileSidebar', handler);
  }, []);

  const handleLogout = () => {
    // Clear token and user from localStorage
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    // Redirect to login page
    window.location.href = '/login';
  };

  const menuItems = [
    { id: 'dashboard', icon: <LayoutDashboard size={18} />, label: 'Operasional', path: '/admin/dashboardadmin'}, 
    { id: 'users', icon: <UserPen size={18} />, label: 'Manajemen Pengguna', path: '/admin/users'}, 
    { id: 'services', icon: <Wrench size={18} />, label: 'Manajemen Layanan', path: '/admin/services'}, 
    { id: 'transactions', icon: <ArrowLeftRight size={18} />, label: 'Daftar Transaksi', path: '/admin/transactions'}, 
    { id: 'transaction-trends', icon: <TrendingUp size={18} />, label: 'Tren Transaksi', path: '/admin/transaction-trends'}, 
    { id: 'reviews', icon: <Eye size={18} />, label: 'Review', path: '/admin/reviews'}, 
    { id: 'recommendations', icon: <Star size={18} />, label: 'Rekomendasi', path: '/admin/recommendations'}, 
    { id: 'reports', icon: <FileText size={18} />, label: 'Tinjauan Laporan', path: '/admin/reports'}, 
  ];

  return (
    <>
      {/* Desktop / md+ */}
      <div className="hidden md:flex md:w-60 bg-white h-screen flex-col shadow-lg">
        <div className="p-4">
          <Logo />
        </div>
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
          className="flex items-center gap-3 px-4 py-4 text-sm hover:bg-gray-100 transition-colors border-t border-gray-200">
           <LogOut size={18} className="text-gray-700 rotate-180" />
          <Text className="font-medium text-gray-700">Keluar</Text>
        </button>
      </div>

      {/* Mobile overlay */}
      {mobileOpen && (
        <div className="md:hidden fixed inset-0 z-50 flex">
          <div className="fixed inset-0 bg-black bg-opacity-40" onClick={() => setMobileOpen(false)} />
          <div className="relative w-72 bg-white h-full shadow-xl">
            <div className="flex items-center justify-between p-4 border-b border-gray-200">
              <Logo />
              <button onClick={() => setMobileOpen(false)} className="p-2 rounded-md hover:bg-gray-100">
                <X size={20} />
              </button>
            </div>
            <nav className="p-3 space-y-1 overflow-y-auto">
              {menuItems.map(item => (
                <NavItem 
                  key={item.id}
                  icon={item.icon}
                  label={item.label}
                  active={activeMenu === item.id}
                  onClick={() => { navigate(item.path); setMobileOpen(false); }}
                />
              ))}
            </nav>
            <div className="absolute bottom-0 w-full border-t border-gray-200">
              <button 
                onClick={() => { handleLogout(); setMobileOpen(false); }}
                className="w-full flex items-center gap-3 px-4 py-4 text-sm hover:bg-gray-100 transition-colors">
                 <LogOut size={18} className="text-gray-700 rotate-180" />
                <Text className="font-medium text-gray-700">Keluar</Text>
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};