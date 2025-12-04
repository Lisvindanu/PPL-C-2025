import React from 'react';
import { Sidebar } from '@/components/organisms/Sidebar';
import { Header } from '@/components/organisms/Header';
import { StatsGrid } from '@/components/organisms/StatsGrid';
import { UserChart } from '@/components/organisms/UserChart';
import { OrderChart } from '@/components/organisms/OrderChart';

export const DashboardLayout = ({ stats, userData, orderData, activeMenu = 'dashboard' }) => (
  <div className="flex h-screen bg-skill-primary">
    <Sidebar activeMenu={activeMenu} />
    <div className="flex-1 overflow-auto">
      <Header />
      <div className="p-6">
        <StatsGrid stats={stats} />
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
          <UserChart data={userData} />
          <OrderChart data={orderData} />
        </div>
      </div>
    </div>
  </div>
);