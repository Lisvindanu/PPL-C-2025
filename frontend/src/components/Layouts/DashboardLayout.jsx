import React from 'react';
import { Sidebar } from '../Fragments/Admin/Sidebar';
import { Header } from '../Fragments/Admin/Header';
import { StatsGrid } from '../Fragments/Profile/StatsGrid';
import { UserChart } from '../Fragments/Admin/UserChart';
import { OrderChart } from '../Fragments/Admin/OrderChart';

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