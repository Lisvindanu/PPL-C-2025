import React, { useState, useEffect, useRef } from 'react';
import { CircleUser, Bell, Menu } from 'lucide-react'; 
import { Text } from '../atoms/Text';
import NotificationPanel from './NotificationPanel';
import { adminService } from '../../services/adminService';

export const Header = () => {
  const [user, setUser] = useState({ name: 'User', role: 'admin', email: 'admin@skillconnect.com' });
  const [isPanelOpen, setIsPanelOpen] = useState(false);
  const [alertCount, setAlertCount] = useState(0);
  const panelRef = useRef(null);
  
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

  useEffect(() => {
    // Fetch fraud alerts count on mount to show badge
    let mounted = true;
    const fetchAlerts = async () => {
      try {
        const res = await adminService.getFraudAlerts();
        if (mounted && res && res.success !== false) {
          // Backend returns an object like { anomalies: [], failedPayments: [], multipleFailures: [], total }
          const total = res.data?.total ?? res.total ?? 0;
          
          // Get read notifications from localStorage
          const readNotifications = JSON.parse(localStorage.getItem('readNotifications') || '[]');
          
          // Calculate unread count
          const unreadCount = Math.max(0, total - readNotifications.length);
          setAlertCount(unreadCount);
        }
      } catch (e) {
        // ignore
      }
    };
    fetchAlerts();
    // Poll every 30s for updated count
    const interval = setInterval(fetchAlerts, 30000);
    
    // Listen for notification read events
    const handleNotificationRead = () => {
      fetchAlerts();
    };
    window.addEventListener('notificationRead', handleNotificationRead);
    
    return () => { 
      mounted = false;
      clearInterval(interval);
      window.removeEventListener('notificationRead', handleNotificationRead);
    };
  }, []);

  // Close panel when clicking outside
  useEffect(() => {
    function handleClick(e) {
      if (!isPanelOpen) return;
      if (panelRef.current && !panelRef.current.contains(e.target)) {
        setIsPanelOpen(false);
      }
    }
    window.addEventListener('mousedown', handleClick);
    return () => window.removeEventListener('mousedown', handleClick);
  }, [isPanelOpen]);
  
  return (
    <div className="bg-white px-4 md:px-6 py-4 flex justify-between items-start border-b border-[#D8E3F3]">
      <div className="flex items-center gap-4">
        {/* Mobile hamburger */}
        <button
          onClick={() => window.dispatchEvent(new CustomEvent('toggleMobileSidebar'))}
          className="md:hidden p-2 rounded-md hover:bg-gray-100"
          aria-label="Open menu"
        >
          <Menu size={20} className="text-gray-800" />
        </button>

        <div>
          <Text variant="h1" className="text-gray-900 mb-1">Ringkasan Operasional</Text>
          <Text variant="caption" className="text-gray-600">
            Ringkasan statistik dan aktivitas platform Skill Connect
          </Text>
        </div>
      </div>
      <div className="flex items-center gap-5 relative"> 
        <button
          aria-pressed={isPanelOpen}
          onClick={() => setIsPanelOpen(prev => !prev)}
          className={`relative flex items-center justify-center transition-all ${isPanelOpen ? 'text-[#2B6CB0] scale-105' : 'hover:text-[#4782BE]'}`}
        >
          <Bell size={20} className={`text-gray-800 ${isPanelOpen ? 'text-[#2B6CB0]' : ''}`} />
          {alertCount > 0 && (
            <span className="absolute -top-1 -right-1 inline-flex items-center justify-center px-1.5 py-0.5 text-xs font-semibold leading-none text-white bg-red-600 rounded-full">{alertCount}</span>
          )}
        </button>
        {isPanelOpen && (
          <>
            <div className="fixed inset-0 bg-black bg-opacity-60 z-40" onClick={() => setIsPanelOpen(false)} />
            <div ref={panelRef} className="absolute right-6 top-16 z-50 md:right-8 md:top-16">
              <NotificationPanel onClose={() => setIsPanelOpen(false)} />
            </div>
          </>
        )}
      
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