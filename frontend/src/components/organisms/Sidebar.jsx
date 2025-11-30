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
  TrendingUp,
  ChevronDown,
  ChevronUp
} from 'lucide-react'; 
import Logo from '../atoms/Logo';
import { NavItem } from '../molecules/NavItem';
import { Text } from '../atoms/Text';
import { X } from 'lucide-react';
import ConfirmModal from '../atoms/ConfirmModal';
import { authService } from '../../services/authService';
import { useToast } from './ToastProvider';

export const Sidebar = ({ activeMenu = 'dashboard' }) => {
  const navigate = useNavigate();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [servicesOpen, setServicesOpen] = useState(false);

  // Auto-open services dropdown if active menu is services, kategori, atau subkategori
  useEffect(() => {
    if (activeMenu === 'services' || activeMenu === 'kategori' || activeMenu === 'subkategori') {
      setServicesOpen(true);
    }
  }, [activeMenu]);

  useEffect(() => {
    function handler() {
      setMobileOpen(prev => !prev);
    }
    window.addEventListener('toggleMobileSidebar', handler);
    return () => window.removeEventListener('toggleMobileSidebar', handler);
  }, []);

  const handleLogout = () => {
    authService.logout();
    navigate('/login', { replace: true });
  };

  const [showLogoutModal, setShowLogoutModal] = useState(false);
  const toast = useToast();

  const performLogout = async () => {
    try {
      await authService.logout();
      toast.show && toast.show("Anda telah logout", "success");
    } catch (e) {
      // ignore - authService.logout clears local session even on error
    } finally {
      setShowLogoutModal(false);
      navigate('/login', { replace: true });
    }
  };

  const menuItems = [
    { id: 'dashboard', icon: <LayoutDashboard size={18} />, label: 'Operasional', path: '/admin/dashboardadmin'}, 
    { id: 'users', icon: <UserPen size={18} />, label: 'Manajemen Pengguna', path: '/admin/users'}, 
    // services will be rendered as a dropdown below
    { id: 'services-group', icon: <Wrench size={18} />, label: 'Manajemen Layanan', path: '/admin/services', hasDropdown: true}, 
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
        <nav className="flex-1 px-3 py-4">
          {menuItems.map(item => {
            // Menggunakan id 'services-group' untuk dropdown
            if (item.hasDropdown && item.id === 'services-group') {
              const isServicesActive = activeMenu === 'services' || activeMenu === 'kategori' || activeMenu === 'subkategori';
              return (
                <div key={item.id} className="mb-2">
                  {/* Parent Menu Item with Dropdown Indicator */}
                  <div 
                    className={`flex items-center justify-between px-4 py-3 rounded-lg cursor-pointer transition-all ${
                      isServicesActive 
                        ? 'bg-[#4782BE] text-white shadow-md' 
                        : 'text-gray-700 hover:bg-gray-100'
                    }`}
                    onClick={() => setServicesOpen(s => !s)}
                  >
                    <div className="flex items-center gap-3">
                      <div className={isServicesActive ? 'text-white' : 'text-gray-600'}>
                        {item.icon}
                      </div>
                      <Text className={`font-medium ${isServicesActive ? 'text-white' : 'text-gray-700'}`}>
                        {item.label}
                      </Text>
                    </div>
                    {/* Dropdown Indicator */}
                    <div className={isServicesActive ? 'text-white' : 'text-gray-600'}>
                      {servicesOpen ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
                    </div>
                  </div>
                  
                  {/* Dropdown Menu Items */}
                  {servicesOpen && (
                    <div className="mt-2 ml-4 pl-6 border-l-2 border-gray-200 flex flex-col space-y-1">
                      <button 
                        onClick={() => navigate('/admin/services')} 
                        className={`text-left px-3 py-2 rounded transition-all ${
                          activeMenu === 'services'
                            ? 'bg-[#4782BE]/10 text-[#4782BE] font-medium border-l-2 border-[#4782BE] -ml-[2px]'
                            : 'text-gray-600 hover:bg-gray-100'
                        }`}
                      >
                        Layanan
                      </button>
                      <button 
                        onClick={() => navigate('/admin/kategori')} 
                        className={`text-left px-3 py-2 rounded transition-all ${
                          activeMenu === 'kategori'
                            ? 'bg-[#4782BE]/10 text-[#4782BE] font-medium border-l-2 border-[#4782BE] -ml-[2px]'
                            : 'text-gray-600 hover:bg-gray-100'
                        }`}
                      >
                        Kategori
                      </button>
                      {/* 🚨 PENAMBAHAN MENU SUB KATEGORI */}
                      <button 
                        onClick={() => navigate('/admin/subkategori')} 
                        className={`text-left px-3 py-2 rounded transition-all ${
                          activeMenu === 'subkategori'
                            ? 'bg-[#4782BE]/10 text-[#4782BE] font-medium border-l-2 border-[#4782BE] -ml-[2px]'
                            : 'text-gray-600 hover:bg-gray-100'
                        }`}
                      >
                        Sub Kategori
                      </button>
                    </div>
                  )}
                </div>
              )
            }

            return (
              <div key={item.id} className="mb-1">
                <NavItem 
                  icon={item.icon}
                  label={item.label}
                  active={activeMenu === item.id}
                  onClick={() => navigate(item.path)}
                />
              </div>
            )
          })}
        </nav>
        <button 
          onClick={() => setShowLogoutModal(true)}
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
              {menuItems.map(item => {
                if (item.hasDropdown && item.id === 'services-group') {
                  const isServicesActive = activeMenu === 'services' || activeMenu === 'kategori' || activeMenu === 'subkategori';
                  return (
                    <div key={item.id}>
                      {/* Parent Menu Item with Dropdown Indicator */}
                      <button 
                        onClick={() => setServicesOpen(s => !s)} 
                        className={`w-full flex items-center justify-between px-4 py-3 rounded-lg transition-all ${
                          isServicesActive 
                            ? 'bg-[#4782BE] text-white shadow-md' 
                            : 'hover:bg-gray-100'
                        }`}
                      >
                        <div className="flex items-center gap-3">
                          <div className={isServicesActive ? 'text-white' : 'text-gray-600'}>
                            {item.icon}
                          </div>
                          <div className={`font-medium ${isServicesActive ? 'text-white' : 'text-gray-700'}`}>
                            {item.label}
                          </div>
                        </div>
                        {/* Dropdown Indicator */}
                        <div className={isServicesActive ? 'text-white' : 'text-gray-600'}>
                          {servicesOpen ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
                        </div>
                      </button>
                      
                      {/* Dropdown Menu Items */}
                      {servicesOpen && (
                        <div className="ml-4 pl-6 mt-2 border-l-2 border-gray-200 flex flex-col gap-1">
                          <button 
                            onClick={() => { navigate('/admin/services'); setMobileOpen(false); }} 
                            className={`text-left px-3 py-2 rounded transition-all ${
                              activeMenu === 'services'
                                ? 'bg-[#4782BE]/10 text-[#4782BE] font-medium border-l-2 border-[#4782BE] -ml-[2px]'
                                : 'text-gray-600 hover:bg-gray-100'
                            }`}
                          >
                            Layanan
                          </button>
                          <button 
                            onClick={() => { navigate('/admin/kategori'); setMobileOpen(false); }} 
                            className={`text-left px-3 py-2 rounded transition-all ${
                              activeMenu === 'kategori'
                                ? 'bg-[#4782BE]/10 text-[#4782BE] font-medium border-l-2 border-[#4782BE] -ml-[2px]'
                                : 'text-gray-600 hover:bg-gray-100'
                            }`}
                          >
                            Kategori
                          </button>
      
                          <button 
                            onClick={() => { navigate('/admin/subkategori'); setMobileOpen(false); }} 
                            className={`text-left px-3 py-2 rounded transition-all ${
                              activeMenu === 'subkategori'
                                ? 'bg-[#4782BE]/10 text-[#4782BE] font-medium border-l-2 border-[#4782BE] -ml-[2px]'
                                : 'text-gray-600 hover:bg-gray-100'
                            }`}
                          >
                            Sub Kategori
                          </button>
                        </div>
                      )}
                    </div>
                  )
                }

                return (
                  <NavItem 
                    key={item.id}
                    icon={item.icon}
                    label={item.label}
                    active={activeMenu === item.id}
                    onClick={() => { navigate(item.path); setMobileOpen(false); }}
                  />
                )
              })}
            </nav>
            <div className="absolute bottom-0 w-full border-t border-gray-200">
              <button 
                onClick={() => { setShowLogoutModal(true); setMobileOpen(false); }}
                className="w-full flex items-center gap-3 px-4 py-4 text-sm hover:bg-gray-100 transition-colors">
                 <LogOut size={18} className="text-gray-700 rotate-180" />
                <Text className="font-medium text-gray-700">Keluar</Text>
              </button>
            </div>
          </div>
        </div>
      )}
      <ConfirmModal
        open={showLogoutModal}
        title="Konfirmasi Logout"
        message="Anda akan keluar dari akun admin. Apakah Anda yakin ingin melanjutkan?"
        onConfirm={performLogout}
        onCancel={() => setShowLogoutModal(false)}
        confirmText="Ya, keluar"
        cancelText="Batal"
      />
    </>
  );
};